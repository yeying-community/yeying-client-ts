import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { LanguageCodeEnum } from '../../yeying/api/common/code_pb'
import {
    Bulletin,
    BulletinCodeEnum,
    BulletinListRequestBodySchema,
    BulletinListRequestSchema,
    BulletinListResponseBody,
    BulletinListResponseBodySchema,
    SolutionMetadata,
    SolutionMetadataSchema
} from '../../yeying/api/bulletin/bulletin_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { MessageHeader, RequestPageSchema } from '../../yeying/api/common/message_pb'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import { verifySolutionMetadata } from '../model/model'

/**
 * 通过 gRPC-web 与后端服务交互，并使用 Authenticate 类进行身份验证和签名验证。
 */
export class BulletinProvider {
    private authenticate: Authenticate
    private client: Client<typeof Bulletin>

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @example
     * ```ts
     * const providerOption = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const bulletinProvider = new BulletinProvider(providerOption)
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Bulletin,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 查询公告列表
     * @param language - 公告的语言代码（LanguageCodeEnum）
     * @param page - 当前页码
     * @param pageSize - 每页显示的条目数
     * @returns 返回查询到的公告列表响应体
     * @example
     * ```ts
     * bulletinProvider.list(LanguageCodeEnum.LANGUAGE_CODE_ZH, 1, 10)
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    async list(language: LanguageCodeEnum, page: number, pageSize: number) {
        return new Promise<SolutionMetadata[]>(async (resolve, reject) => {
            const requestPage = create(RequestPageSchema, {
                page: page,
                pageSize: pageSize
            })

            const body = create(BulletinListRequestBodySchema, {
                language: language,
                code: BulletinCodeEnum.BULLETIN_CODE_SOLUTION,
                page: requestPage
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(BulletinListRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for BulletinListing solutions.', err)
                return err
            }

            const request = create(BulletinListRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.list(request)
                await this.authenticate.doResponse(res, BulletinListResponseBodySchema)
                const body = res.body as BulletinListResponseBody
                // 验证解决方案信息的签名
                const solutions = []
                for (let solution of body.solutions) {
                    try {
                        await verifySolutionMetadata(solution)
                        solutions.push(solution)
                    } catch (err) {
                        console.error(`Invalid solution=${JSON.stringify(toJson(SolutionMetadataSchema, solution))}`)
                    }
                }

                resolve(solutions)
            } catch (err) {
                console.error('Fail to BulletinList solutions', err)
                return reject(err)
            }
        })
    }
}
