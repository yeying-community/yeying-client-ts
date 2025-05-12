import { Authenticate } from '../common/authenticate'
import { Client, createClient } from '@connectrpc/connect'
import { ProviderOption } from '../common/model'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import { generateUuid } from '../../common/string'
import { signSessionMetadata, verifySessionMetadata } from '../model/model'
import { isDeleted, isExisted } from '../../common/status'
import {
    CreateSessionRequestBodySchema,
    CreateSessionRequestSchema,
    CreateSessionResponseBodySchema,
    DeleteSessionRequestBodySchema,
    DeleteSessionRequestSchema,
    DeleteSessionResponseBodySchema,
    SearchSessionConditionSchema,
    SearchSessionRequestBodySchema,
    SearchSessionRequestSchema,
    SearchSessionResponseBodySchema,
    Session,
    SessionDetail,
    SessionDetailRequestBodySchema,
    SessionDetailRequestSchema,
    SessionDetailResponseBodySchema,
    SessionMetadata,
    SessionMetadataSchema,
    UpdateSessionRequestBodySchema,
    UpdateSessionRequestSchema,
    UpdateSessionResponseBodySchema
} from '../../yeying/api/session/session_pb'
import { RequestPageSchema } from '../../yeying/api/common/message_pb'
import { getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 会话提供商，增加配置创建和查询邀请码。
 *
 */
export class SessionProvider {
    /**
     * 认证实例，用于进行身份验证。
     *
     * @private
     */
    private readonly authenticate: Authenticate
    private client: Client<typeof Session>

    /**
     * 构造大模型供应商。
     *
     * @param option - 提供商配置，包括代理设置。
     * @example
     * ```ts
     * const option = { proxy: <proxy url>, blockAddress: <your block address> };
     * const sessionProvider = new SessionProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Session,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建会话
     * @param name - 会话的名称
     * @param templateId - 会话模板ID（可选）
     * @param description - 会话的描述信息（可选）
     * @param uid - 会话的唯一标识符（可选，若未提供将自动生成）
     * @returns Promise - 返回包含会话元数据的Promise
     * @example
     * ```ts
     * sessionService.create('Session Name', 'template-123', 'This is a session description').then(session => {
     *   console.log(session); // 返回的会话元数据
     * }).catch(err => {
     *   console.error(err); // 错误信息
     * });
     * ```
     */
    create(name: string, templateId?: string, description?: string, uid?: string) {
        return new Promise<SessionMetadata>(async (resolve, reject) => {
            const session = create(SessionMetadataSchema, {
                owner: this.authenticate.getDid(),
                name: name,
                uid: uid ? uid : generateUuid(),
                description: description,
                config: JSON.stringify({ templateId: templateId }),
                createdAt: getCurrentUtcString(),
                updatedAt: getCurrentUtcString()
            })

            const body = create(CreateSessionRequestBodySchema, { session: session })
            let header
            try {
                await signSessionMetadata(this.authenticate, session)
                header = await this.authenticate.createHeader(toBinary(CreateSessionRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for creating session.', err)
                return reject(err)
            }

            const request = create(CreateSessionRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateSessionResponseBodySchema, isExisted)
                await verifySessionMetadata(res.body?.session)
                return resolve(res.body?.session as SessionMetadata)
            } catch (err) {
                console.error('Fail to create session.', err)
                return reject(err)
            }
        })
    }

    /**
     * 搜索会话
     * @param page - 页码，默认为1
     * @param pageSize - 每页大小，默认为10
     * @param uid - 可选，会话的唯一标识符
     * @param name - 可选，会话名称
     * @returns Promise - 返回包含会话元数据的Promise
     * @example
     * ```ts
     * sessionService.search(1, 10, 'session-uid', 'session-name').then(sessions => {
     *   console.log(sessions); // 返回的会话元数据列表
     * }).catch(err => {
     *   console.error(err); // 错误信息
     * });
     * ```
     */
    search(page: number = 1, pageSize: number = 10, uid?: string, name?: string) {
        return new Promise<SessionMetadata[]>(async (resolve, reject) => {
            const body = create(SearchSessionRequestBodySchema, {
                condition: create(SearchSessionConditionSchema, {
                    uid: uid,
                    name: name
                }),
                page: create(RequestPageSchema, {
                    page: page,
                    pageSize: pageSize
                })
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SearchSessionRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for searching session.', err)
                return reject(err)
            }

            const request = create(SearchSessionRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchSessionResponseBodySchema)
                const sessions: SessionMetadata[] = []
                if (res.body?.sessions !== undefined) {
                    for (const session of res.body.sessions) {
                        try {
                            await verifySessionMetadata(session)
                            sessions.push(session)
                        } catch (err) {
                            console.error(
                                `Fail to verify session=${toJson(SessionMetadataSchema, session)} when searching session`,
                                err
                            )
                        }
                    }
                }
                resolve(sessions)
            } catch (err) {
                console.error('Fail to search session.', err)
                return reject(err)
            }
        })
    }

    /**
     * 删除会话
     * @param uid - 会话的唯一标识符
     * @returns Promise - 返回一个空的Promise，表示删除操作完成
     * @example
     * ```ts
     * sessionService.delete('session-uid').then(() => {
     *   console.log('Session deleted successfully');
     * }).catch(err => {
     *   console.error(err); // 错误信息
     * });
     * ```
     */
    delete(uid: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(DeleteSessionRequestBodySchema, { uid: uid })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(DeleteSessionRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for deleting session.', err)
                return reject(err)
            }

            const request = create(DeleteSessionRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, DeleteSessionResponseBodySchema, isDeleted)
                resolve()
            } catch (err) {
                console.error('Fail to delete session.', err)
                return reject(err)
            }
        })
    }

    /**
     * 获取会话详情
     * @param uid - 会话的唯一标识符
     * @returns Promise - 返回包含会话详情的Promise
     * @example
     * ```ts
     * sessionService.detail('session-uid').then(detail => {
     *   console.log(detail); // 返回的会话详情
     * }).catch(err => {
     *   console.error(err); // 错误信息
     * });
     * ```
     */
    detail(uid: string) {
        return new Promise<SessionDetail>(async (resolve, reject) => {
            const body = create(SessionDetailRequestBodySchema, { uid: uid })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SessionDetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for getting session detail.', err)
                return reject(err)
            }

            const request = create(SessionDetailRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, SessionDetailResponseBodySchema)
                const detail = res.body?.detail as SessionDetail
                await verifySessionMetadata(detail.session)
                return resolve(detail)
            } catch (err) {
                console.error('Fail to get session detail.', err)
                return reject(err)
            }
        })
    }

    /**
     * 更新会话
     * @param session - 会话元数据
     * @returns Promise - 返回包含更新后会话元数据的Promise
     * @example
     * ```ts
     * sessionService.update(session).then(updatedSession => {
     *   console.log(updatedSession); // 返回的更新后会话元数据
     * }).catch(err => {
     *   console.error(err); // 错误信息
     * });
     * ```
     */
    update(session: SessionMetadata) {
        return new Promise<SessionMetadata>(async (resolve, reject) => {
            const body = create(UpdateSessionRequestBodySchema, { session: session })
            let header
            try {
                session.updatedAt = getCurrentUtcString()
                await signSessionMetadata(this.authenticate, session)
                header = await this.authenticate.createHeader(toBinary(UpdateSessionRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for updating session.', err)
                return reject(err)
            }

            const request = create(UpdateSessionRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.update(request)
                await this.authenticate.doResponse(res, UpdateSessionResponseBodySchema)
                await verifySessionMetadata(res.body?.session)
                return resolve(res.body?.session as SessionMetadata)
            } catch (err) {
                console.error('Fail to update session.', err)
                return reject(err)
            }
        })
    }
}
