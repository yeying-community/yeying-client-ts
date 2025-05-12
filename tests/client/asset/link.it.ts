import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {createTestFile, getIdentity, getNamespace, getProviderProxy} from "../common/common";


import {NamespaceProvider} from "../../../src/client/warehouse/namespace";
import {LinkProvider} from "../../../src/client/warehouse/link";
import {
    LinkMetadata,
    LinkMetadataSchema,
    LinkTypeEnum,
    UrlMetadata, UrlMetadataSchema,
    VisitorMetadataSchema
} from "../../../src/yeying/api/asset/link_pb";
import {toJson} from "@bufbuild/protobuf";
import {AssetMetadata, ProviderOption, Uploader, UserProvider} from "../../../src";

const namespace = getNamespace()
const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}

const file: File = createTestFile("link.txt", 1024 * 1024 + 10)
let asset: AssetMetadata | undefined = undefined


beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)

    const namespaceProvider = new NamespaceProvider(providerOption)
    await namespaceProvider.create(namespace.name, "", namespace.uid)
    const uploader = new Uploader(providerOption, identity.securityConfig.algorithm)
    asset = await uploader.upload(namespace.uid, file, false)
});

afterAll(() => {

})

describe('Link', () => {
    it('create', async () => {
        const a = asset as AssetMetadata
        const linkProvider = new LinkProvider(providerOption)
        console.log(`Try to create link for asset=${a.hash}`)
        const detail = await linkProvider.create(
            a.namespaceId,
            a.name,
            a.hash,
            24 * 3600,
            LinkTypeEnum.LINK_TYPE_PUBLIC)
        assert.isDefined(detail)
        console.log(`Success to get link=${JSON.stringify(toJson(LinkMetadataSchema, detail.link as LinkMetadata))}`)
        console.log(`Success to get url=${JSON.stringify(toJson(UrlMetadataSchema, detail.url as UrlMetadata))}`)
    })

    it('search', async () => {
        const linkProvider = new LinkProvider(providerOption)
        const links = await linkProvider.search()
        assert.isAtLeast(links.length, 1)
    })

    it('detail', async () => {
        const linkProvider = new LinkProvider(providerOption)
        const links = await linkProvider.search(1, 10, {hash: asset?.hash})
        assert.isAtLeast(links.length, 1)
        const detail = await linkProvider.detail(links[0].uid)
        console.log(`Success to get link=${JSON.stringify(toJson(LinkMetadataSchema, detail.link as LinkMetadata))}`)
        console.log(`Success to get url=${JSON.stringify(toJson(UrlMetadataSchema, detail.url as UrlMetadata))}`)
    })

    it('disable', async () => {
        const linkProvider = new LinkProvider(providerOption)
        const links = await linkProvider.search(1, 10, {hash: asset?.hash})
        assert.isAtLeast(links.length, 1)
        await linkProvider.disable(links[0].uid)
        console.log(`Success to disable url=${links[0].uid}`)
    })

    it('visitor', async () => {
        const linkProvider = new LinkProvider(providerOption)
        const links = await linkProvider.search(1, 10, {hash: asset?.hash})
        assert.isAtLeast(links.length, 1)

        const visitors = await linkProvider.visitors(links[0].uid)
        for (const visitor of visitors) {
            console.log(`Success to get visitor=${JSON.stringify(toJson(VisitorMetadataSchema, visitor))}`)
        }
    })
})