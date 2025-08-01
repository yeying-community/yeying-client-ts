import { Authenticate } from '../common/authenticate'
import { MessageHeader, RequestPageSchema, ResponsePage, ResponsePageSchema } from '../../yeying/api/common/message_pb'
import { PageResponseResult, ProviderOption } from '../common/model'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { Client, createClient } from '@connectrpc/connect'
import {
    CreateInvitationRequestBodySchema,
    CreateInvitationRequestSchema,
    CreateInvitationResponseBodySchema,
    Invitation,
    InvitationDetailRequestBodySchema,
    InvitationDetailRequestSchema,
    InvitationDetailResponseBodySchema,
    InvitationMetadata,
    InvitationMetadataJson,
    InvitationMetadataSchema,
    SearchInvitationRequestBodySchema,
    SearchInvitationRequestSchema,
    SearchInvitationResponseBodySchema
} from '../../yeying/api/invitation/invitation_pb'
import { generateRandomString } from '../../common/string'
import { signInvitationMetadata, verifyInvitationMetadata } from '../model/model'
import { getCurrentUtcDateTime, getCurrentUtcString, plusSecond, toISO } from '@yeying-community/yeying-web3'

/**
 * 邀请码提供商，创建和查询邀请码。
 *
 */
export class InvitationProvider {
    /**
     * 认证实例，用于进行身份验证。
     *
     * @private
     */
    private authenticate: Authenticate
    private client: Client<typeof Invitation>

    /**
     * 构造函数，用于初始化 `InvitationProvider` 类。
     *
     * @param option - 提供商配置，包括代理设置。
     * @example
     * ```ts
     * const option = { proxy: <proxy url>, blockAddress: <your block address> };
     * const invitationProvider = new InvitationProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Invitation,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建邀请码
     *
     * @param duration - 有效时长，单位：天。
     * @param invitee - 可选，被邀请人身份ID。
     *
     * @returns 返回邀请码信息。
     * @throws 错误时抛出 `Error`。
     * @example
     * ```ts
     * invitationProvider.create(1)
     *   .then(result => console.log(result))
     *   .catch(err => console.error(err));
     * ```
     */
    create(duration: number, invitee?: string) {
        return new Promise<InvitationMetadataJson>(async (resolve, reject) => {
            const invitation: InvitationMetadata = create(InvitationMetadataSchema, {
                code: generateRandomString(32),
                inviter: this.authenticate.getDid(),
                invitee: invitee,
                createdAt: getCurrentUtcString(),
                expiredAt: toISO(plusSecond(getCurrentUtcDateTime(), duration * 24 * 3600))
            })

            const body = create(CreateInvitationRequestBodySchema, {
                invitation: invitation
            })
            let header: MessageHeader
            try {
                await signInvitationMetadata(this.authenticate, invitation)
                header = await this.authenticate.createHeader(toBinary(CreateInvitationRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for creating invitation', err)
                return reject(err)
            }

            const request = create(CreateInvitationRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateInvitationResponseBodySchema)
                await verifyInvitationMetadata(res.body?.invitation)
                return resolve(
                    toJson(InvitationMetadataSchema, res.body?.invitation as InvitationMetadata, {
                        alwaysEmitImplicit: true
                    }) as InvitationMetadataJson
                )
            } catch (err) {
                console.error('Fail to create invitation', err)
                return reject(err)
            }
        })
    }

    /**
     * 搜索所有邀请码。
     *
     * @returns 返回邀请码列表。
     *
     * @throws 错误时抛出 `Error`。
     *
     * @example
     * ```ts
     * userProvider.get()
     *   .then(user => console.log(user))
     *   .catch(err => console.error(err));
     * ```
     */
    search(page: number, pageSize: number) {
        return new Promise<PageResponseResult<InvitationMetadataJson>>(async (resolve, reject) => {
            const body = create(SearchInvitationRequestBodySchema, {
                page: create(RequestPageSchema, {
                    page: page,
                    pageSize: pageSize
                })
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SearchInvitationRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for searching invitation', err)
                return reject(err)
            }

            const request = create(SearchInvitationRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchInvitationResponseBodySchema)
                const invitationsList = res.body?.invitations as InvitationMetadata[]
                const invitations = invitationsList.map(
                        (invitation) =>
                            toJson(InvitationMetadataSchema, invitation, {
                                alwaysEmitImplicit: true
                            }) as InvitationMetadataJson
                    )
                resolve(PageResponseResult.buildPageInfo(invitations, toJson(ResponsePageSchema, res.body?.page as ResponsePage)))
            } catch (err) {
                console.error('Fail to search invitation', err)
                return reject(err)
            }
        })
    }

    /**
     * 获得邀请码详情。
     *
     * @returns 邀请码详情。
     *
     * @throws 错误时抛出 `Error`。
     * @example
     * ```ts
     * userProvider.state()
     *   .then(user => console.log(user))
     *   .catch(err => console.error(err));
     * ```
     */
    detail(code: string) {
        return new Promise<InvitationMetadataJson>(async (resolve, reject) => {
            const body = create(InvitationDetailRequestBodySchema, {
                code: code
            })
            let header
            try {
                header = await this.authenticate.createHeader(toBinary(InvitationDetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for getting invitation detail.', err)
                return reject(err)
            }

            const request = create(InvitationDetailRequestSchema, {
                header: header,
                body: body
            })
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, InvitationDetailResponseBodySchema)
                await verifyInvitationMetadata(res.body?.invitation)
                return resolve(
                    toJson(InvitationMetadataSchema, res.body?.invitation as InvitationMetadata, {
                        alwaysEmitImplicit: true
                    }) as InvitationMetadataJson
                )
            } catch (err) {
                console.error('Fail to get invitation detail.', err)
                return reject(err)
            }
        })
    }
}
