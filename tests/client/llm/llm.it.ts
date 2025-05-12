import {getIdentity, getProvider, getProviderProxy, getSession} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {LlmProvider} from "../../../src/client/llm/llm";
import {ProviderProvider, SessionProvider, UserProvider} from "../../../src";
import {ContentSchema, ContentTypeEnum} from "../../../src/yeying/api/llm/llm_pb";
import {create} from "@bufbuild/protobuf";

const identity = getIdentity();
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_AGENT),
    blockAddress: identity.blockAddress,
}

const provider = getProvider()
const session = getSession()

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)

    const sessionProvider = new SessionProvider(providerOption)
    await sessionProvider.create(session.name, undefined, undefined, session.uid)

    const providerProvider = new ProviderProvider(providerOption)
    await providerProvider.add(provider.name, provider.code, provider.key, provider.uid)
});

describe('Llm', () => {
    it('complete', {timeout: 300000}, async () => {
        const llmProvider = new LlmProvider(providerOption)
        const contents = [
            create(ContentSchema, {type: ContentTypeEnum.CONTENT_TYPE_TEXT, data: "how to make money for programmer"})
        ]

        const model = ""
        const generator = llmProvider.complete(session.uid, contents , model, provider.uid)
        for await (const s of generator) {
            console.log(`Recv text=${s}`);
        }
    })
})
