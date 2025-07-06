import {getIdentity, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {NodeProvider} from "../../../src/client/node/node";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_NODE),
    blockAddress: identity.blockAddress,
}

describe('Node', () => {
    it('whoami', async () => {
        const nodeProvider = new NodeProvider(providerOption)
        const node = await nodeProvider.whoami()
        assert.isDefined(node)
        console.log(`whoami=${JSON.stringify(node, null, 2)}`)
    })

    it('health check', async () => {
        const nodeProvider = new NodeProvider(providerOption)
        await nodeProvider.healthCheck()
    })
})