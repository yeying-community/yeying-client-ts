import {DigitalFormatEnum, ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {getIdentity, getNamespace, getProviderProxy} from "../common/common";
import {AssetProvider} from "../../../src/client/warehouse/asset";
import {Uploader} from "../../../src/client/warehouse/uploader";
import {Downloader} from "../../../src/client/warehouse/downloader";
import {readFile, ResultDataType} from "../../../src/common/file";
import {AssetMetadataSchema} from "../../../src/yeying/api/asset/asset_pb";
import {ProviderOption, UserProvider} from "../../../src";
import {toJson} from "@bufbuild/protobuf";
import {NamespaceProvider} from "../../../src/client/warehouse/namespace";
import {generateRandomString} from "../../../src/common/string";
import {digest, encodeHex, encodeString} from "@yeying-community/yeying-web3";


const content: string = "hi, yeying community!"
const hash: string = encodeHex(await digest(encodeString(content)))

const identity = getIdentity()
const namespace = getNamespace()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)

    const namespaceProvider = new NamespaceProvider(providerOption)
    await namespaceProvider.create(namespace.name, "", namespace.uid)
})

describe('Asset', () => {
    it('upload', async () => {
        const uploader = new Uploader(providerOption, identity.securityConfig.algorithm)
        const name = 'test'
        const blob = new Blob([content], {type: 'text/plain'})
        const file = new File([blob], name, {type: 'text/plain'})
        try {
            const asset = await uploader.upload(namespace.uid, file, true)
            assert.isDefined(asset)
            console.log(`Success to put asset, hash=${asset.hash}, chunk count=${asset.chunks.length}`)
        } catch (err) {
            console.error('Fail to upload', err)
            assert.isTrue(false)
        }
    })

    it('search', async () => {
        const assetProvider = new AssetProvider(providerOption)
        const assets = await assetProvider.search({
            format: DigitalFormatEnum.DIGITAL_FORMAT_OTHER,
        }, 1, 10)

        console.log(`Success to search assets=${assets.length}`)
        assets.forEach(a => {
            console.log(`asset=${JSON.stringify(toJson(AssetMetadataSchema, a))}`)
        })
    })

    it('download', async () => {
        const downloader = new Downloader(providerOption, identity.securityConfig.algorithm)
        const result = await downloader.download(namespace.uid, hash)
        const text = await readFile(result.data as unknown as Blob, ResultDataType.Text)
        assert.equal(text as string, content)
        console.log(`Success to download asset, hash=${hash}, text=${text}`)
    })

    it('detail', async () => {
        const assetProvider = new AssetProvider(providerOption)
        const asset = await assetProvider.detail(namespace.uid, hash)
        console.log(`Success to get detail, hash=${hash}, version=${asset.version}, asset=${asset}`)
        assert.equal(asset.name, "test")
    })

    it('update', async () => {
        const assetProvider = new AssetProvider(providerOption)
        const newName = generateRandomString(10)
        const asset = await assetProvider.update({namespaceId: namespace.uid, hash: hash, name: newName})
        console.log(`Success to update asset, namespace.uid=${namespace.uid}, hash=${hash}`)
        assert.equal(asset.name, newName)
    })

    it('delete', async () => {
        const assetProvider = new AssetProvider(providerOption)
        await assetProvider.delete(namespace.uid, hash)
        console.log(`Success to delete asset, namespace.uid=${namespace.uid}, hash=${hash}`)
    })
})