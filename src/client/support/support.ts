import { ProviderOption } from '../common/model'
import { Authenticate } from '../common/authenticate'
import { MessageHeader } from '../../yeying/api/common/message_pb'
import {
    CollectSupportRequestBodySchema,
    CollectSupportRequestSchema,
    CollectSupportResponseBodySchema,
    FaqMetadata,
    FaqMetadataSchema,
    Support,
    SupportCodeEnum
} from '../../yeying/api/support/support_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary } from '@bufbuild/protobuf'
import { getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 通过 gRPC-web 与后端服务交互，并使用 Authenticate 类进行身份验证和签名验证
 */
export class SupportProvider {
    private authenticate: Authenticate
    private client: Client<typeof Support>

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @example
     * ```ts
     * const providerOption = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const supportProvider = new SupportProvider(providerOption)
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Support,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建 FAQ 元数据，签名并发送请求到后端服务
     * @param type - 问题类型
     * @param email - 用户邮箱
     * @param description - 问题描述
     * @returns 返回收集 FAQ 的响应体
     * @example
     * ```ts
     * supportProvider.collectFaq('type', 'user@example.com', 'This is a question')
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    async collectFaq(type: string, email: string, description: string) {
        return new Promise<FaqMetadata>(async (resolve, reject) => {
            const faq = create(FaqMetadataSchema, {
                did: this.authenticate.getDid(),
                type: type,
                email: email,
                description: description,
                createdAt: getCurrentUtcString()
            })

            const body = create(CollectSupportRequestBodySchema, {
                code: SupportCodeEnum.SUPPORT_CODE_FAQ
            })

            let header: MessageHeader
            try {
                faq.signature = await this.authenticate.sign(toBinary(FaqMetadataSchema, faq))
                body.data.value = faq
                body.data.case = 'faq'
                header = await this.authenticate.createHeader(toBinary(CollectSupportRequestBodySchema, body))
            } catch (err) {
                console.error('Failed to create header for collecting faq', err)
                return reject(err)
            }

            const request = create(CollectSupportRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.collect(request)
                await this.authenticate.doResponse(res, CollectSupportResponseBodySchema)
                resolve(faq)
            } catch (err) {
                console.error('Fail to collect faq', err)
                return reject(err)
            }
        })
    }
}
