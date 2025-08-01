import { BlockProvider } from './block'
import { AssetCipher } from './cipher'
import { readBlock } from '../../common/file'
import {
    convertDateToDateTime,
    convertToUtcDateTime,
    decodeHex,
    Digest,
    encodeHex,
    getCurrentUtcString,
    SecurityAlgorithm,
    toISO
} from '@yeying-community/yeying-web3'
import { getDigitalFormatByName } from '../../common/common'
import { AssetMetadataJson } from '../../yeying/api/asset/asset_pb'
import { enumToJson, toJson } from '@bufbuild/protobuf'
import { ProviderOption } from '../common/model'
import { AssetProvider } from './asset'
import { ConfigProvider } from '../config/config'
import { ConfigTypeEnum } from '../../yeying/api/config/config_pb'
import { BlockMetadataJson } from '../../yeying/api/asset/block_pb'
import { UploadCallback, UploadResult } from './model'
import { DigitalFormatEnumSchema } from '../../yeying/api/common/code_pb'

/**
 * 该类用于上传资产文件，通过将文件分块后上传，每个块加密（可选）并生成哈希值，最后对整个资产进行签名
 *
 * 发送资产的SOP是：
 * 1、分块
 * 2、读第一块
 * 3、哈希
 * 4、加密（可选）
 * 5、检查是否块是否全部发送
 * 6、否，读下一块
 * 7、循环直到全部发送
 * 8、签名
 */
export class Uploader {
    blockProvider: BlockProvider
    assetProvider: AssetProvider
    assetCipher: AssetCipher
    configProvider: ConfigProvider
    chunkSize?: number
    isAbort: boolean = false

    /**
     * 构造函数
     *
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @param securityAlgorithm - 安全算法配置，包含算法名称和 IV
     * @example
     *
     * ```ts
     * const option = {
     *   proxy: 'http://proxy.example.com',
     *   blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' }
     * }
     *
     * const securityAlgorithm = { name: 'AES-GCM', iv: 'base64-encoded-iv' }
     * const uploader = new Uploader(option, securityAlgorithm)
     * ```
     */
    constructor(option: ProviderOption, securityAlgorithm: SecurityAlgorithm) {
        this.configProvider = new ConfigProvider(option)
        this.blockProvider = new BlockProvider(option)
        this.assetProvider = new AssetProvider(option)
        this.assetCipher = new AssetCipher(option.blockAddress, securityAlgorithm)
    }

    public abort() {
        this.isAbort = true
    }

    /**
     * 创建资产元信息
     *
     * @param namespaceId - 命名空间 ID
     * @param file - 要上传的文件对象
     * @param encrypted - 是否对文件进行加密（默认为 false）
     * @param description - 资产描述（可选）
     * @param parentHash - 父资产的哈希值（可选）
     *
     * @returns 返回生成的资产元数据
     *
     */
    async createAssetMetadataJson(
        namespaceId: string,
        file: File,
        encrypted: boolean = false,
        description?: string,
        parentHash?: string
    ) {
        return new Promise<AssetMetadataJson>(async (resolve, reject) => {
            try {
                if (this.chunkSize === undefined) {
                    const metadata = await this.configProvider.get('chunk.size', ConfigTypeEnum.CONFIG_TYPE_SYSTEM)
                    if (metadata.value === undefined) {
                        return reject('chunkSize is undefined')
                    }
                    this.chunkSize = parseInt(metadata.value)
                }

                const asset: AssetMetadataJson = {
                    namespaceId: namespaceId,
                    owner: this.blockProvider.getOwner(), // 设置资产拥有者
                    parentHash: parentHash || '', // 设置父哈希
                    name: file.name, // 设置文件名称
                    format: enumToJson(DigitalFormatEnumSchema, getDigitalFormatByName(file.name)), // 获取文件格式
                    createdAt: toISO(convertToUtcDateTime(convertDateToDateTime(new Date(file.lastModified)))),
                    updatedAt: getCurrentUtcString(),
                    description: description || '',
                    size: file.size.toString(),
                    chunkCount: Math.ceil(file.size / this.chunkSize),
                    chunkSize: this.chunkSize,
                    isEncrypted: encrypted
                }

                if (parentHash) {
                    const parent = await this.assetProvider.detail(namespaceId, parentHash)
                    asset.version = (parent.version || 0) + 1
                }
                console.log(`File last modified time=${file.lastModified}`)
                resolve(asset)
            } catch (err) {
                console.error(`Fail to upload the file=${file.name}`, err)
                return reject(err) // 上传失败，返回错误
            }
        })
    }

    /**
     * 上传文件,将文件分块处理，加密（可选），并逐块上传到区块链网络中
     *
     * @param file - 要上传的文件对象
     * @param asset - 部分资产元信息
     * @param blockCallback - 可选，通知当前成功的块元信息和进度信息
     *
     * @returns 返回生成的资产元数据
     *
     * @example
     * ```ts
     * const file = new File(['Hello, world!'], 'example.txt', { type: 'text/plain' })
     * uploader.upload('example-namespace', file)
     *   .then(assetMetadata => console.log(assetMetadata))
     *   .catch(err => console.error(err))
     * ```
     */
    upload(file: File, asset: AssetMetadataJson, blockCallback?: UploadCallback): Promise<AssetMetadataJson> {
        return new Promise<AssetMetadataJson>(async (resolve, reject) => {
            try {
                const assetDigest = new Digest()
                const mergeDigest = new Digest()
                const chunkCount = asset.chunkCount as number
                const chunkList = new Array(chunkCount) // 用于存储每个块的元数据
                const blockList: BlockMetadataJson[] = new Array(chunkCount)
                const chunkSize = asset.chunkSize as number
                const namespaceId = asset.namespaceId as string

                // 按顺序上传文件的每一块
                for (let index = 0; index < chunkCount; index++) {
                    if (this.isAbort) {
                        return
                    }

                    const start = index * chunkSize
                    const end = Math.min(Number(asset.size), start + chunkSize)
                    console.log(`Try to read the index=${index} chunk, size=${end - start}`)
                    let data = await readBlock(file, start, end) // 读取文件块
                    assetDigest.update(data) // 更新资产的哈希

                    if (asset.isEncrypted) {
                        // 对数据进行加密（可选）
                        data = await this.assetCipher.encrypt(data)
                    }

                    // 上传块数据到区块存储
                    const block = await this.blockProvider.put(namespaceId, data)
                    const blockHash = block.hash as string
                    mergeDigest.update(decodeHex(blockHash)) // 更新合并哈希
                    chunkList[index] = blockHash
                    blockList[index] = block

                    if (blockCallback) {
                        const uploadResult: UploadResult = {
                            asset: asset,
                            block: block,
                            progress: { total: chunkCount, completed: index + 1 }
                        }
                        blockCallback(uploadResult)
                    }
                }

                asset.chunks = chunkList // 资产块的元数据
                asset.hash = encodeHex(assetDigest.sum()) // 资产哈希

                resolve(await this.assetProvider.sign(asset)) // 上传成功，返回资产元数据
            } catch (err) {
                console.error(`Fail to upload the file=${file.name}`, err)
                return reject(err) // 上传失败，返回错误
            }
        })
    }
}
