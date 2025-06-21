import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { MessageHeader } from '../../yeying/api/common/message_pb'
import {
    HealthCheckRequestSchema,
    HealthCheckResponseBodySchema,
    Node,
    WhoamiRequestSchema,
    WhoamiResponseBodySchema
} from '../../yeying/api/node/node_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create } from '@bufbuild/protobuf'
import { ServiceMetadata } from '../../yeying/api/common/model_pb'
import { verifyServiceMetadata } from '../model/model'

/**
 * 用于与节点服务进行交互，提供健康检查和身份验证功能
 */
export class NodeProvider {
    private authenticate: Authenticate
    private client: Client<typeof Node>

    /**
     * 构造函数
     * @param option - 包含 blockAddress 和 proxy 的配置选项
     * @example
     * ```ts
     * const providerOption = { blockAddress: 'http://example.com', proxy: 'http://proxy.example.com' };
     * const nodeProvider = new NodeProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Node,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 检查当前节点的健康状态
     * @returns 如果健康检查成功，则返回一个已解析的 Promise
     * @example
     * ```ts
     * nodeProvider.healthCheck()
     *     .then(() => console.log('Node health check passed.'))
     *     .catch(err => console.error('Failed to check node health:', err));
     * ```
     */
    healthCheck() {
        return new Promise<void>(async (resolve, reject) => {
            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader()
            } catch (err) {
                console.error('Fail to create header for checking health', err)
                return reject(err)
            }

            const request = create(HealthCheckRequestSchema, { header: header })
            try {
                const res = await this.client.healthCheck(request)
                await this.authenticate.doResponse(res, HealthCheckResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to check health.', err)
                return reject(err)
            }
        })
    }

    /**
     * 获取当前节点的元数据并验证其签名
     * @returns 返回一个 Promise，解析为 NodeMetadata
     * @example
     * ```ts
     * nodeProvider.whoami()
     *     .then(metadata => console.log('Node Metadata:', metadata))
     *     .catch(err => console.error('Failed to get node metadata', err));
     * ```
     */
    whoami() {
        return new Promise<ServiceMetadata>(async (resolve, reject) => {
            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader()
            } catch (err) {
                console.error('Fail to create header for whoami', err)
                return reject(err)
            }

            const request = create(WhoamiRequestSchema, { header: header })
            try {
                const res = await this.client.whoami(request)
                await this.authenticate.doResponse(res, WhoamiResponseBodySchema)
                await verifyServiceMetadata(res.body?.service)
                resolve(res.body?.service as ServiceMetadata)
            } catch (err) {
                console.error('Fail to call whoami', err)
                return reject(err)
            }
        })
    }
}
