import { Authenticate } from '../common/authenticate'
import { PageResponseResult, ProviderOption } from '../common/model'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { NetworkUnavailable } from '../../common/error'
import { MessageHeader, RequestPageSchema, ResponsePage, ResponsePageSchema } from '../../yeying/api/common/message_pb'
import {
    Audit,
    AuditMetadataJson,
    AuditMetadataSchema,
    AuditSearchConditionJson,
    AuditSearchConditionSchema,
    AuditCancelRequestBodySchema,
    AuditCancelRequestSchema,
    AuditCancelResponseBodySchema,
    AuditCreateRequestBodySchema,
    AuditCreateRequestSchema,
    AuditCreateResponseBodySchema,
    AuditDetailRequestBodySchema,
    AuditDetailRequestSchema,
    AuditDetailResponseBodySchema,
    AuditMetadata,
    AuditDetail,
    AuditDetailJson,
    AuditDetailSchema,
    AuditApproveRequestBodySchema,
    CommentMetadataJson,
    CommentMetadataSchema,
    AuditApproveRequestSchema,
    CommentMetadata,
    AuditRejectRequestBodySchema,
    AuditRejectRequestSchema,
    AuditSearchRequestBodySchema,
    AuditSearchRequestSchema,
    AuditSearchResponseBodySchema,
    AuditSearchResponseBody,
    AuditApproveResponseBodySchema,
    AuditRejectResponseBodySchema,
} from '../../yeying/api/audit/audit_pb'

/**
 * AuditProvider 应用审批
 */
export class AuditProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof Audit>

    /**
     * AuditProvider 的构造函数，初始化身份认证和客户端实例。
     *
     * @param option - 服务提供商的选项，包括代理设置等。
     * @example
     *
     * ```ts
     * const option = { proxy: <proxy url>, blockAddress: <your block address> };
     * const provider = new AuditProvider(option);
     * ```
     *
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Audit,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建申请审批流程
     *
     * @param meta 申请元信息
     *
     * @returns 返回申请元信息。
     *
     * @throws  NetworkUnavailable
     *
     */
    create(meta: AuditMetadataJson) {
        return new Promise<AuditMetadataJson>(async (resolve, reject) => {
            const metadata = fromJson(AuditMetadataSchema, meta ?? {})
            const body = create(AuditCreateRequestBodySchema, {
                meta: metadata
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditCreateRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for creating audit.', err)
                return reject(err)
            }

            const request = create(AuditCreateRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, AuditCreateResponseBodySchema)
                resolve(
                    toJson(AuditMetadataSchema, res.body?.meta as AuditMetadata, {
                        alwaysEmitImplicit: true
                    }) as AuditMetadataJson
                )
            } catch (err) {
                console.error('Fail to create audit', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 查看审批流程详情
     *
     * @param meta 申请元信息
     *
     * @returns 返回申请元信息。
     *
     * @throws  NetworkUnavailable
     *
     */
    detail(uid: string) {
        return new Promise<AuditDetailJson>(async (resolve, reject) => {
            const body = create(AuditDetailRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditDetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to detail header for detail audit.', err)
                return reject(err)
            }

            const request = create(AuditDetailRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, AuditDetailResponseBodySchema)
                resolve(
                    toJson(AuditDetailSchema, res.body?.detail as AuditDetail, {
                        alwaysEmitImplicit: true
                    }) as AuditDetailJson
                )
            } catch (err) {
                console.error('Fail to detail audit', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 撤销我申请的
     *
     * @param uid 主键 uid
     *
     * @returns 返回审批元信息列表。
     *
     * @throws  NetworkUnavailable
     *
     */
    cancel(uid: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(AuditCancelRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditCancelRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to cancel header for cancel audit.', err)
                return reject(err)
            }

            const request = create(AuditCancelRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.cancel(request)
                await this.authenticate.doResponse(res, AuditCancelResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to cancel', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 通过✅申请
     *
     * @param CommentMetadataJson
     *
     * @returns 返回审批元列表。
     *
     * @throws  NetworkUnavailable
     *
     */
    approve(meta: CommentMetadataJson) {
        return new Promise<CommentMetadataJson>(async (resolve, reject) => {
            const metadata = fromJson(CommentMetadataSchema, meta ?? {})
            const body = create(AuditApproveRequestBodySchema, {
                metadata: metadata
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditApproveRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to approve header for approve audit.', err)
                return reject(err)
            }

            const request = create(AuditApproveRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.approve(request)
                await this.authenticate.doResponse(res, AuditApproveResponseBodySchema)
                resolve(
                    toJson(CommentMetadataSchema, res.body?.metadata as CommentMetadata, {
                        alwaysEmitImplicit: true
                    }) as CommentMetadataJson
                )
            } catch (err) {
                console.error('Fail to approve', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 拒绝❌申请
     *
     * @param CommentMetadataJson
     *
     * @returns 返回审批元信息。
     *
     * @throws  NetworkUnavailable
     *
     */
    reject(meta: CommentMetadataJson) {
        return new Promise<CommentMetadataJson>(async (resolve, reject) => {
            const metadata = fromJson(CommentMetadataSchema, meta ?? {})
            const body = create(AuditRejectRequestBodySchema, {
                metadata: metadata
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditRejectRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to reject header for approve audit.', err)
                return reject(err)
            }

            const request = create(AuditRejectRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.reject(request)
                await this.authenticate.doResponse(res, AuditRejectResponseBodySchema)
                resolve(
                    toJson(CommentMetadataSchema, res.body?.metadata as CommentMetadata, {
                        alwaysEmitImplicit: true
                    }) as CommentMetadataJson
                )
            } catch (err) {
                console.error('Fail to reject', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 审计搜索
     *
     * @param AuditSearchConditionJson
     *
     * @returns 返回审批元信息列表。
     *
     * @throws  NetworkUnavailable
     *
     */
    search(page: number, pageSize: number, condition: AuditSearchConditionJson) {
        return new Promise<PageResponseResult<AuditDetailJson>>(async (resolve, reject) => {
            const meta = fromJson(AuditSearchConditionSchema, condition ?? {})
            const body = create(AuditSearchRequestBodySchema, {
                page: create(RequestPageSchema, { page: page, pageSize: pageSize }),
                condition: meta
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditSearchRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to search header for approve audit.', err)
                return reject(err)
            }

            const request = create(AuditSearchRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, AuditSearchResponseBodySchema)
                const body = res.body as AuditSearchResponseBody
                const auditDetails: AuditDetailJson[] = []
                for (const d of body.detail) {
                    const auditDetailJson = toJson(AuditDetailSchema, d, {
                        alwaysEmitImplicit: true
                    }) as AuditDetailJson
                    auditDetails.push(auditDetailJson)
                }
                resolve(PageResponseResult.buildPageInfo(auditDetails, toJson(ResponsePageSchema, res.body?.page as ResponsePage)))
            } catch (err) {
                console.error('Fail to search', err)
                return reject(new NetworkUnavailable())
            }
        })
    }
}
