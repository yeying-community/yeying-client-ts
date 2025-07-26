import { BlockAddress } from '@yeying-community/yeying-web3'
import { ResponsePageJson } from '../../yeying/api/common/message_pb'

/**
 * 提供商选项接口，包含代理配置
 */
export interface ProviderOption {
    /**
     * 代理服务器的 URL 地址
     */
    proxy: string

    /**
     * 区块链地址
     */
    blockAddress: BlockAddress
}

/**
 * 分页响应结果类
 */
export class PageResponseResult<T> {
  page?: ResponsePageJson
  list?: T[]

  /**
   * 构建分页信息
   * @param list 当前页数据
   * @param page 分页内容
   */
  static buildPageInfo<T>(list: T[], page: ResponsePageJson): PageResponseResult<T> {
    return new PageResponseResult(list, page);
  }

  constructor(list: T[], page: ResponsePageJson) {
    this.list = list;
    this.page = page;    
  }
}
