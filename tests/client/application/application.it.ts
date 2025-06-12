import {ApplicationProvider} from '../../../src/client/application/application.js'
import {LanguageCodeEnum, ProviderOption, ServiceCodeEnum, UserProvider} from "../../../src";
import {
  createIdentity, decryptBlockAddress,
  IdentityCodeEnum,
  IdentityMetadata,
  NetworkTypeEnum,
  SecurityAlgorithm
} from "@yeying-community/yeying-web3";
import {ApplicationMetadata} from "../../../src/yeying/api/common/model_pb";
import {getProviderProxy} from "../common/common";
import {convertApplicationMetadataFromIdentity} from "../../../src/model/model";

let providerOption: ProviderOption | undefined

const applicationTemplate = {
  language: LanguageCodeEnum[LanguageCodeEnum.LANGUAGE_CODE_ZH_CH],
  parent: "",
  network: NetworkTypeEnum.NETWORK_TYPE_YEYING,
  name: "market",
  avatar: "",
  description: "The market to access web3 from the YeYing community.",
  code: IdentityCodeEnum.IDENTITY_CODE_APPLICATION,
  extend: {
    code: "APPLICATION_CODE_MARKET",
    serviceCodes: "SERVICE_CODE_NODE,SERVICE_CODE_AGENT,SERVICE_CODE_WAREHOUSE",
    location: "/",
    path: "",
    hash: ""
  }
}

let applicationMetadata: ApplicationMetadata | undefined

beforeAll(async () => {
  const password = "123456"
  const serviceIdentity = await createIdentity(applicationTemplate, password)
  applicationMetadata = convertApplicationMetadataFromIdentity(serviceIdentity)

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
})

let mockDid: string|null|undefined = ""
let mockVersion: number|null|undefined = 0

describe('Application', () => {
  it('create', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const res = await applicationProvider.create(applicationMetadata as ApplicationMetadata)
    console.log(`Success to create application=${res.application?.did}`)
    mockDid = res.application?.did
    mockVersion = res.application?.version
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('detail', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const mockApplication = applicationMetadata as ApplicationMetadata
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    if (mockDid == undefined || mockVersion == undefined) {
      throw Error("mockDid is undefined or mockVersion is undefined")
    }
    const res = await applicationProvider.detail(mockDid, mockVersion)
    console.log(`Success to detail application=${res.application}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('audit', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    if (mockDid == undefined || mockVersion == undefined) {
      throw Error("mockDid is undefined or mockVersion is undefined")
    }
    const res = await applicationProvider.audit(mockDid, mockVersion, true, 'mock')
    console.log(`Success to audit application=${res.status}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('online', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    if (mockDid == undefined || mockVersion == undefined) {
      throw Error("mockDid is undefined or mockVersion is undefined")
    }
    const res = await applicationProvider.online(mockDid, mockVersion)
    console.log(`Success to online application=${res.status}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('offline', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    if (mockDid == undefined || mockVersion == undefined) {
      throw Error("mockDid is undefined or mockVersion is undefined")
    }
    const res = await applicationProvider.offline(mockDid, mockVersion)
    console.log(`Success to offline application=${res.status}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('search', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const res = await applicationProvider.search( 1, 10)
    console.log(`Success to search application with count=${res.applications.length}`)
    assert.isAtLeast(res.applications.length, 1)
    res.applications.map(i => console.log(`application, name=${i.name}, code=${i.code}`))
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('delete', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const application = applicationMetadata as ApplicationMetadata
    const res = await applicationProvider.delete(application.did, application.version)
    console.log(`res=${res.status}`)
    console.log(`Success to delete application=${application.did}, version=${application.version}`)
    console.log(`res=${JSON.stringify(res)}`)
  })
})