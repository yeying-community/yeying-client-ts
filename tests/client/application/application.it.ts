import {ApplicationProvider} from '../../../src/client/application/application.js'
import {ApplicationCodeEnum, ApplicationCodeEnumSchema, LanguageCodeEnum, ProviderOption, ServiceCodeEnum, ServiceCodeEnumSchema, UserProvider} from "../../../src";
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
import { enumToJson } from '@bufbuild/protobuf';

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
    const res = await applicationProvider.create({
      owner: applicationMetadata?.owner,
      network: applicationMetadata?.network,
      address: applicationMetadata?.address,
      did: applicationMetadata?.did,
      version: applicationMetadata?.version,
      hash: applicationMetadata?.hash,
      name: applicationMetadata?.name,
      code: enumToJson(ApplicationCodeEnumSchema, applicationMetadata ? applicationMetadata?.code: ApplicationCodeEnum.APPLICATION_CODE_UNKNOWN),
      description: applicationMetadata?.description,
      location: applicationMetadata?.location,
      serviceCodes: applicationMetadata?.serviceCodes.map(item => enumToJson(ServiceCodeEnumSchema, item)),
      avatar: applicationMetadata?.avatar,
      createdAt: applicationMetadata?.createdAt,
      updatedAt: applicationMetadata?.updatedAt,
      signature: applicationMetadata?.signature,
      codePackagePath: applicationMetadata?.codePackagePath
    })
    console.log(`Success to create application=${res.did}`)
    mockDid = res.did
    mockVersion = res.version
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
    console.log(`Success to detail application=${res}`)
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('search', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const res = await applicationProvider.search(1, 10)
    console.log(`res=${JSON.stringify(res)}`)
    assert.isDefined(res.list)
    console.log(`Success to search application with count=${res.list.length}`)
    const len = res.list.length
    assert.isAtLeast(len == undefined ? 0 : len, 1)
    res.list.map(i => console.log(`application, name=${i.name}, code=${i.code}`))
    console.log(`res=${JSON.stringify(res)}`)
  })

  it('delete', async () => {
    const applicationProvider = new ApplicationProvider(providerOption as ProviderOption)
    const application = applicationMetadata as ApplicationMetadata
    console.log(`application=${JSON.stringify(application)}`)
    const res = await applicationProvider.delete(application.did, application.version)
    console.log(`res=${res}`)
    console.log(`Success to delete application=${application.did}, version=${application.version}`)
    console.log(`res=${JSON.stringify(res)}`)
  })
})