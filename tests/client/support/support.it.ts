import {SupportProvider} from "../../../src/client/support/support";
import {getIdentity, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {FaqMetadataSchema} from "../../../src/yeying/api/support/support_pb";
import {toJson} from "@bufbuild/protobuf";
import {UserProvider} from "../../../src";

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_NODE),
    blockAddress: identity.blockAddress,
}

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)
})

describe('Support', () => {
    it('faq', async () => {
        const supportProvider = new SupportProvider(providerOption)
        const faq = await supportProvider.collectFaq("feature", 'test@gmail.com', "for test.")
        console.log(`Success to collect faq=${JSON.stringify(toJson(FaqMetadataSchema, faq))}`)
    })
})