import { Authenticate } from '../common/authenticate'
import { PageResponseResult, ProviderOption } from '../common/model'
import { Task, AddTaskRequestBodySchema, AddTaskRequestSchema, AddTaskResponseBodySchema,
    DetailTaskRequestSchema, DetailTaskRequestBodySchema, DetailTaskResponseBodySchema,
    ListTaskRequestSchema, ListTaskRequestBodySchema, ListTaskResponseBodySchema,
    UpdateTaskRequestSchema, UpdateTaskRequestBodySchema, UpdateTaskResponseBodySchema,
    DeleteTaskRequestSchema, DeleteTaskRequestBodySchema, DeleteTaskResponseBodySchema,
    TaskListConditionJson,
    TaskListConditionSchema,
 } from '../../yeying/api/correction/task_pb'
import { Client, createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { create, enumFromJson, fromJson, toBinary, toJson } from '@bufbuild/protobuf'
import { MessageHeader, RequestPageSchema, ResponsePage, ResponsePageSchema } from '../../yeying/api/common/message_pb'
import { TaskMetadata, TaskMetadataJson, TaskMetadataSchema } from '../../yeying/api/correction/meta_pb'
import { TaskStatusEnumJson, TaskStatusEnumSchema } from '../../yeying/api/correction/imagecontent_pb'
import { TaskListCondition } from './model/model'

/*
 * 教学任务档案
 */
export class TaskProvider {
    private authenticate: Authenticate
    private client: Client<typeof Task>

    /**
     * 构造函数
     * @param option - 提供者选项，如代理设置
     * @example
     * ```ts
     * const providerOption = { proxy: <proxy url>, blockAddress: <your block address> };
     * const taskProvider = new TaskProvider(providerOption);
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            Task,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 教学任务列表
     * @param did 
     * @returns 
     */
    list(pageIndex: number, pageSize: number, taskListCondition: TaskListConditionJson) {
        return new Promise<PageResponseResult<TaskMetadataJson>>(async (resolve, reject) => {
            const body = create(ListTaskRequestBodySchema, {
                condition: fromJson(TaskListConditionSchema, taskListCondition),
                page: create(RequestPageSchema, { page: pageIndex, pageSize: pageSize }),
            })
            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(ListTaskRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for list task', err)
                return reject(err)
            }

            const request = create(ListTaskRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.list(request)
                await this.authenticate.doResponse(res, ListTaskResponseBodySchema)
                assert.isDefined(res.body)
                const taskMetadataList =  res.body?.list
                const taskMetadataJsonList: TaskMetadataJson [] = []
                for (const meta of taskMetadataList) {
                    const taskMetadataJson = toJson(TaskMetadataSchema, meta, {
                        alwaysEmitImplicit: true
                    }) as TaskMetadataJson

                    try {
                        taskMetadataJsonList.push(taskMetadataJson)
                    } catch (err) {
                        console.error(
                            `invalid taskMetadataJson=${JSON.stringify(taskMetadataJson)} when searching taskMetadataJson.`,
                            err
                        )
                    }
                }
                resolve(PageResponseResult.buildPageInfo(taskMetadataJsonList, toJson(ResponsePageSchema, res.body?.page as ResponsePage)))
            } catch (err) {
                console.error('Fail to get task list', err)
                return reject(err)
            }
        })
    }

    /**
     * 教学任务详情
     * @param uid 
     * @returns 
     */
    detail(uid: string) {
        return new Promise<TaskMetadataJson>(async (resolve, reject) => {
            const body = create(DetailTaskRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(DetailTaskRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for detail task', err)
                return reject(err)
            }

            const request = create(DetailTaskRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, DetailTaskResponseBodySchema)
                resolve(toJson(TaskMetadataSchema, res.body?.meta as TaskMetadata))
            } catch (err) {
                console.error('Fail to get task detail', err)
                return reject(err)
            }
        })
    }

    /**
     * 添加
     * @param uid 
     * @returns 
     */
    add(meta: TaskMetadataJson) {
        return new Promise<TaskMetadataJson>(async (resolve, reject) => {
            
            const body = create(AddTaskRequestBodySchema, {
                meta: fromJson(TaskMetadataSchema, meta)
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(AddTaskRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for task Add', err)
                return reject(err)
            }

            const request = create(AddTaskRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.add(request)
                await this.authenticate.doResponse(res, AddTaskResponseBodySchema)
                resolve(toJson(TaskMetadataSchema, res.body?.meta as TaskMetadata))
            } catch (err) {
                console.error('Fail to get task Add', err)
                return reject(err)
            }
        })
    }

    /**
     * 教学任务更新
     * @param uid 
     * @returns 
     */
    update(meta: TaskMetadataJson) {
        return new Promise<TaskMetadataJson>(async (resolve, reject) => {
            const body = create(UpdateTaskRequestBodySchema, {
                meta: fromJson(TaskMetadataSchema, meta)
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(UpdateTaskRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Update task', err)
                return reject(err)
            }

            const request = create(UpdateTaskRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.update(request)
                await this.authenticate.doResponse(res, UpdateTaskResponseBodySchema)
                resolve(toJson(TaskMetadataSchema, res.body?.meta as TaskMetadata))
            } catch (err) {
                console.error('Fail to get task Update', err)
                return reject(err)
            }
        })
    }

    /**
     * 教学任务删除
     * @param uid 
     * @returns 
     */
    delete(uid: string) {
        return new Promise<TaskMetadataJson>(async (resolve, reject) => {
            const body = create(DeleteTaskRequestBodySchema, {
                uid: uid
            })

            let header: MessageHeader
            try {
                // 创建消息头
                header = await this.authenticate.createHeader(toBinary(DeleteTaskRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for Delete task', err)
                return reject(err)
            }

            const request = create(DeleteTaskRequestSchema, { header: header, body: body })
            console.log("获取 request")
            console.log(request)
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, DeleteTaskResponseBodySchema)
                resolve(toJson(TaskMetadataSchema, res.body?.meta as TaskMetadata))
            } catch (err) {
                console.error('Fail to get task Delete', err)
                return reject(err)
            }
        })
    }
}