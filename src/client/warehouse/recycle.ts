import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import {
    DeletedAssetMetadataJson,
    DeletedAssetMetadataSchema,
    RecoverDeletedAssetRequestBodySchema,
    RecoverDeletedAssetRequestSchema,
    RecoverDeletedAssetResponseBodySchema,
    Recycle,
    RemoveDeletedAssetRequestBodySchema,
    RemoveDeletedAssetRequestSchema,
    RemoveDeletedAssetResponseBodySchema,
    SearchDeletedAssetRequestBodySchema,
    SearchDeletedAssetRequestSchema,
    SearchDeletedAssetResponseBodySchema
} from '../../yeying/api/asset/recycle_pb'
import { SearchAssetConditionJson, SearchAssetConditionSchema } from '../../yeying/api/asset/asset_pb'
import { RequestPageSchema } from '../../yeying/api/common/message_pb'
import { verifyAssetMetadata } from '../model/model'

/**
 * 区块提供者类，用于与区块链交互，提供数据的获取和存储功能。
 *
 * @example
 * ```ts
 * const blockProvider = new BlockProvider(authenticate, option);
 * const data = await blockProvider.get(hash);
 * console.log(data);
 * ```
 */
export class RecycleProvider {
    private authenticate: Authenticate
    private client: Client<typeof Recycle>

    /**
     * 创建命名空间供应商。
     *
     * @param option {ProviderOption} 指定供应商选项。
     *
     * @example
     * ```ts
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const recycleProvider = new RecycleProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Recycle,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 搜索资产。
     *
     * @param condition 搜索条件。
     * @param page 页码。
     * @param pageSize 每页数量。
     *
     * @returns {Promise<DeletedAssetMetadataJson[]>} 当前页面的删除的资产元信息。
     *
     */
    search(page: number, pageSize: number, condition: SearchAssetConditionJson): Promise<DeletedAssetMetadataJson[]> {
        return new Promise<DeletedAssetMetadataJson[]>(async (resolve, reject) => {
            const requestPage = create(RequestPageSchema, {
                page: page,
                pageSize: pageSize
            })
            const c = fromJson(SearchAssetConditionSchema, condition ?? {})
            const body = create(SearchDeletedAssetRequestBodySchema, {
                condition: c,
                page: requestPage
            })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SearchDeletedAssetRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for searching deleted assets', err)
                return reject(err)
            }

            const request = create(SearchDeletedAssetRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchDeletedAssetResponseBodySchema)
                const deletedAssets: DeletedAssetMetadataJson[] = []
                if (res?.body?.assets !== undefined) {
                    for (const deletedAsset of res.body.assets) {
                        const deletedAssetJson = toJson(DeletedAssetMetadataSchema, deletedAsset, {
                            alwaysEmitImplicit: true
                        }) as DeletedAssetMetadataJson
                        try {
                            await verifyAssetMetadata(deletedAsset.asset)
                            deletedAssets.push(deletedAssetJson)
                        } catch (err) {
                            console.error(
                                `Fail to verify deleted asset=${JSON.stringify(deletedAssetJson)} when searching`,
                                err
                            )
                        }
                    }
                }

                resolve(deletedAssets)
            } catch (err) {
                console.error('Fail to search deleted assets', err)
                return reject(err)
            }
        })
    }

    /**
     * 恢复删除资产。
     *
     * @param namespaceId 资产的唯一标识符。
     * @param hash 资产哈希值。
     *
     */
    recover(namespaceId: string, hash: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(RecoverDeletedAssetRequestBodySchema, {
                namespaceId: namespaceId,
                hash: hash
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(RecoverDeletedAssetRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when removing from recycle', err)
                return reject(err)
            }

            const request = create(RecoverDeletedAssetRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.recover(request)
                await this.authenticate.doResponse(res, RecoverDeletedAssetResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to recover asset from recycle', err)
                return reject(err)
            }
        })
    }

    /**
     * 永久删除资产。
     *
     * @param namespaceId 资产的唯一标识符。
     * @param hash 资产哈希值。
     *
     * @returns Promise，解析为删除响应。
     *
     */
    remove(namespaceId: string, hash: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(RemoveDeletedAssetRequestBodySchema, {
                namespaceId: namespaceId,
                hash: hash
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(RemoveDeletedAssetRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when removing from recycle', err)
                return reject(err)
            }

            const request = create(RemoveDeletedAssetRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.remove(request)
                await this.authenticate.doResponse(res, RemoveDeletedAssetResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to remove from recycle', err)
                return reject(err)
            }
        })
    }
}
