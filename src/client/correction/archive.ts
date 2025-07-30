import { Authenticate } from '../common/authenticate'
import { PageResponseResult, ProviderOption } from '../common/model'
import { Archive, 
    ArchiveListRequestBodySchema, ArchiveListRequestSchema, ArchiveListResponseBodySchema,
    ArchiveAddRequestBodySchema, ArchiveAddRequestSchema, ArchiveAddResponseBodySchema,
    ArchiveDeleteRequestBodySchema, ArchiveDeleteRequestSchema, ArchiveDeleteResponseBodySchema,
    ArchiveUpdateRequestBodySchema, ArchiveUpdateRequestSchema, ArchiveUpdateResponseBodySchema,
    ArchiveDetailRequestSchema, ArchiveDetailRequestBodySchema, ArchiveDetailResponseBodySchema,
    ArchiveDetailStudentRequestSchema, ArchiveDetailStudentRequestBodySchema, ArchiveDetailStudentResponseBodySchema,
    
 } from '../../yeying/api/correction/archive_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { MessageHeader, RequestPageSchema, ResponsePage, ResponsePageSchema } from '../../yeying/api/common/message_pb'
import { ArchiveMetadata, ArchiveMetadataJson, ArchiveMetadataSchema } from '../../yeying/api/correction/meta_pb'

/**
 * 学生档案
 */
export class ArchiveProvider {
    private authenticate: Authenticate
    private client: Client<typeof Archive>

    /**
     * 构造函数
     * @param option - 提供者选项，如代理设置
     * @example
     * ```ts
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const archiveProvider = new ArchiveProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Archive,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 学生档案列表:老师调用
     * @param teacherDid 
     * @returns 
     */
    list(teacherDid: string, name: string, pageIndex: number, pageSize: number) {
        return new Promise<PageResponseResult<ArchiveMetadataJson>>(async (resolve, reject) => {
            const body = create(ArchiveListRequestBodySchema, {
                teacherDid: teacherDid,
                name: name,
                page: create(RequestPageSchema, { page: pageIndex, pageSize: pageSize }),
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveListRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for list Archive', err)
                return reject(err)
            }

            const request = create(ArchiveListRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.list(request)
                await this.authenticate.doResponse(res, ArchiveListResponseBodySchema)
                assert.isDefined(res.body)
                const archiveMetadataList =  res.body?.list
                const archiveMetadataJsonList: ArchiveMetadataJson [] = []
                for (const meta of archiveMetadataList) {
                    const archiveMetadataJson = toJson(ArchiveMetadataSchema, meta, {
                        alwaysEmitImplicit: true
                    }) as ArchiveMetadataJson

                    try {
                        archiveMetadataJsonList.push(archiveMetadataJson)
                    } catch (err) {
                        console.error(
                            `invalid archiveMetadataJson=${JSON.stringify(archiveMetadataJson)} when searching archiveMetadataJson.`,
                            err
                        )
                    }
                }
                resolve(PageResponseResult.buildPageInfo(archiveMetadataJsonList, toJson(ResponsePageSchema, res.body?.page as ResponsePage)))
            } catch (err) {
                console.error('Fail to get archive list', err)
                return reject(err)
            }
        })
    }

    /**
     * 学生档案详情:老师调用
     * @param uid 
     * @returns 
     */
    detail(uid: string) {
        return new Promise<ArchiveMetadataJson>(async (resolve, reject) => {
            const body = create(ArchiveDetailRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveDetailRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for detail Archive', err)
                return reject(err)
            }

            const request = create(ArchiveDetailRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, ArchiveDetailResponseBodySchema)
                resolve(toJson(ArchiveMetadataSchema, res.body?.meta as ArchiveMetadata))
            } catch (err) {
                console.error('Fail to get archive detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 学生档案详情:学生调用
     * @param studentDid 
     * @returns 
     */
    detailStudent(studentDid: string) {
        return new Promise<ArchiveMetadataJson>(async (resolve, reject) => {
            const body = create(ArchiveDetailStudentRequestBodySchema, {
                studentDid: studentDid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveDetailStudentRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for detail Archive', err)
                return reject(err)
            }

            const request = create(ArchiveDetailStudentRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.detailByStudentDid(request)
                await this.authenticate.doResponse(res, ArchiveDetailStudentResponseBodySchema)
                resolve(toJson(ArchiveMetadataSchema, res.body?.meta as ArchiveMetadata))
            } catch (err) {
                console.error('Fail to get archive detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 添加档案：老师调用
     * @param ArchiveMetadataJson
     * @returns 
     */
    add(meta: ArchiveMetadataJson) {
        return new Promise<ArchiveMetadataJson>(async (resolve, reject) => {
            const body = create(ArchiveAddRequestBodySchema, {
                meta: fromJson(ArchiveMetadataSchema, meta)
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveAddRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for add Archive', err)
                return reject(err)
            }

            const request = create(ArchiveAddRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.add(request)
                await this.authenticate.doResponse(res, ArchiveAddResponseBodySchema)
                resolve(toJson(ArchiveMetadataSchema, res.body?.meta as ArchiveMetadata))
            } catch (err) {
                console.error('Fail to add archive detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 删除档案：老师调用
     * @param uid 
     * @returns 
     */
    delete(uid: string) {
        return new Promise<ArchiveMetadataJson>(async (resolve, reject) => {
            const body = create(ArchiveDeleteRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveDeleteRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Delete Archive', err)
                return reject(err)
            }

            const request = create(ArchiveDeleteRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, ArchiveDeleteResponseBodySchema)
                resolve(toJson(ArchiveMetadataSchema, res.body?.meta as ArchiveMetadata))
            } catch (err) {
                console.error('Fail to Delete archive detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 修改档案：老师调用
     * @param ArchiveMeta 
     * @returns 
     */
    update(meta: ArchiveMetadata) {
        return new Promise<ArchiveMetadataJson>(async (resolve, reject) => {
            const body = create(ArchiveUpdateRequestBodySchema, {
                meta: meta
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ArchiveUpdateRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Update Archive', err)
                return reject(err)
            }

            const request = create(ArchiveUpdateRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.update(request)
                await this.authenticate.doResponse(res, ArchiveUpdateResponseBodySchema)
                resolve(toJson(ArchiveMetadataSchema, res.body?.meta as ArchiveMetadata))
            } catch (err) {
                console.error('Fail to Update archive detail', err)
                return reject(err)
            }
        })
    }
}