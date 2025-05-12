import { BlockProvider } from './block'
import { AssetMetadataSchema } from '../../yeying/api/asset/asset_pb'
import { AssetCipher } from './cipher'
import { toJson } from '@bufbuild/protobuf'
import { ProviderOption } from '../common/model'
import { SecurityAlgorithm } from '@yeying-community/yeying-web3'
import { AssetProvider } from './asset'
import {BlockMetadata} from "../../yeying/api/asset/block_pb";
import {Blob} from "happy-dom";

export type BlockCallback = (block: BlockMetadata, data: Blob) => void

export interface DownloadResult {
    blocks: BlockMetadata[],
    data?: Blob
}

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
     * @param progressCallback - 进度，返回完整的块信息数组，没完成下载的元素是undefined
     * @param blockCallback - 可选，如果设置了回调函数，表示资产块下载完毕后，使用回调函数通知，否则执行合并
     *
     * @returns  如果设置了函数，则返块列表，否则，返回块列表和整个文件的内容（Blob）
     * @example
     * ```ts
     * downloader.download('example-namespace', 'example-hash')
     *   .then(file => console.log(file))
     *   .catch(err => console.error(err))
     * ```
     */
    download(namespaceId: string, hash: string, progressCallback?: Function, blockCallback?: BlockCallback): Promise<DownloadResult> {
        return new Promise<DownloadResult>(async (resolve, reject) => {
            try {
                const asset = await this.assetProvider.detail(namespaceId, hash)
                console.log(`Try to download asset=${JSON.stringify(toJson(AssetMetadataSchema, asset))}`)

                const chunkBlobs = new Array(asset.chunkCount).fill(undefined)
                const blockList: BlockMetadata[] = new Array(asset.chunkCount)

                for (let index: number = 0; index < asset.chunkCount; index++) {
                    if (this.isAbort) {
                        return
                    }

                    // 下载数据块
                    const result = await this.blockProvider.get(namespaceId, asset.chunks[index])
                    if (asset.isEncrypted) {
                        // 如果资产加密，解密数据块
                        result.data = await this.assetCipher.decrypt(result.data)
                    }

                    // 将解密后的数据块转换为 Blob
                    const blockData =  new Blob([result.data], { type: 'application/octet-stream' })
                    blockList[index] = result.block

                    if (blockCallback) {
                        blockCallback(result.block, blockData)
                    } else {
                        chunkBlobs[index] = blockData
                    }

                    if (progressCallback) {
                        progressCallback(blockList)
                    }

                    // 如果所有块都已下载，合并为一个 Blob 并返回
                    if (index === chunkBlobs.length - 1) {
                        if (blockCallback) {
                            resolve({blocks: blockList})
                        } else {
                            resolve({blocks: blockList, data: new Blob(chunkBlobs, { type: 'application/octet-stream' })})
                        }
                    }
                }
            } catch (e) {
                console.log(`Fail to download asset, namespaceId=${namespaceId}, hash=${hash}`, e)
                return reject(e)
            }
        })
    }
}
