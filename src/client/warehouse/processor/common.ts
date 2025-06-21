import { CommandMessage, ProcessMessage } from "../model";

export interface Processor {
  // 初始化
  initialize(message: CommandMessage): Promise<ProcessMessage>;

  // 配置命令, 调节速度、并发度等
  config(message: CommandMessage): Promise<ProcessMessage>;

  // 开始命令
  start(message: CommandMessage): Promise<ProcessMessage>;

  // 终止命令
  abort(message: CommandMessage): Promise<ProcessMessage>;

  // 暂停命令
  pause(message: CommandMessage): Promise<ProcessMessage>;

  // 重启命令
  resume(message: CommandMessage): Promise<ProcessMessage>;
}
