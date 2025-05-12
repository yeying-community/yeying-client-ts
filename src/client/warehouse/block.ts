import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import {
    Block,
    BlockMetadata,
    BlockMetadataSchema,
    ConfirmBlockRequestBodySchema,
    ConfirmBlockRequestSchema,
    ConfirmBlockResponseBodySchema,
    GetBlockRequestBodySchema,
    GetBlockRequestSchema,
    GetBlockResponseBodySchema,
    PutBlockRequestBodySchema,
    PutBlockRequestSchema,
    PutBlockResponseBodySchema
} from '../../yeying/api/asset/block_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import { signBlockMetadata, verifyBlockMetadata } from '../model/model'
import { isExisted } from '../../common/status'
import { digest, encodeHex, getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 用于与区块链交互，提供数据的获取和存储功能
 */
export class BlockProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof Block>

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @example
     * ```ts
     * const providerOption = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const blockProvider = new BlockProvider(providerOption)
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Block,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 获取当前用户的 DID（所有者）
     * @returns 返回当前用户的 DID
     * @example
     * ```ts
     * const owner = blockProvider.getOwner()
     * ```
     */
    getOwner() {
        return this.authenticate.getDid()
    }

    /**
     * 获取资产块数据。
     * @param namespaceId 资产块命名空间
     * @param hash - 要获取的资产块哈希值
     * @returns 一个 Promise，解析为获取到的区块数据（Uint8Array）
     * @example
     * ```ts
     * blockProvider.get('example-namespace', 'example-hash')
     *   .then(data => console.log(data))
     *   .catch(err => console.error(err))
     * ```
     */
    get(namespaceId: string, hash: string) {
        return new Promise<any>(async (resolve, reject) => {
            const body = create(GetBlockRequestBodySchema, {
                namespaceId: namespaceId,
                hash: hash
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(GetBlockRequestBodySchema, body))
            } catch (err) {
                console.error(`Fail to create header when getting chunk content, hash=${hash}`, err)
                return reject(err)
            }

            const request = create(GetBlockRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.get(request)
                await this.authenticate.doResponse(res, GetBlockResponseBodySchema)
                resolve({data: res.data, block: res.body?.block})
            } catch (err) {
                console.error('Fail to get block', err)
            }
        })
    }

    /**
     * 发送确认请求到后端服务，并验证返回的块元数据签名
     * @param block - 块元数据对象
     * @returns 返回确认块的响应体
     * @example
     * ```ts
     * const blockMetadata = await blockProvider.createBlockMetadata('example-namespace', new Uint8Array([1, 2, 3]))
     * blockProvider.confirm(blockMetadata)
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    confirm(block: BlockMetadata) {
        return new Promise<BlockMetadata | undefined>(async (resolve, reject) => {
            const body = create(ConfirmBlockRequestBodySchema, { block: block })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(ConfirmBlockRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when confirming block', err)
                return reject(err)
            }

            const request = create(ConfirmBlockRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.confirm(request)
                await this.authenticate.doResponse(res, ConfirmBlockResponseBodySchema)
                if (res.body?.block !== undefined) {
                    await verifyBlockMetadata(res.body?.block)
                }

                return resolve(res.body?.block)
            } catch (err) {
                console.error('Fail to put block', err)
                return reject(err)
            }
        })
    }

    /**
     * 上传块数据,发送块数据和元数据到后端服务，并验证返回的块元数据签名
     * @param namespaceId 命名空间ID
     * @param data 块数据
     *
     * @returns 资产块元信息
     *
     * @example
     * ```ts
     * const blockMetadata = await blockProvider.createBlockMetadata('example-namespace', new Uint8Array([1, 2, 3]))
     * blockProvider.put(blockMetadata, new Uint8Array([1, 2, 3]))
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    put(namespaceId: string, data: Uint8Array) {
        return new Promise<BlockMetadata>(async (resolve, reject) => {
            const block = create(BlockMetadataSchema, {
                namespaceId: namespaceId,
                hash: encodeHex(await digest(data, 'SHA-256')),
                owner: this.authenticate.getDid(),
                uploader: this.authenticate.getDid(),
                createdAt: getCurrentUtcString(),
                size: BigInt(data.length)
            })
            await signBlockMetadata(this.authenticate, block)

            // 判断这个块是否已经上传,避免重传
            const existing = await this.confirm(block)
            if (existing) {
                return resolve(existing)
            }

            const body = create(PutBlockRequestBodySchema, { block: block })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(PutBlockRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when putting chunk content', err)
                return reject(err)
            }

            const request = create(PutBlockRequestSchema, { header: header, body: body, data: data })
            try {
                const res = await this.client.put(request)
                await this.authenticate.doResponse(res, PutBlockResponseBodySchema, isExisted)
                await verifyBlockMetadata(res.body?.block)
                return resolve(res.body?.block as BlockMetadata)
            } catch (err) {
                console.error(`Fail to put block=${JSON.stringify(toJson(BlockMetadataSchema, block))}`, err)
                return reject(err)
            }
        })
    }
}
