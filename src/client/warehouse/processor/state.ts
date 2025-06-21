import { Processor } from "./common";
import { CommandMessage, ProcessMessage, WorkerCallback } from "../model";

export class StateProcessor implements Processor {
  // 设置回调函数, 用于通知worker结束，或者中间状态
  private readonly callback: WorkerCallback;

  constructor(callback: WorkerCallback) {
    this.callback = callback;
  }

  async initialize(c: CommandMessage): Promise<ProcessMessage> {
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  async config(c: CommandMessage): Promise<ProcessMessage> {
    console.log(`state worker config: ${JSON.stringify(c)}`);
    // 调节速度、并发度等
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  async start(c: CommandMessage): Promise<ProcessMessage> {
    console.log(`state worker start: ${JSON.stringify(c)}`);
    // 实现实际处理逻辑
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  async abort(c: CommandMessage): Promise<ProcessMessage> {
    console.log(`state worker abort: ${JSON.stringify(c)}`);
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  async pause(c: CommandMessage): Promise<ProcessMessage> {
    console.log(`state worker pause: ${JSON.stringify(c)}`);
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  async resume(c: CommandMessage): Promise<ProcessMessage> {
    console.log(`state worker resume: ${JSON.stringify(c)}`);
    return { workerId: c.workerId, msgId: c.msgId, processType: "RESPONSE" };
  }

  // 必须实现静态序列化方法
  static deserialize(callback: WorkerCallback): StateProcessor {
    return new StateProcessor(callback);
  }
}
