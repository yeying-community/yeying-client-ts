import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { Client, createClient, type Transport } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import {
    CreateNamespaceRequestBodySchema,
    CreateNamespaceRequestSchema,
    CreateNamespaceResponseBodySchema,
    Namespace,
    NamespaceMetadata,
    NamespaceMetadataSchema,
    SearchNamespaceCondition,
    SearchNamespaceConditionSchema,
    SearchNamespaceRequestBodySchema,
    SearchNamespaceRequestSchema,
    SearchNamespaceResponseBody,
    SearchNamespaceResponseBodySchema
} from '../../yeying/api/asset/namespace_pb'
import { generateUuid } from '../../common/string'
import { RequestPageSchema } from '../../yeying/api/common/message_pb'
import { ConfigTypeEnum } from '../../yeying/api/config/config_pb'
import { ConfigProvider } from '../config/config'
import { signNamespaceMetadata, verifyNamespaceMetadata } from '../model/model'
import { NotFound } from '../../common/error'
import { getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 命名空间提供者类，用于管理命名空间
 *
 */
export class NamespaceProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof Namespace>
    private configProvider: ConfigProvider

    /**
     * 创建命名空间供应商。
     *
     * @param option {ProviderOption} 指定供应商选项。
     *
     * @example
     * ```ts
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const namespaceProvider = new NamespaceProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        const transport: Transport = createGrpcWebTransport({
            baseUrl: option.proxy,
            useBinaryFormat: true
        })

        this.client = createClient(Namespace, transport)
        this.configProvider = new ConfigProvider(option)
    }

    async getDefaultNamespace() {
        try {
            const configMetadata = await this.configProvider.get('namespace.default', ConfigTypeEnum.CONFIG_TYPE_USER)
            return configMetadata.value
        } catch (err) {
            if (err instanceof NotFound) {
                return undefined
            } else {
                throw err
            }
        }
    }

    async setDefaultNamespace(namespaceId: string) {
        return await this.configProvider.set('namespace.default', namespaceId)
    }

    /**
     * 搜索命名空间
     *
     * @param page 第几页，从1开始。
     * @param pageSize 页面大小。
     * @param condition 可选，搜索条件
     *
     * @returns 当前页面的命名空间列表
     *
     * @throws ServiceUnavailable 服务不可用
     * @example
     * ```ts
     * const data = await namespaceProvider.get('someHash');
     * console.log(data); // 输出区块数据
     * ```
     */
    search(page: number, pageSize: number, condition?: Partial<SearchNamespaceCondition>) {
        return new Promise<NamespaceMetadata[]>(async (resolve, reject) => {
            const body = create(SearchNamespaceRequestBodySchema, {
                condition: create(SearchNamespaceConditionSchema, { name: condition?.name }),
                page: create(RequestPageSchema, { page: page, pageSize: pageSize })
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SearchNamespaceRequestBodySchema, body))
            } catch (err) {
                console.error(`Fail to create header when searching namespace, page=${page}, pageSize=${pageSize}`, err)
                return reject(err)
            }

            const request = create(SearchNamespaceRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchNamespaceResponseBodySchema)
                const resBody = res.body as SearchNamespaceResponseBody
                const namespaces: NamespaceMetadata[] = []
                for (const n of resBody.namespaces) {
                    try {
                        await verifyNamespaceMetadata(n)
                        namespaces.push(n)
                    } catch (err) {
                        console.error(`Fail to verify namespace=${JSON.stringify(toJson(NamespaceMetadataSchema, n))}`)
                    }
                }

                resolve(namespaces)
            } catch (err) {
                console.error('Fail to search namespace', err)
                return reject(err)
            }
        })
    }

    /**
     * 创建命名空间
     *
     * @param name 命名空间名称
     * @param description 命名空间描述
     *
     * @returns 命名空间元信息
     *
     * @throws ServiceUnavailable 服务不可用
     */
    create(name: string, description: string, uid?: string, participants?: string) {
        return new Promise<NamespaceMetadata>(async (resolve, reject) => {
            const namespace = create(NamespaceMetadataSchema, {
                owner: this.authenticate.getDid(),
                uid: uid || uid === '' ? uid : generateUuid(),
                name: name,
                description: description,
                participants: participants,
                createdAt: getCurrentUtcString(),
                updatedAt: getCurrentUtcString()
            })

            const body = create(CreateNamespaceRequestBodySchema, { namespace: namespace })
            let header
            try {
                await signNamespaceMetadata(this.authenticate, namespace)
                header = await this.authenticate.createHeader(toBinary(CreateNamespaceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when creating namespace', err)
                return reject(err)
            }

            const request = create(CreateNamespaceRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateNamespaceResponseBodySchema)
                await verifyNamespaceMetadata(res.body?.namespace)
                return resolve(res.body?.namespace as NamespaceMetadata)
            } catch (err) {
                console.error('Fail to create namespace', err)
                return reject(err)
            }
        })
    }
}
