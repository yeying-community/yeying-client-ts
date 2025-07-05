import {
    CommandMessage,
    CommonConfig,
    ProcessMessage,
    ProcessType,
    UploadAssetMessage,
    WorkerCallback,
    WorkerOption
} from '../model'
import { Processor } from './common'
import { Uploader } from '../uploader'
import { AssetMetadataJson } from '../../../yeying/api/asset/asset_pb'

export class UploadProcessor implements Processor {
    private uploader: Uploader | undefined
    // 设置回调函数, 用于通知worker结束，或者中间状态
    private readonly callback: WorkerCallback

    constructor(callback: WorkerCallback) {
        this.callback = callback
    }

    async initialize(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`initialize worker: ${JSON.stringify(c)}`)
        const config: WorkerOption = c.payload
        //@ts-ignore, 当前定义的类是动态创建，这个类需要通过url传入进来
        this.uploader = new Uploader(config.providerOption, config.securityAlgorithm)
        return { workerId: c.workerId, msgId: c.msgId, processType: 'RESPONSE' }
    }

    async config(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`upload worker config: ${JSON.stringify(c)}`)
        const config: CommonConfig = c.payload
        return { workerId: c.workerId, msgId: c.msgId, processType: 'RESPONSE' }
    }

    async start(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`upload worker start: ${JSON.stringify(c)}`)
        // 实现实际处理逻辑
        const message: UploadAssetMessage = c.payload

        const asset = await this.uploader?.createAssetMetadataJson(message.namespaceId, message.file, message.encrypted)

        const complete = (a: any) => this.callback(this.createProcessMessage(c, 'COMPLETE', a))
        const error = (e: any) => this.callback(this.createProcessMessage(c, 'ERROR', e.message))
        const callback = (p: any) => this.callback(this.createProcessMessage(c, 'PROGRESS', p))
        this.uploader
            ?.upload(message.file, asset as AssetMetadataJson, callback)
            .then(complete)
            .catch(error)
        console.log(`upload worker start message: ${JSON.stringify(message)}`)
        return this.createProcessMessage(c, 'RESPONSE', asset)
    }

    async pause(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`upload worker pause: ${JSON.stringify(c)}`)
        return this.createProcessMessage(c, 'RESPONSE')
    }

    async abort(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`upload worker abort: ${JSON.stringify(c)}`)
        return this.createProcessMessage(c, 'RESPONSE')
    }

    async resume(c: CommandMessage): Promise<ProcessMessage> {
        console.log(`upload worker resume: ${JSON.stringify(c)}`)
        return this.createProcessMessage(c, 'RESPONSE')
    }

    // 必须实现静态序列化方法
    static deserialize(callback: WorkerCallback): UploadProcessor {
        return new UploadProcessor(callback)
    }

    createProcessMessage(c: CommandMessage, type: ProcessType, payload?: any): ProcessMessage {
        return {
            workerId: c.workerId,
            msgId: c.msgId,
            processType: type,
            payload: payload
        }
    }
}
