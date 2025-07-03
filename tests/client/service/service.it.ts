import {getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ApiCodeEnumSchema, LanguageCodeEnum, ServiceCodeEnum, ServiceCodeEnumSchema} from "../../../src/yeying/api/common/code_pb";
import {ServiceProvider} from "../../../src/client/service/service";
import {UserProvider} from "../../../src/client/user/user";
import {enumToJson, toJson} from "@bufbuild/protobuf";
import {
    createIdentity, decryptBlockAddress,
    IdentityCodeEnum,
    IdentityMetadata,
    NetworkTypeEnum,
    SecurityAlgorithm
} from "@yeying-community/yeying-web3";
import {ServiceMetadata, ServiceMetadataSchema} from "../../../src/yeying/api/common/model_pb";
import {signServiceMetadata} from "../../../src/client/model/model";
import {Authenticate} from "../../../src/client/common/authenticate";
import {convertServiceMetadataFromIdentity} from "../../../src/model/model";

let providerOption: ProviderOption | undefined

const serviceTemplate = {
    language: LanguageCodeEnum[LanguageCodeEnum.LANGUAGE_CODE_ZH_CH],
    parent: "",
    network: NetworkTypeEnum.NETWORK_TYPE_YEYING,
    name: "mcp",
    description: "The network mcp service of YeYing community.",
    code: IdentityCodeEnum.IDENTITY_CODE_SERVICE,
    avatar: "",
    extend: {
        "code": "SERVICE_CODE_MCP",
        "proxy": "http://localhost:8741",
        "grpc": "localhost:9401",
        "apiCodes": "API_CODE_USER,API_CODE_LLM_SERVICE"
    }
}

let serviceMetadata: ServiceMetadata | undefined

beforeAll(async () => {
    const password = "123456"
    const serviceIdentity = await createIdentity(serviceTemplate, password)
    serviceMetadata = convertServiceMetadataFromIdentity(serviceIdentity)

    const identityMetadata = serviceIdentity.metadata as IdentityMetadata
    const blockAddress = await decryptBlockAddress(
        serviceIdentity.blockAddress,
        serviceIdentity.securityConfig?.algorithm as SecurityAlgorithm,
        password
    )

    providerOption = {
        proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_NODE),
        blockAddress: blockAddress,
    }

    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identityMetadata.name, identityMetadata.avatar)

    await signServiceMetadata(new Authenticate(blockAddress), serviceMetadata)
})

let mockDId: string = ""
let mockVersion: number = 0
describe('Service', () => {
    it('create', async () => {
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        const res = await serviceProvider.create({
              owner: serviceMetadata?.owner,
              network: serviceMetadata?.network,
              address: serviceMetadata?.address,
              did: serviceMetadata?.did,
              version: serviceMetadata?.version,
              name: serviceMetadata?.name,
              description: serviceMetadata?.description,
              code: enumToJson(ServiceCodeEnumSchema, serviceMetadata ? serviceMetadata?.code: ServiceCodeEnum.SERVICE_CODE_UNKNOWN),
              apiCodes: serviceMetadata?.apiCodes.map(item => enumToJson(ApiCodeEnumSchema, item)),
              proxy: serviceMetadata?.proxy,
              grpc: serviceMetadata?.grpc,
              avatar: serviceMetadata?.avatar,
              createdAt: serviceMetadata?.createdAt,
              updatedAt: serviceMetadata?.updatedAt,
              signature: serviceMetadata?.signature,
              codePackagePath: serviceMetadata?.codePackagePath
              }
        )
        const service = res.body?.service
        assert.isDefined(service)
        mockDId = service.did
        mockVersion = service.version
        console.log(`Success to create identity=${JSON.stringify(toJson(ServiceMetadataSchema, service))}`)
        console.log(`res=${JSON.stringify(res)}`)
    })

    it('detail', async () => {
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        console.log(`did=${mockDId}`)
        console.log(`version=${mockVersion}`)
        const res = await serviceProvider.detail(mockDId, mockVersion)
        const service = res.body?.service
        assert.isDefined(service)
        console.log(`Success to detail identity=${JSON.stringify(toJson(ServiceMetadataSchema, service))}`)
        console.log(`res=${JSON.stringify(res)}`)
    })

    it('search', async () => {
        const service = serviceMetadata as ServiceMetadata
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        const res = await serviceProvider.search(1, 10, {keyword: "de"})
        console.log(`search res=${JSON.stringify(res)}`)
        const services = res.body?.services
        assert.isDefined(services)
        assert.isTrue(services.length > 0)
        const len = res.body?.services?.length
        assert.isAtLeast(len == undefined ? 0 : len, 1)
        res.body?.services.map(i => console.log(`service, name=${i.name}, code=${i.code}`))
        console.log(`res=${JSON.stringify(res)}`)
    })

    it('online', async () => {
        const service = serviceMetadata as ServiceMetadata
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        const res = await serviceProvider.online(service.did, service.version)
        console.log(`res=${JSON.stringify(res)}`)
        console.log(`Success to online service did=${service.did} r=${service.version}`)
    })

    it('offline', async () => {
        const service = serviceMetadata as ServiceMetadata
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        const res = await serviceProvider.offline(service.did, service.version)
        console.log(`res=${JSON.stringify(res)}`)
        console.log(`Success to offline service did=${service.did} r=${service.version}`)
    })

    it('delete', async () => {
        const service = serviceMetadata as ServiceMetadata
        const serviceProvider = new ServiceProvider(providerOption as ProviderOption)
        const res = await serviceProvider.delete(service.did, service.version)
        console.log(`res=${JSON.stringify(res)}`)
        console.log(`Success to delete service did=${service.did} r=${service.version}`)
    })
})