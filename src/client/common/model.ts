import { BlockAddress } from '@yeying-community/yeying-web3'

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
