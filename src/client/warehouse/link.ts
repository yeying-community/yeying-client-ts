import { Authenticate } from '../common/authenticate'
import { Client, createClient } from '@connectrpc/connect'
import {
    CreateLinkRequestBodySchema,
    CreateLinkRequestSchema,
    CreateLinkResponseBodySchema,
    DisableLinkRequestBodySchema,
    DisableLinkRequestSchema,
    DisableLinkResponseBodySchema,
    Link,
    LinkDetail,
    LinkDetailRequestBodySchema,
    LinkDetailRequestSchema,
    LinkDetailResponseBodySchema,
    LinkMetadata,
    LinkMetadataSchema,
    LinkTypeEnum,
    LinkVisitorRequestBodySchema,
    LinkVisitorRequestSchema,
    LinkVisitorResponseBodySchema,
    SearchLinkCondition,
    SearchLinkConditionSchema,
    SearchLinkRequestBodySchema,
    SearchLinkRequestSchema,
    SearchLinkResponseBodySchema,
    UpdateLinkRequestBodySchema,
    VisitorMetadata,
    VisitorMetadataSchema
} from '../../yeying/api/asset/link_pb'
import { ProviderOption } from '../common/model'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, toBinary, toJson } from '@bufbuild/protobuf'
import { generateUuid } from '../../common/string'
import { RequestPageSchema } from '../../yeying/api/common/message_pb'
import { signLinkMetadata, verifyLinkMetadata, verifyUrlMetadata, verifyVisitorMetadata } from '../model/model'
import { getCurrentUtcDateTime, getCurrentUtcString, plusSecond, toISO } from '@yeying-community/yeying-web3'

/**
 * LinkProvider 类提供对资产分享链接的管理
 */
export class LinkProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof Link>

    /**
     * 创建 AssetProvider 实例。
     * @param option - 提供者选项，包括代理设置等。
     * @example
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const linkProvider = new LinkProvider(providerOption);
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Link,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建资产分享链接
     *
     * @param namespaceId 资产命名空间
     * @param name 分享链接的名称
     * @param hash 要分享的资产哈希值
     * @param duration 分享链接有效时长，单位是秒
     * @param type 分享链接类型
     * @param visitors 指定具体的访问者
     *
     * @returns 链接的状态和元信息
     *
     */
    create(
        namespaceId: string,
        name: string,
        hash: string,
        duration: number,
        type: LinkTypeEnum,
        visitors: string[] = [],
        description?: string
    ) {
        return new Promise<LinkDetail>(async (resolve, reject) => {
            const link = create(LinkMetadataSchema, {
                namespaceId: namespaceId,
                name: name,
                description: description,
                owner: this.authenticate.getDid(),
                uid: generateUuid(),
                createdAt: getCurrentUtcString(),
                startedAt: getCurrentUtcString(),
                expiredAt: toISO(plusSecond(getCurrentUtcDateTime(), duration)),
                hash: hash,
                type: type,
                visitors: visitors && visitors.length > 0 ? visitors.join(',') : undefined
            })

            const body = create(CreateLinkRequestBodySchema, {
                link: link
            })

            let header
            try {
                await signLinkMetadata(this.authenticate, link)
                header = await this.authenticate.createHeader(toBinary(CreateLinkRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when creating link for asset', err)
                return reject(err)
            }

            const request = create(CreateLinkRequestSchema, { header: header, body: body })

            try {
                const res = await this.client.create(request)
                await this.authenticate.doResponse(res, CreateLinkResponseBodySchema)
                await verifyLinkMetadata(res.body?.detail?.link)
                await verifyUrlMetadata(res.body?.detail?.url)
                resolve(res?.body?.detail as LinkDetail)
            } catch (err) {
                console.error('Fail to create link for asset', err)
                return reject(err)
            }
        })
    }

    /**
     * 搜索资产分享链接
     *
     * @param page - 当前页码
     * @param pageSize - 每页显示的条目数
     * @param condition 可选，搜索某个资产的分享链接。
     *
     * @returns 分享链接元信息
     *
     */
    search(page: number = 1, pageSize: number = 10, condition?: Partial<SearchLinkCondition>) {
        return new Promise<LinkMetadata[]>(async (resolve, reject) => {
            const body = create(SearchLinkRequestBodySchema, {
                condition: create(SearchLinkConditionSchema, {
                    hash: condition ? condition.hash : undefined
                }),
                page: create(RequestPageSchema, { page: page, pageSize: pageSize })
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(SearchLinkRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when searching link.', err)
                return reject(err)
            }

            const request = create(SearchLinkRequestSchema, { header: header, body: body })

            try {
                const res = await this.client.search(request)
                await this.authenticate.doResponse(res, SearchLinkResponseBodySchema)
                const links = []
                for (const link of res.body?.links as LinkMetadata[]) {
                    try {
                        await verifyLinkMetadata(link)
                        links.push(link)
                    } catch (err) {
                        console.error(
                            `Invalid link=${JSON.stringify(toJson(LinkMetadataSchema, link))} when searching.`,
                            err
                        )
                    }
                }
                resolve(links)
            } catch (err) {
                console.error('Fail to search links', err)
                return reject(err)
            }
        })
    }

    /**
     * 获得资产分享链接详情
     *
     * @param uid 分享链接唯一ID
     *
     * @returns 分享链接详情
     *
     */
    detail(uid: string) {
        return new Promise<LinkDetail>(async (resolve, reject) => {
            const body = create(LinkDetailRequestBodySchema, { uid: uid })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(LinkDetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when getting link detail', err)
                return reject(err)
            }

            const request = create(LinkDetailRequestSchema, { header: header, body: body })

            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, LinkDetailResponseBodySchema)
                const detail = res.body?.detail as LinkDetail
                await verifyLinkMetadata(detail.link)
                await verifyUrlMetadata(detail.url)
                resolve(detail)
            } catch (err) {
                console.error('Fail to get link detail.', err)
                return reject(err)
            }
        })
    }

    /**
     * 取消资产分享
     *
     * @param uid 分享链接唯一ID
     *
     * @returns 分享链接详情
     *
     */
    disable(uid: string) {
        return new Promise<void>(async (resolve, reject) => {
            const body = create(DisableLinkRequestBodySchema, { linkId: uid })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(DisableLinkRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when disabling link', err)
                return reject(err)
            }

            const request = create(DisableLinkRequestSchema, { header: header, body: body })

            try {
                const res = await this.client.disable(request)
                await this.authenticate.doResponse(res, DisableLinkResponseBodySchema)
                resolve()
            } catch (err) {
                console.error('Fail to disable link.', err)
                return reject(err)
            }
        })
    }

    /**
     * 获得资产链接访问者
     *
     * @param uid 分享链接唯一ID
     * @param page - 当前页码
     * @param pageSize - 每页显示的条目数
     *
     * @returns 资产链接访问者列表
     *
     */
    visitors(uid: string, page: number = 1, pageSize: number = 10) {
        return new Promise<VisitorMetadata[]>(async (resolve, reject) => {
            const body = create(LinkVisitorRequestBodySchema, {
                uid: uid,
                page: create(RequestPageSchema, { page: page, pageSize: pageSize })
            })

            let header
            try {
                header = await this.authenticate.createHeader(toBinary(LinkVisitorRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header when get link visitors', err)
                return reject(err)
            }

            const request = create(LinkVisitorRequestSchema, { header: header, body: body })

            try {
                const res = await this.client.visitor(request)
                await this.authenticate.doResponse(res, LinkVisitorResponseBodySchema)
                const visitors = []
                for (const visitor of res.body?.visitors as VisitorMetadata[]) {
                    if (visitor.did) {
                        try {
                            await verifyVisitorMetadata(visitor)
                            visitors.push(visitor)
                        } catch (err) {
                            console.error(
                                `Fail to verify visitor metadata: ${JSON.stringify(toJson(VisitorMetadataSchema, visitor))}`,
                                err
                            )
                        }
                    } else {
                        visitors.push(visitor)
                    }
                }
                resolve(visitors)
            } catch (err) {
                console.error('Fail to get visitors for link.', err)
                return reject(err)
            }
        })
    }
}
