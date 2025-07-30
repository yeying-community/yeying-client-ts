import { Authenticate } from '../common/authenticate'
import { PageResponseResult, ProviderOption } from '../common/model'
import { TaskTag, AddTaskTagRequestBodySchema, AddTaskTagRequestSchema, AddTaskTagResponseBodySchema,
    DetailTaskTagRequestSchema, DetailTaskTagRequestBodySchema, DetailTaskTagResponseBodySchema,
    ListTaskTagRequestSchema, ListTaskTagRequestBodySchema, ListTaskTagResponseBodySchema,
    UpdateTaskTagRequestSchema, UpdateTaskTagRequestBodySchema, UpdateTaskTagResponseBodySchema,
    DeleteTaskTagRequestSchema, DeleteTaskTagRequestBodySchema, DeleteTaskTagResponseBodySchema,
 } from '../../yeying/api/correction/tasktag_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { MessageHeader } from '../../yeying/api/common/message_pb'
import { TaskTagMetadata, TaskTagMetadataJson, TaskTagMetadataSchema } from '../../yeying/api/correction/meta_pb'

/**
 * 自定义任务标签管理
 * 有老师创建任务的时候需要关联标签，创建任务表单展示标签列表，来时选择标签，如果没有标签需要创建标签
 * 用户也可以提前创建自己的标签，进入标签管理页面 CURD
 * 每个用户自己管理自己的标签
 */
export class TaskTagProvider {
    private authenticate: Authenticate
    private client: Client<typeof TaskTag>

    /**
     * 构造函数
     * @param option - 提供者选项，如代理设置
     * @example
     * ```ts
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const taskTagProvider = new TaskTagProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            TaskTag,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 标签列表
     * @param did 用户标识
     * @returns 
     */
    list(did: string) {
        return new Promise<PageResponseResult<TaskTagMetadataJson>>(async (resolve, reject) => {
            const body = create(ListTaskTagRequestBodySchema, {
                did: did
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ListTaskTagRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for list TaskTag', err)
                return reject(err)
            }

            const request = create(ListTaskTagRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.list(request)
                await this.authenticate.doResponse(res, ListTaskTagResponseBodySchema)
                assert.isDefined(res.body)
                const taskTagMetadataList =  res.body?.list
                const taskTagMetadataJsonList: TaskTagMetadataJson [] = []
                for (const meta of taskTagMetadataList) {
                    const taskTagMetadataJson = toJson(TaskTagMetadataSchema, meta, {
                        alwaysEmitImplicit: true
                    }) as TaskTagMetadataJson

                    try {
                        taskTagMetadataJsonList.push(taskTagMetadataJson)
                    } catch (err) {
                        console.error(
                            `invalid taskTagMetadataJson=${JSON.stringify(taskTagMetadataJson)} when searching taskTagMetadataJson.`,
                            err
                        )
                    }
                }
                // todo total
                resolve(PageResponseResult.buildPageInfo(taskTagMetadataJsonList, {}))
            } catch (err) {
                console.error('Fail to get TaskTag list', err)
                return reject(err)
            }
        })
    }

    /**
     * 标签详情
     * @param uid 
     * @returns 
     */
    detail(uid: string) {
        return new Promise<TaskTagMetadataJson>(async (resolve, reject) => {
            const body = create(DetailTaskTagRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(DetailTaskTagRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for detail TaskTag', err)
                return reject(err)
            }

            const request = create(DetailTaskTagRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, DetailTaskTagResponseBodySchema)
                resolve(toJson(TaskTagMetadataSchema, res.body?.meta as TaskTagMetadata))
            } catch (err) {
                console.error('Fail to get TaskTag detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 添加标签
     * @param meta 
     * @returns 
     */
    add(meta: TaskTagMetadataJson) {
        return new Promise<TaskTagMetadataJson>(async (resolve, reject) => {
            
            const body = create(AddTaskTagRequestBodySchema, {
                meta: fromJson(TaskTagMetadataSchema, meta)
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(AddTaskTagRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for TaskTag Add', err)
                return reject(err)
            }

            const request = create(AddTaskTagRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.add(request)
                await this.authenticate.doResponse(res, AddTaskTagResponseBodySchema)
                resolve(toJson(TaskTagMetadataSchema, res.body?.meta as TaskTagMetadata))
            } catch (err) {
                console.error('Fail to get TaskTag Add', err)
                return reject(err)
            }
        })
    }

    /**
     * 修改标签
     * @param meta 
     * @returns 
     */
    update(meta: TaskTagMetadataJson) {
        return new Promise<TaskTagMetadataJson>(async (resolve, reject) => {
            const body = create(UpdateTaskTagRequestBodySchema, {
                meta: fromJson(TaskTagMetadataSchema, meta)
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(UpdateTaskTagRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Update TaskTag', err)
                return reject(err)
            }

            const request = create(UpdateTaskTagRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.update(request)
                await this.authenticate.doResponse(res, UpdateTaskTagResponseBodySchema)
                resolve(toJson(TaskTagMetadataSchema, res.body?.meta as TaskTagMetadata))
            } catch (err) {
                console.error('Fail to get TaskTag Update', err)
                return reject(err)
            }
        })
    }

    /**
     * 删除标签
     * @param uid 
     * @returns 
     */
    delete(uid: string) {
        return new Promise<TaskTagMetadataJson>(async (resolve, reject) => {
            const body = create(DeleteTaskTagRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(DeleteTaskTagRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Delete TaskTag', err)
                return reject(err)
            }

            const request = create(DeleteTaskTagRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, DeleteTaskTagResponseBodySchema)
                resolve(toJson(TaskTagMetadataSchema, res.body?.meta as TaskTagMetadata))
            } catch (err) {
                console.error('Fail to get TaskTag Delete', err)
                return reject(err)
            }
        })
    }
}