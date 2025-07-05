import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {getIdentity, getNamespace, getProviderProxy} from "../common/common";
import {AssetProvider} from "../../../src/client/warehouse/asset";
import {UserProvider} from "../../../src/client/user/user";
import {Uploader} from "../../../src/client/warehouse/uploader";
import {Downloader} from "../../../src/client/warehouse/downloader";
import {readFile, ResultDataType} from "../../../src/common/file";
import {AssetMetadataSchema, SearchAssetConditionJson} from "../../../src/yeying/api/asset/asset_pb";
import {ProviderOption} from "../../../src/client/common/model";
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
        const metadata = await uploader.createAssetMetadataJson(namespace.uid, file, true)
        try {
            const asset = await uploader.upload(file, metadata, r => {
                console.log(`upload block=${JSON.stringify(r.block)}`)
            })
            assert.isDefined(asset)
            console.log(`Success to put asset, hash=${asset.hash}, chunk count=${asset.chunks?.length}`)
        } catch (err) {
            console.error('Fail to upload', err)
            assert.isTrue(false)
        }
    })

    it('search', async () => {
        const assetProvider = new AssetProvider(providerOption)
        const assets = await assetProvider.search(1, 10, {
            format: "DIGITAL_FORMAT_OTHER",
        } as SearchAssetConditionJson)

        console.log(`Success to search assets=${assets.length}`)
        assets.forEach(a => {
            console.log(`asset=${JSON.stringify(toJson(AssetMetadataSchema, a))}`)
        })
    })

    it('download', async () => {
        const downloader = new Downloader(providerOption, identity.securityConfig.algorithm)

        const dataList: Uint8Array[] = []
        const asset = await downloader.assetProvider.detail(namespace.uid, hash)
        await downloader.download(asset, r => {
            console.log(`download block=${JSON.stringify(r.block)}`)
            dataList.push(r.data)
        })

        console.log(`download asset completely, asset=${JSON.stringify(asset)}`)
        const data = new Blob(dataList, {type: 'application/octet-stream'})
        const text = await readFile(data, ResultDataType.Text)
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