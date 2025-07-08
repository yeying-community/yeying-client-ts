import { Authenticate } from '../common/authenticate'
import { ProviderOption } from '../common/model'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { NetworkUnavailable } from '../../common/error'
import { MessageHeader, RequestPageSchema } from '../../yeying/api/common/message_pb'
import {
    Audit,
    AuditListRequestBodySchema,
    AuditListRequestSchema,
    AuditListResponse,
    AuditListResponseBodySchema,
    AuditListResponseJson,
    AuditListResponseSchema,
    AuditMetadataJson,
    AuditMetadataSchema,
    AuditAuditRequestBodySchema,
    AuditAuditRequestSchema,
    AuditAuditResponse,
    AuditAuditResponseBodySchema,
    AuditAuditResponseJson,
    AuditAuditResponseSchema,
    AuditSearchConditionJson,
    AuditSearchConditionSchema,
    AuditCancelRequestBodySchema,
    AuditCancelRequestSchema,
    AuditCancelResponse,
    AuditCancelResponseBodySchema,
    AuditCancelResponseJson,
    AuditCancelResponseSchema,
    CreateAuditListRequestBodySchema,
    CreateAuditListRequestSchema,
    CreateAuditListResponse,
    CreateAuditListResponseBodySchema,
    CreateAuditListResponseJson,
    CreateAuditListResponseSchema,
    AuditCreateRequestBodySchema,
    AuditCreateRequestSchema,
    AuditCreateResponse,
    AuditCreateResponseBodySchema,
    AuditCreateResponseJson,
    AuditCreateResponseSchema,
    AuditDetailRequestBodySchema,
    AuditDetailRequestSchema,
    AuditDetailResponse,
    AuditDetailResponseBodySchema,
    AuditDetailResponseJson,
    AuditDetailResponseSchema,
    AuditUnbindRequestBodySchema,
    AuditUnbindRequestSchema,
    AuditUnbindResponse,
    AuditUnbindResponseBodySchema,
    AuditUnbindResponseJson,
    AuditUnbindResponseSchema,
    AuditMetadata
} from '../../yeying/api/audit/audit_pb'
import { ofAuditStatus } from '../../model/audit'

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
                resolve(toJson(AuditMetadataSchema, res.body?.meta as AuditMetadata, { alwaysEmitImplicit: true }) as AuditMetadataJson)
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
        return new Promise<AuditMetadataJson>(async (resolve, reject) => {
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
                resolve(toJson(AuditMetadataSchema, res.body?.meta as AuditMetadata, { alwaysEmitImplicit: true }) as AuditMetadataJson)
            } catch (err) {
                console.error('Fail to detail audit', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 审批
     *
     * @param uid 主键 uid
     * @param status 审批状态 passed（同意） / reject（拒绝）
     * @returns 返回申请元信息。
     *
     * @throws  NetworkUnavailable
     *
     */
    audit(uid: string, status: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(AuditAuditRequestBodySchema, {
                uid: uid,
                status: ofAuditStatus(status)
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditAuditRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to audit header for audit.', err)
                return reject(err)
            }

            const request = create(AuditAuditRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.audit(request)
                await this.authenticate.doResponse(res, AuditAuditResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to audit', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 查看我申请的列表
     *
     * @param sourceDid 申请者的身份 did
     *
     * @returns 返回申请元信息列表。
     *
     * @throws  NetworkUnavailable
     *
     */
    createAuditList(page: number, pageSize: number, condition?: AuditSearchConditionJson) {
        return new Promise<AuditMetadataJson[]>(async (resolve, reject) => {
            const body = create(CreateAuditListRequestBodySchema, {
                page: create(RequestPageSchema, { page: page, pageSize: pageSize }),
                condition: fromJson(AuditSearchConditionSchema, condition ?? {})
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(CreateAuditListRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to createAuditList header for audit.', err)
                return reject(err)
            }

            const request = create(CreateAuditListRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.createList(request)
                await this.authenticate.doResponse(res, CreateAuditListResponseBodySchema)
                if (res.body) {
                    resolve(
                        res.body.audits.map(audit => toJson(AuditMetadataSchema, audit as AuditMetadata, { alwaysEmitImplicit: true }) as AuditMetadataJson)
                    )
                }
   
            } catch (err) {
                console.error('Fail to createAuditList', err)
                return reject(new NetworkUnavailable())
            }
        })
    }

    /**
     * 查看我审批的列表
     *
     * @param sourceDid 审批者的身份 did
     *
     * @returns 返回审批元信息列表。
     *
     * @throws  NetworkUnavailable
     *
     */
    auditList(page: number, pageSize: number, condition?: AuditSearchConditionJson) {
        return new Promise<AuditMetadataJson[]>(async (resolve, reject) => {
            const body = create(AuditListRequestBodySchema, {
                page: create(RequestPageSchema, { page: page, pageSize: pageSize }),
                condition: fromJson(AuditSearchConditionSchema, condition ?? {})
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditListRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to auditList header for audit.', err)
                return reject(err)
            }

            const request = create(AuditListRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.auditList(request)
                await this.authenticate.doResponse(res, AuditListResponseBodySchema)
                if (res.body) {
                    resolve(res.body.audits.map(audit => toJson(AuditMetadataSchema, audit as AuditMetadata, { alwaysEmitImplicit: true }) as AuditMetadataJson))
                }
            } catch (err) {
                console.error('Fail to auditList', err)
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
     * 解绑我申请成功的应用
     *
     * @param uid 主键 uid
     *
     * @returns 成功/失败
     *
     * @throws  NetworkUnavailable
     *
     */
    unbind(uid: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(AuditUnbindRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditUnbindRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to unbind header for unbind audit.', err)
                return reject(err)
            }

            const request = create(AuditUnbindRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.unbind(request)
                await this.authenticate.doResponse(res, AuditUnbindResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to unbind', err)
                return reject(new NetworkUnavailable())
            }
        })
    }
}
