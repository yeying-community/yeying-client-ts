import {getIdentity, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {ProviderProvider} from "../../../src/client/llm/provider";
import {toJson} from "@bufbuild/protobuf";
import {
    ProviderCodeEnum,
    ProviderMetadata,
    ProviderMetadataSchema,
    ProviderState,
    ProviderStateSchema
} from "../../../src/yeying/api/llm/provider_pb";
import {UserProvider} from "../../../src";

const provider = {
    uid: "b2975655-c518-49db-9d28-e7afb34dd501",
    code: ProviderCodeEnum.PROVIDER_CODE_OPENAI,
}

const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_AGENT),
    blockAddress: identity.blockAddress,
}

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)
})

describe('Provider', () => {
    it('descriptions', async () => {
        const llmProvider = new ProviderProvider(providerOption)
        const descriptions = await llmProvider.descriptions()
        console.log(`Success to list provider description=${descriptions.length}`)
        assert.isTrue(descriptions.length > 0)
        // for (const description of descriptions) {
        //     console.log(`Success to list provider description=${JSON.stringify(toJson(ProviderDescriptionSchema, description))}`)
        // }
    })

    it('models', async () => {
        const providerProvider = new ProviderProvider(providerOption)
        const models = await providerProvider.models()
        console.log(`Success to list models=${models.length}`)
        assert.isTrue(models.length > 0)
        // for (const model of models) {
        //     console.log(`Success to list models=${JSON.stringify(toJson(ModelMetadataSchema, model))}`)
        // }
    })

    it('add', async () => {
        const providerProvider = new ProviderProvider(providerOption)
        const metadata = await providerProvider.add("test1", provider.code, "", provider.uid)
        console.log(`Success to add provider=${JSON.stringify(toJson(ProviderMetadataSchema, metadata))}`)
        assert.isDefined(metadata)
    })

    it('detail', async () => {
        const providerProvider = new ProviderProvider(providerOption)
        const detail = await providerProvider.detail(provider.uid)
        console.log(`Success to get provider detail, provider=${JSON.stringify(toJson(ProviderMetadataSchema, detail.provider as ProviderMetadata))}`)
        console.log(`Success to get provider detail, state=${JSON.stringify(toJson(ProviderStateSchema, detail.state as ProviderState))}`)
        assert.isDefined(detail)
    })

    it('search', async () => {
        const providerProvider = new ProviderProvider(providerOption)
        const providers = await providerProvider.search(1, 10, provider.code)
        for (const provider of providers) {
            console.log(`Success to list provider=${JSON.stringify(toJson(ProviderMetadataSchema, provider))}`)
        }

        assert.isAtLeast(providers.length, 1)
    })

    it('delete', async () => {
        const providerProvider = new ProviderProvider(providerOption)
        await providerProvider.delete(provider.uid)
        console.log(`Success to delete provider=${provider.uid}`)
    })
})
