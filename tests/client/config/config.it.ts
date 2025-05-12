import {getIdentity, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {toJson} from "@bufbuild/protobuf";
import {ConfigProvider} from "../../../src/client/config/config";
import {ConfigMetadataSchema, ConfigTypeEnum} from "../../../src/yeying/api/config/config_pb";
import {UserProvider} from "../../../src";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_WAREHOUSE),
    blockAddress: identity.blockAddress,
}

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)
})

describe('Config', () => {
    it('get chunk size', async () => {
        const configProvider = new ConfigProvider(providerOption)
        const metadata = await configProvider.get('chunk.size', ConfigTypeEnum.CONFIG_TYPE_SYSTEM)
        console.log(`Success to get config, page=${JSON.stringify(toJson(ConfigMetadataSchema, metadata))}`)
        assert.equal(metadata.value, "16777216")
    })
})