import {getIdentity} from "../common/common";
import {decodeString, encodeHex, encodeString, generateIv, SecurityAlgorithm} from "@yeying-community/yeying-web3";
import {convertToAlgorithmName} from "../../../src/common/common";
import {CipherTypeEnum} from "../../../src";
import {AssetCipher} from "../../../src/client/warehouse/cipher";

describe('Cipher', () => {
    it('encrypt and decrypt', async () => {
        const identity = getIdentity()
        
        const securityAlgorithm = SecurityAlgorithm.create({
            name: convertToAlgorithmName(CipherTypeEnum.CIPHER_TYPE_AES_GCM_256),
            iv: encodeHex(generateIv())
        })

        const message = "hello yeying community!"
        const assetCipher = new AssetCipher(identity.blockAddress, securityAlgorithm)
        const cipher = await assetCipher.encrypt(encodeString(message))
        const plain = await assetCipher.decrypt(cipher)
        assert.equal(decodeString(plain), message)
    })
})