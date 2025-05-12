import {DigitalFormatEnum, ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {createTestFile, getIdentity, getNamespace, getProviderProxy} from "../common/common";
import {AssetProvider} from "../../../src/client/warehouse/asset";
import {Uploader} from "../../../src/client/warehouse/uploader";
import {SearchAssetCondition} from "../../../src/yeying/api/asset/asset_pb";
import {ProviderOption, UserProvider} from "../../../src";
import {toJson} from "@bufbuild/protobuf";
import {NamespaceProvider} from "../../../src/client/warehouse/namespace";
import {RecycleProvider} from "../../../src/client/warehouse/recycle";
import {DeletedAssetMetadataSchema} from "../../../src/yeying/api/asset/recycle_pb";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}
const namespace = getNamespace()

let file: File = createTestFile("recycle.txt", 1024 * 1024 + 1)

// @ts-ignore
let asset: AssetMetadata = undefined

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)

    const namespaceProvider = new NamespaceProvider(providerOption)
    await namespaceProvider.create(namespace.name, "", namespace.uid)

    const uploader: Uploader = new Uploader(providerOption, identity.securityConfig.algorithm)
    asset = await uploader.upload(namespace.uid, file, false)

    const assetProvider = new AssetProvider(providerOption)
    await assetProvider.delete(asset.namespaceId, asset.hash)
});

describe('Recycle', () => {
    it('search from trash', async () => {
        const recycleProvider = new RecycleProvider(providerOption)
        const condition: Partial<SearchAssetCondition> = {
            format: DigitalFormatEnum.DIGITAL_FORMAT_TEXT,
            namespaceId: asset.namespaceId,
        }

        const deletedAssets = await recycleProvider.search(condition, 1, 10)
        console.log(`Success to search deleted assets=${deletedAssets.length} from trash`)
        deletedAssets.forEach(a => {
            console.log(`deleted asset=${JSON.stringify(toJson(DeletedAssetMetadataSchema, a))}`)
        })
    })

    it('recover from trash', async () => {
        const recycleProvider = new RecycleProvider(providerOption)
        await recycleProvider.recover(asset.namespaceId, asset.hash)
        console.log(`Success to recover from trash, namespaceId=${asset.namespaceId}, hash=${asset.hash}`)
    })

    it('remove from trash', async () => {
        const assetProvider = new AssetProvider(providerOption)
        await assetProvider.delete(asset.namespaceId, asset.hash)

        const recycleProvider = new RecycleProvider(providerOption)
        await recycleProvider.remove(asset.namespaceId, asset.hash)
        console.log(`Success to remove from trash, namespaceId=${asset.namespaceId}, hash=${asset.hash}`)
    })
})