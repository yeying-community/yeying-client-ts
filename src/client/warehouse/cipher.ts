import {
    BlockAddress,
    decodeBase64,
    decrypt,
    deriveFromBlockAddress,
    encrypt,
    importKey,
    SecurityAlgorithm
} from '@yeying-community/yeying-web3'

import { convertToAlgorithmName } from '../../common/common'
import { CipherTypeEnum } from '../../yeying/api/common/code_pb'

/**
 * 提供资产加密和解密功能
 */
export class AssetCipher {
    private readonly rawKey: Promise<CryptoKey>
    private readonly algorithmName: string
    private readonly iv: Buffer

    /**
     * 构造函数
     * @param blockAddress - 区块地址，用于生成加密密钥
     * @param securityAlgorithm - 安全算法配置，包含算法名称和 IV
     * @example
     * ```ts
     * const securityAlgorithm = { name: 'AES-GCM', iv: 'base64-encoded-iv' }
     * const assetCipher = new AssetCipher(blockAddress, securityAlgorithm)
     * ```
     */
    constructor(blockAddress: BlockAddress, securityAlgorithm: SecurityAlgorithm) {
        const rawKey = deriveFromBlockAddress(blockAddress)
        this.algorithmName = convertToAlgorithmName(
            CipherTypeEnum[securityAlgorithm.name as keyof typeof CipherTypeEnum]
        )
        this.iv = decodeBase64(securityAlgorithm.iv)
        this.rawKey = importKey(rawKey, this.algorithmName)
    }

    /**
     * 解密数据,使用初始化的密钥和算法对加密数据进行解密
     *
     * @param data 加密后的数据（Uint8Array）
     *
     * @returns 明文数据
     *
     * @example
     * ```ts
     * const decryptedData = await assetCipher.decrypt(encryptedData)
     * ```
     */
    async decrypt(data: Uint8Array) {
        return new Uint8Array(await decrypt(await this.rawKey, data, this.iv, this.algorithmName))
    }

    /**
     * 加密数据,使用初始化的密钥和算法对原始数据进行加密
     *
     * @param data 原始数据
     *
     * @returns 密文数据
     *
     * @example
     * ```ts
     * const encryptedData = await assetCipher.encrypt(plainData)
     * ```
     */
    async encrypt(data: Uint8Array) {
        return new Uint8Array(await encrypt(await this.rawKey, data, this.iv, this.algorithmName))
    }
}
