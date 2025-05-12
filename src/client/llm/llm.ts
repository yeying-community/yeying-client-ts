import { Authenticate } from '../common/authenticate'
import { Client, createClient } from '@connectrpc/connect'
import { ProviderOption } from '../common/model'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary } from '@bufbuild/protobuf'
import {
    CompleteRequestBodySchema,
    CompleteRequestSchema,
    CompleteResponseHeadBodySchema,
    CompleteResponseTailBodySchema,
    Content,
    ContentSchema,
    Llm,
    MessageRoleEnum,
    MessageSchema
} from '../../yeying/api/llm/llm_pb'

/**
 * 大模型提供商。
 *
 */
export class LlmProvider {
    /**
     * 认证实例，用于进行身份验证。
     *
     * @private
     */
    private authenticate: Authenticate
    private client: Client<typeof Llm>

    /**
     * 构造大模型供应商。
     *
     * @param option - 提供商配置，包括代理设置。
     * @example
     * ```ts
     * const option = { proxy: <proxy url>, blockAddress: <your block address> };
     * const llmProvider = new LlmProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Llm,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 基于Prompt回答
     *
     * @param sessionId 会话ID
     * @param contents 请求内容
     * @param providerId 大模型供应商ID
     * @param model 模型名称
     * @parm templateId 模版ID
     *
     * @returns 流式文本
     *
     * @throws NetworkUnavailable 网络不可用
     *
     */
    async *complete(
        sessionId: string,
        contents: Content[],
        model: string,
        providerId?: string,
        promptId?: string
    ): AsyncGenerator<string> {
        const messages = contents.map((c) => {
            return create(MessageSchema, { role: MessageRoleEnum.MESSAGE_ROLE_USER, content: create(ContentSchema, c) })
        })

        const body = create(CompleteRequestBodySchema, {
            providerId: providerId,
            promptId: promptId,
            sessionId: sessionId,
            model: model,
            messages: messages,
            stream: true
        })

        let header
        try {
            header = await this.authenticate.createHeader(toBinary(CompleteRequestBodySchema, body))
        } catch (err) {
            console.error('Fail to create header for completing session.', err)
            throw err
        }

        const request = create(CompleteRequestSchema, { header: header, body: body })
        try {
            for await (const res of this.client.complete(request)) {
                switch (res.data.case) {
                    case 'head':
                        await this.authenticate.doResponse(res.data.value, CompleteResponseHeadBodySchema)
                        break
                    case 'body':
                        const value = res.data.value
                        yield value.data
                        break
                    case 'tail':
                        await this.authenticate.doResponse(res.data.value, CompleteResponseTailBodySchema)
                        break
                    default:
                        console.error(`not supported case=${res.data.case}`)
                        break
                }
            }
        } catch (err) {
            console.error('Fail to complete message.', err)
            throw err
        }
    }
}
