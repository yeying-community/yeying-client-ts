import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { MessageHeader } from '../../yeying/api/common/message_pb'
import { create, toBinary } from '@bufbuild/protobuf'
import {
    Config,
    ConfigMetadata,
    ConfigMetadataSchema,
    ConfigTypeEnum,
    GetConfigRequestBodySchema,
    GetConfigRequestSchema,
    GetConfigResponseBodySchema,
    SetConfigRequestBodySchema,
    SetConfigRequestSchema,
    SetConfigResponseBodySchema
} from '../../yeying/api/config/config_pb'
import { signConfigMetadata, verifyConfigMetadata } from '../model/model'
import { getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 管理配置
 */
export class ConfigProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof Config>

    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Config,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 获取配置相应`key`的值元信息
     *
     * @param key 配置的key。
     * @param type 配置类型，是系统配置，还是用户配置，默认是用户配置。
     *
     * @returns 配置元信息
     *
     * @throws ServiceUnavailable 服务不可用
     *
     */
    get(key: string, type: ConfigTypeEnum = ConfigTypeEnum.CONFIG_TYPE_USER) {
        return new Promise<ConfigMetadata>(async (resolve, reject) => {
            const body = create(GetConfigRequestBodySchema, { key: key, type: type })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(GetConfigRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for getting config.', err)
                return reject(err)
            }

            const request = create(GetConfigRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.get(request)
                await this.authenticate.doResponse(res, GetConfigResponseBodySchema)
                await verifyConfigMetadata(res.body?.config)
                return resolve(res.body?.config as ConfigMetadata)
            } catch (err) {
                console.error('Fail to get config', err)
                return reject(err)
            }
        })
    }

    set(key: string, value: string) {
        return new Promise<ConfigMetadata>(async (resolve, reject) => {
            const configMetadata = create(ConfigMetadataSchema, {
                owner: this.authenticate.getDid(),
                key: key,
                value: value,
                createdAt: getCurrentUtcString(),
                updatedAt: getCurrentUtcString()
            })

            const body = create(SetConfigRequestBodySchema, { config: configMetadata })
            let header: MessageHeader
            try {
                await signConfigMetadata(this.authenticate, configMetadata)
                header = await this.authenticate.createHeader(toBinary(SetConfigRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for setting config.', err)
                return reject(err)
            }

            const request = create(SetConfigRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.set(request)
                await this.authenticate.doResponse(res, SetConfigResponseBodySchema)
                await verifyConfigMetadata(res.body?.config)
                return resolve(res.body?.config as ConfigMetadata)
            } catch (err) {
                console.error('Fail to set config', err)
                return reject(err)
            }
        })
    }
}
