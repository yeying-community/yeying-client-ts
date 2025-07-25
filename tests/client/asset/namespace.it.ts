import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {getDefaultNamespace, getIdentity, getProviderProxy} from "../common/common";
import {generateRandomString, generateUuid, ProviderOption, UserProvider} from "../../../src";
import {NamespaceProvider} from "../../../src/client/warehouse/namespace";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}
const testNamespaceId = generateUuid()
const testNamespaceName = generateRandomString(10)

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)
});

afterAll(() => {

})

describe('Namespace', () => {
    it('default namespace', async () => {
        const namespaceProvider = new NamespaceProvider(providerOption)
        const defaultNamespaceId: string = getDefaultNamespace()
        let namespaceId = await namespaceProvider.getDefaultNamespace()
        if (namespaceId) {
            // 已存在默认命名空间
            assert.equal(namespaceId, defaultNamespaceId)
        } else {
            // 创建命名空间
            const namespaceMetadata = await namespaceProvider.create("default", "test", defaultNamespaceId)
            assert.equal(namespaceMetadata.uid, defaultNamespaceId)
            // 设置默认命名空间
            if (namespaceMetadata.uid === undefined) {
                throw Error("uid is undefined")
            }
            await namespaceProvider.setDefaultNamespace(namespaceMetadata.uid)
            // 获得默认命名空间
            namespaceId = await namespaceProvider.getDefaultNamespace()
            assert.equal(namespaceId, defaultNamespaceId)
        }
    })

    it('create namespace', async () => {
        const namespaceProvider = new NamespaceProvider(providerOption)
        // 创建命名空间
        const namespaceMetadata = await namespaceProvider.create(testNamespaceName, "test", testNamespaceId)
        assert.equal(namespaceMetadata.name, testNamespaceName)
    })

    it('namespace detail', async () => {
        const namespaceProvider = new NamespaceProvider(providerOption)
        const namespaceMetadata = await namespaceProvider.detail(testNamespaceId)
        assert.equal(namespaceMetadata.name, testNamespaceName)
    })

    it('delete namespace', async () => {
        const namespaceProvider = new NamespaceProvider(providerOption)
        await namespaceProvider.delete(testNamespaceId)
    })
})