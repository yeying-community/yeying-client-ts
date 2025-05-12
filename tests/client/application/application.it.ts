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

describe('Application', () => {
  it('create', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const application = await applicationProvider.create(applicationMetadata as ApplicationMetadata)
    console.log(`Success to create application=${application.did}`)
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