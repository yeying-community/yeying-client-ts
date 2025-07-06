import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {createTestFile, getIdentity, getNamespace, getProviderProxy} from "../common/common";
import {AssetProvider} from "../../../src/client/warehouse/asset";
import {Uploader} from "../../../src/client/warehouse/uploader";
import {AssetMetadataJson} from "../../../src/yeying/api/asset/asset_pb";
import {ProviderOption, UserProvider} from "../../../src";
import {NamespaceProvider} from "../../../src/client/warehouse/namespace";
import {RecycleProvider} from "../../../src/client/warehouse/recycle";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}
const namespace = getNamespace()

let file: File = createTestFile("recycle.txt", 1024 * 1024 + 1)

let asset: AssetMetadataJson | undefined

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)

    const namespaceProvider = new NamespaceProvider(providerOption)
    await namespaceProvider.create(namespace.name, "", namespace.uid)

    const uploader: Uploader = new Uploader(providerOption, identity.securityConfig.algorithm)
    const metadata = await uploader.createAssetMetadataJson(namespace.uid, file, false)
    asset = await uploader.upload(file, metadata)

    const assetProvider = new AssetProvider(providerOption)
    await assetProvider.delete(asset.namespaceId as string, asset.hash as string)
});

describe('Recycle', () => {
    it('search from trash', async () => {
        const recycleProvider = new RecycleProvider(providerOption)
        const deletedAssets = await recycleProvider.search(1, 10, {
            format: "DIGITAL_FORMAT_TEXT",
            namespaceId: asset?.namespaceId as string,
        })
        console.log(`Success to search deleted assets=${deletedAssets.length} from trash`)
        deletedAssets.forEach(a => {
            console.log(`deleted asset=${JSON.stringify(a)}`)
        })
    })

    it('recover from trash', async () => {
        const recycleProvider = new RecycleProvider(providerOption)
        await recycleProvider.recover(asset?.namespaceId as string, asset?.hash as string)
        console.log(`Success to recover from trash, namespaceId=${asset?.namespaceId}, hash=${asset?.hash}`)
    })

    it('remove from trash', async () => {
        const assetProvider = new AssetProvider(providerOption)
        await assetProvider.delete(asset?.namespaceId as string, asset?.hash as string)

        const recycleProvider = new RecycleProvider(providerOption)
        await recycleProvider.remove(asset?.namespaceId as string, asset?.hash as string)
        console.log(`Success to remove from trash, namespaceId=${asset?.namespaceId}, hash=${asset?.hash}`)
    })
})