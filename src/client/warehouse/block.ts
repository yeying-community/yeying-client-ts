import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import {
    Block,
    BlockMetadata,
    BlockMetadataJson,
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
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { signBlockMetadata, verifyBlockMetadata } from '../model/model'
import { isExisted } from '../../common/status'
import { digest, encodeHex, getCurrentUtcString } from '@yeying-community/yeying-web3'
import { BlockDetail } from './model'

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
     *
     * @returns 返回当前用户的 DID
     *
     */
    getOwner() {
        return this.authenticate.getDid()
    }

    /**
     * 获取资产块数据。
     *
     * @param namespaceId 资产块命名空间
     * @param hash - 要获取的资产块哈希值
     *
     * @returns 区块数据详情，包括数据和元数据
     *
     */
    get(namespaceId: string, hash: string) {
        return new Promise<BlockDetail>(async (resolve, reject) => {
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

            const request = create(GetBlockRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.get(request)
                await this.authenticate.doResponse(res, GetBlockResponseBodySchema)
                const detail: BlockDetail = {
                    data: res.data,
                    block: toJson(BlockMetadataSchema, res.body?.block as BlockMetadata, {alwaysEmitImplicit: true})
                }

                resolve(detail)
            } catch (err) {
                console.error('Fail to get block', err)
                return reject(err)
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
    confirm(block: BlockMetadataJson) {
        return new Promise<BlockMetadataJson>(async (resolve, reject) => {
            const body = create(ConfirmBlockRequestBodySchema, { block: fromJson(BlockMetadataSchema, block) })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(ConfirmBlockRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when confirming block', err)
                return reject(err)
            }

            const request = create(ConfirmBlockRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.confirm(request)
                await this.authenticate.doResponse(res, ConfirmBlockResponseBodySchema)
                if (res.body?.block !== undefined) {
                    await verifyBlockMetadata(res.body?.block)
                }
                return resolve(toJson(BlockMetadataSchema, res.body?.block as BlockMetadata, {alwaysEmitImplicit: true}))
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
     * const block = await blockProvider.createBlockMetadata('example-namespace', new Uint8Array([1, 2, 3]))
     * blockProvider.put(blockMetadata, new Uint8Array([1, 2, 3]))
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    put(namespaceId: string, data: Uint8Array) {
        return new Promise<BlockMetadataJson>(async (resolve, reject) => {
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
            const existing = await this.confirm({
                namespaceId: block.namespaceId,
                uploader: block.uploader,
                owner: block.owner,
                hash: block.hash,
                size: String(block.size),
                createdAt: block.createdAt,
                signature: block.signature
            })
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

            const request = create(PutBlockRequestSchema, {
                header: header,
                body: body,
                data: data
            })
            try {
                const res = await this.client.put(request)
                await this.authenticate.doResponse(res, PutBlockResponseBodySchema, isExisted)
                await verifyBlockMetadata(res.body?.block)
                return resolve(toJson(BlockMetadataSchema, res.body?.block as BlockMetadata, {alwaysEmitImplicit: true}))
            } catch (err) {
                console.error(`Fail to put block=${JSON.stringify(toJson(BlockMetadataSchema, block))}`, err)
                return reject(err)
            }
        })
    }
}
