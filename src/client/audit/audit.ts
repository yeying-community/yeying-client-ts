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
    AuditRequestBodySchema,
    AuditRequestSchema,
    AuditResponse,
    AuditResponseBodySchema,
    AuditResponseJson,
    AuditResponseSchema,
    AuditSearchConditionJson,
    AuditSearchConditionSchema,
    CancelRequestBodySchema,
    CancelRequestSchema,
    CancelResponse,
    CancelResponseBodySchema,
    CancelResponseJson,
    CancelResponseSchema,
    CreateAuditListRequestBodySchema,
    CreateAuditListRequestSchema,
    CreateAuditListResponse,
    CreateAuditListResponseBodySchema,
    CreateAuditListResponseJson,
    CreateAuditListResponseSchema,
    CreateRequestBodySchema,
    CreateRequestSchema,
    CreateResponse,
    CreateResponseBodySchema,
    CreateResponseJson,
    CreateResponseSchema,
    DetailRequestBodySchema,
    DetailRequestSchema,
    DetailResponse,
    DetailResponseBodySchema,
    DetailResponseJson,
    DetailResponseSchema,
    UnbindRequestBodySchema,
    UnbindRequestSchema,
    UnbindResponse,
    UnbindResponseBodySchema,
    UnbindResponseJson,
    UnbindResponseSchema
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
        return new Promise<CreateResponseJson>(async (resolve, reject) => {
            const metadata = fromJson(AuditMetadataSchema, meta ?? {})
            const body = create(CreateRequestBodySchema, {
                meta: metadata
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(CreateRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for creating audit.', err)
                return reject(err)
            }

            const request = create(CreateRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateResponseBodySchema)
                resolve(toJson(CreateResponseSchema, res as CreateResponse))
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
        return new Promise<DetailResponseJson>(async (resolve, reject) => {
            const body = create(DetailRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(DetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to detail header for detail audit.', err)
                return reject(err)
            }

            const request = create(DetailRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, DetailResponseBodySchema)
                resolve(toJson(DetailResponseSchema, res as DetailResponse))
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
        return new Promise<AuditResponseJson>(async (resolve, reject) => {
            const body = create(AuditRequestBodySchema, {
                uid: uid,
                status: ofAuditStatus(status)
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(AuditRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to audit header for audit.', err)
                return reject(err)
            }

            const request = create(AuditRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.audit(request)
                await this.authenticate.doResponse(res, AuditResponseBodySchema)
                resolve(toJson(AuditResponseSchema, res as AuditResponse))
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
        return new Promise<CreateAuditListResponseJson>(async (resolve, reject) => {
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
                resolve(toJson(CreateAuditListResponseSchema, res as CreateAuditListResponse))
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
        return new Promise<AuditListResponseJson>(async (resolve, reject) => {
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
                resolve(toJson(AuditListResponseSchema, res as AuditListResponse))
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
        return new Promise<CancelResponseJson>(async (resolve, reject) => {
            const body = create(CancelRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(CancelRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to cancel header for cancel audit.', err)
                return reject(err)
            }

            const request = create(CancelRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.cancel(request)
                await this.authenticate.doResponse(res, CancelResponseBodySchema)
                resolve(toJson(CancelResponseSchema, res as CancelResponse))
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
        return new Promise<UnbindResponseJson>(async (resolve, reject) => {
            const body = create(UnbindRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                header = await this.authenticate.createHeader(toBinary(UnbindRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to unbind header for unbind audit.', err)
                return reject(err)
            }

            const request = create(UnbindRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.unbind(request)
                await this.authenticate.doResponse(res, UnbindResponseBodySchema)
                resolve(toJson(UnbindResponseSchema, res as UnbindResponse))
            } catch (err) {
                console.error('Fail to unbind', err)
                return reject(new NetworkUnavailable())
            }
        })
    }
}
