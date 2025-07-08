import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import {
    CreateServiceRequestBodySchema,
    CreateServiceRequestSchema,
    CreateServiceResponseBodySchema,
    SearchServiceConditionSchema,
    SearchServiceRequestBodySchema,
    SearchServiceRequestSchema,
    SearchServiceResponseBodySchema,
    Service,
    OfflineServiceRequestBodySchema,
    OfflineServiceRequestSchema,
    OfflineServiceResponseBodySchema,
    DetailServiceRequestBodySchema,
    DetailServiceRequestSchema,
    OnlineServiceRequestSchema,
    OnlineServiceRequestBodySchema,
    OnlineServiceResponseBodySchema,
    DeleteServiceResponseBodySchema,
    DeleteServiceRequestSchema,
    DeleteServiceRequestBodySchema,
    DetailServiceResponseBodySchema,
    SearchServiceConditionJson,
    SearchServiceResponseBodyJson,
    SearchServiceResponseBody
} from '../../yeying/api/service/service_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { MessageHeader, RequestPageSchema } from '../../yeying/api/common/message_pb'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { ServiceMetadata, ServiceMetadataJson, ServiceMetadataSchema } from '../../yeying/api/common/model_pb'
import { isDeleted, isExisted } from '../../common/status'
import { signServiceMetadata, verifyServiceMetadata } from '../model/model'

/**
 * 提供服务管理功能的类，支持创建、详情、上线、搜索和下线、删除服务。
 */
export class ServiceProvider {
    private authenticate: Authenticate
    private client: Client<typeof Service>

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @example
     * ```ts
     * const providerOption = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const serviceProvider = new ServiceProvider(providerOption)
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Service,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建服务
     * @param service - 服务元数据对象
     * @returns 返回创建服务的响应体
     * @example
     * ```ts
     * const serviceMetadata = { did: 'example-did', name: 'example-service', description: 'This is a service' }
     * serviceProvider.create(serviceMetadata)
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    create(service: ServiceMetadataJson) {
        return new Promise<ServiceMetadataJson>(async (resolve, reject) => {
            const meta: ServiceMetadata = fromJson(ServiceMetadataSchema, service ?? {})
            const body = create(CreateServiceRequestBodySchema, {
                service: meta
            })

            let header: MessageHeader
            try {
                await signServiceMetadata(this.authenticate, meta)
                header = await this.authenticate.createHeader(toBinary(CreateServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for create service.', err)
                return reject(err)
            }

            const request = create(CreateServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateServiceResponseBodySchema, isExisted)
                resolve(toJson(ServiceMetadataSchema, res.body?.service as ServiceMetadata, { alwaysEmitImplicit: true }) as ServiceMetadataJson)
            } catch (err) {
                console.error('Fail to create service', err)
                return reject(err)
            }
        })
    }

    /**
     * 服务详情
     * @param did, version
     * @returns  DetailServiceResponseBody
     */
    detail(did: string, version: number) {
        return new Promise<ServiceMetadataJson>(async (resolve, reject) => {
            const body = create(DetailServiceRequestBodySchema, {
                did: did,
                version: version
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(DetailServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for detail service.', err)
                return reject(err)
            }

            const request = create(DetailServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.detail(request)
                console.log(`res=${JSON.stringify(res)}`)
                await this.authenticate.doResponse(res, DetailServiceResponseBodySchema, isDeleted)
                resolve(toJson(ServiceMetadataSchema, res.body?.service as ServiceMetadata, { alwaysEmitImplicit: true }) as ServiceMetadataJson)
            } catch (err) {
                console.error('Fail to detail service', err)
                return reject(err)
            }
        })
    }

    /**
     * 根据条件和分页参数查询服务列表
     * @param condition - 搜索条件（部分 `SearchServiceCondition` 对象）
     * @param page - 当前页码
     * @param pageSize - 每页显示的条目数
     * @returns 返回搜索服务的响应体
     * @example
     * ```ts
     * const condition = { code: 'example-code', owner: 'example-owner', name: 'example-name' }
     * serviceProvider.search(condition, 1, 10)
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    search(page: number, pageSize: number, condition?: SearchServiceConditionJson) {
        return new Promise<SearchServiceResponseBodyJson>(async (resolve, reject) => {
            const body = create(SearchServiceRequestBodySchema, {
                condition: fromJson(SearchServiceConditionSchema, condition ?? {}),
                page: create(RequestPageSchema, { page: page, pageSize: pageSize })
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(SearchServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for searching service.', err)
                return reject(err)
            }

            const request = create(SearchServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchServiceResponseBodySchema)
                const services = []
                for (const service of res.body?.services as ServiceMetadata[]) {
                    try {
                        await verifyServiceMetadata(service)
                        services.push(service)
                    } catch (err) {
                        console.error(
                            `Invalid service metadata=${JSON.stringify(toJson(ServiceMetadataSchema, service))} when searching services.`,
                            err
                        )
                    }
                }
                if (res.body) {
                    resolve(toJson(SearchServiceResponseBodySchema, res.body as SearchServiceResponseBody, { alwaysEmitImplicit: true }) as SearchServiceResponseBodyJson)
                }
                
            } catch (err) {
                console.error('Fail to search service', err)
                return reject(err)
            }
        })
    }

    /**
     * 根据服务的 DID 和版本号发送下线请求
     *
     * @param did - 服务的 DID
     * @param version - 服务的版本号
     *
     * @returns 返回下线服务的响应体
     *
     */
    offline(did: string, version: number) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(OfflineServiceRequestBodySchema, {
                did: did,
                version: version
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(OfflineServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for offline service.', err)
                return reject(err)
            }

            const request = create(OfflineServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.offline(request)
                await this.authenticate.doResponse(res, OfflineServiceResponseBodySchema, isDeleted)
                resolve()
            } catch (err) {
                console.error('Fail to offline service', err)
                return reject(err)
            }
        })
    }

    /**
     * 根据服务的 DID 和版本号发送上线请求
     *
     * @param did - 服务的 DID
     * @param version - 服务的版本号
     *
     * @returns 返回上线服务的响应体
     *
     */
    online(did: string, version: number) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(OnlineServiceRequestBodySchema, {
                did: did,
                version: version
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(OnlineServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for online service.', err)
                return reject(err)
            }

            const request = create(OnlineServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.online(request)
                await this.authenticate.doResponse(res, OnlineServiceResponseBodySchema, isDeleted)
                resolve()
            } catch (err) {
                console.error('Fail to online service', err)
                return reject(err)
            }
        })
    }

    /**
     * 根据服务的 DID 和版本号发送删除元数据请求
     *
     * @param did - 服务的 DID
     * @param version - 服务的版本号
     *
     * @returns 返回删除服务的响应体
     *
     */
    delete(did: string, version: number) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(DeleteServiceRequestBodySchema, {
                did: did,
                version: version
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(DeleteServiceRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for delete service.', err)
                return reject(err)
            }

            const request = create(DeleteServiceRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, DeleteServiceResponseBodySchema, isDeleted)
                resolve()
            } catch (err) {
                console.error('Fail to delete service', err)
                return reject(err)
            }
        })
    }
}
