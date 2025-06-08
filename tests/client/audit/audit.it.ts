import {AuditProvider} from '../../../src/client/audit/audit.js'
import {AuditMetadata, LanguageCodeEnum, ProviderOption, ServiceCodeEnum, UserProvider} from "../../../src";
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

let auditMetadata: AuditMetadata | undefined

beforeAll(async () => {
  const password = "123456"
  const serviceIdentity = await createIdentity(applicationTemplate, password)
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

let mockSourceDid: string = ""
let mockTargetDid: string = ""
let uid: string = ""

describe('Audit', () => {
  it('create', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    const auditMeta = await auditProvider.create(auditMetadata as AuditMetadata)
    console.log(`Success to create audit=${JSON.stringify(auditMeta)}`)
    mockSourceDid = auditMeta.sourceDid
    mockTargetDid = auditMeta.targetDid
    uid = auditMeta.uid
  })

  it('detail', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const mockApplication = applicationMetadata as ApplicationMetadata
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    const application = await applicationProvider.detail(mockDid, mockVersion)
    console.log(`Success to detail application=${application}`)
  })

  it('audit', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    const appState = await applicationProvider.audit(mockDid, mockVersion, true, 'mock')
    console.log(`Success to audit application=${appState}`)
  })

  it('online', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    const appState = await applicationProvider.online(mockDid, mockVersion)
    console.log(`Success to online application=${appState}`)
  })

  it('offline', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    console.log(`mockDid=${mockDid}`)
    console.log(`mockVersion=${mockVersion}`)
    const appState = await applicationProvider.offline(mockDid, mockVersion)
    console.log(`Success to offline application=${appState}`)
  })

  it('search', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const applications = await applicationProvider.search( 1, 10)
    console.log(`Success to search application with count=${applications.length}`)
    assert.isAtLeast(applications.length, 1)
    applications.map(i => console.log(`application, name=${i.name}, code=${i.code}`))
  })

  it('delete', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const application = applicationMetadata as ApplicationMetadata
    await applicationProvider.delete(application.did, application.version)
    console.log(`Success to delete application=${application.did}, version=${application.version}`)
  })
})