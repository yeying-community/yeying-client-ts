import {AuditProvider} from '../../../src/client/audit/audit.js'
import {ApplicationMetadata, ApplicationMetadataSchema, AuditMetadata, convertApplicationMetadataFromIdentity, generateUuid, LanguageCodeEnum, ProviderOption, ServiceCodeEnum, UserProvider} from "../../../src";
import {
  createIdentity, decryptBlockAddress,
  IdentityCodeEnum,
  IdentityMetadata,
  NetworkTypeEnum,
  SecurityAlgorithm
} from "@yeying-community/yeying-web3";
import {getProviderProxy} from "../common/common";
import {convertAuditMetadataFrom } from "../../../src/model/audit.js";
import { toJson } from '@bufbuild/protobuf';

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

const appName: string = generateUuid()
let applicant: string = 'did:ethr:0x07e4:0x0244a3b859bbbeeb7f5cfb685843746ab629f0b8d1b0e7ae7a1e8e65ba9aaeddfd::jack'
let approver: string = 'did:ethr:0x07e4:0x0244a3b859bbbeeb7f5cfb685843746ab629f0b8d1b0e7ae7a1e8e65ba9aaeddfd::tom'

let applicationMetadata: ApplicationMetadata | undefined
beforeAll(async () => {
  const password = "123456"
  const serviceIdentity = await createIdentity(applicationTemplate, password)

  applicationMetadata = convertApplicationMetadataFromIdentity(serviceIdentity)

  const identityMetadata = serviceIdentity.metadata as IdentityMetadata
  auditMetadata = convertAuditMetadataFrom(JSON.stringify(toJson(ApplicationMetadataSchema, applicationMetadata as ApplicationMetadata)), applicant, approver)
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

let uid: string|null|undefined = ""

describe('Audit', () => {
  it('create', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    const res = await auditProvider.create({
        uid: auditMetadata?.uid,
        appOrServiceMetadata: auditMetadata?.appOrServiceMetadata,
        applicant: auditMetadata?.applicant,
        approver: auditMetadata?.approver,
        reason: auditMetadata?.reason,
        createdAt: auditMetadata?.createdAt,
        updatedAt: auditMetadata?.updatedAt,
        signature: 'signature'
    })
    console.log(`Success to create audit=${JSON.stringify(res)}`)
    uid = res.uid
  })

  it('detail', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditMeta = auditMetadata as AuditMetadata
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.detail(uid)
    console.log(`Success to detail auditRecord=${JSON.stringify(res)}`)
  })

  it('approve', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.approve({
      auditId: uid,
      text: "通过",
      status: 'COMMENT_STATUS_AGREE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signature: 'signature'
    })
    console.log(`Success to audit auditPassed=${JSON.stringify(res)}`)
  })

  it('reject', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.reject({
      auditId: uid,
      text: "拒绝",
      status: 'COMMENT_STATUS_REJECT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signature: 'signature'
    })
    console.log(`Success to audit rejectStatus=${JSON.stringify(res)}`)
  })

  it('search', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    const res = await auditProvider.search(1, 10, {})
    assert.isDefined(res.list)
    console.log(`Success to audit search=${JSON.stringify(res)}`)
    const len = res.list.length
    assert.isAtLeast(len == undefined ? 0 : len, 1)
  })

  it('cancel', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.cancel(uid)
    console.log(`Success to cancel=${JSON.stringify(res)}`)
  })
})
