import { BlockProvider } from './block'
import { AssetMetadata, AssetMetadataSchema } from '../../yeying/api/asset/asset_pb'
import { AssetCipher } from './cipher'
import { toJson } from '@bufbuild/protobuf'
import { ProviderOption } from '../common/model'
import { SecurityAlgorithm } from '@yeying-community/yeying-web3'
import { AssetProvider } from './asset'
import { DownloadCallback, DownloadResult } from './model'

/**
 * 用于下载资产数据，支持从区块提供者获取数据并进行解密
 */
export class Downloader {
    blockProvider: BlockProvider
    assetProvider: AssetProvider
    assetCipher: AssetCipher
    isAbort: boolean = false

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @param securityAlgorithm - 安全算法配置，包含算法名称和 IV
     * @example
     * ```ts
     * const option = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const securityAlgorithm = { name: 'AES-GCM', iv: 'base64-encoded-iv' }
     * const downloader = new Downloader(option, securityAlgorithm)
     * ```
     */
    constructor(option: ProviderOption, securityAlgorithm: SecurityAlgorithm) {
        this.assetProvider = new AssetProvider(option)
        this.blockProvider = new BlockProvider(option)
        this.assetCipher = new AssetCipher(option.blockAddress, securityAlgorithm)
    }

    public abort() {
        this.isAbort = true
    }

    /**
     * 下载文件,根据命名空间 ID 和哈希值下载文件,如果文件被加密，会自动解密
     * @param namespaceId - 命名空间 ID
     * @param hash - 资产的哈希值
     * @param blockCallback - 返回完整的资产块元信息和数据，以及进度
     *
     * @returns  资产块元信息
     * @example
     * ```ts
     * downloader.download('example-namespace', 'example-hash')
     *   .then(file => console.log(file))
     *   .catch(err => console.error(err))
     * ```
     */
    download(namespaceId: string, hash: string, blockCallback?: DownloadCallback): Promise<AssetMetadata> {
        return new Promise<AssetMetadata>(async (resolve, reject) => {
            try {
                const asset = await this.assetProvider.detail(namespaceId, hash)
                console.log(`Try to download asset=${JSON.stringify(toJson(AssetMetadataSchema, asset))}`)
                for (let index: number = 0; index < asset.chunkCount; index++) {
                    if (this.isAbort) {
                        return
                    }

                    // 下载数据块
                    const detail = await this.blockProvider.get(namespaceId, asset.chunks[index])
                    if (asset.isEncrypted) {
                        // 如果资产加密，解密数据块
                        detail.data = await this.assetCipher.decrypt(detail.data)
                    }

                    if (blockCallback) {
                        const result: DownloadResult = {
                            block: detail.block,
                            data: detail.data,
                            progress: { total: asset.chunkCount, completed: index + 1 }
                        }
                        blockCallback(result)
                    }
                }

                resolve(asset)
            } catch (e) {
                console.log(`Fail to download asset, namespaceId=${namespaceId}, hash=${hash}`, e)
                return reject(e)
            }
        })
    }
}
