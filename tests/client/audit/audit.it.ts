import {AuditProvider} from '../../../src/client/audit/audit.js'
import {AuditMetadata, AuditTypeEnum, AuditTypeEnumSchema, generateUuid, LanguageCodeEnum, ProviderOption, ServiceCodeEnum, UserProvider} from "../../../src";
import {
  createIdentity, decryptBlockAddress,
  IdentityCodeEnum,
  IdentityMetadata,
  NetworkTypeEnum,
  SecurityAlgorithm
} from "@yeying-community/yeying-web3";
import {getProviderProxy} from "../common/common";
import {convertAuditMetadataFrom, passedStatus, rejectStatus} from "../../../src/model/audit.js";
import { enumToJson } from '@bufbuild/protobuf';
import { convertAuditStatusToJson } from '../../../src/client/model/model.js';

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
let sourceDid: string = 'did:ethr:0x7e4:0x02fc1cd27d963449cc5c6251f0bb8659af0565cd2e75d17b38cafb32bd978fa96g'
let targetDid: string = 'did:ethr:0x7e4:0x02fc1cd27d963449cc5c6251f0bb8659af0565cd2e75d17b38cafb32bd978fa96h'

const sourceName: string = 'jack'
const targetName: string = 'tom'

beforeAll(async () => {
  const password = "123456"
  const serviceIdentity = await createIdentity(applicationTemplate, password)
  const identityMetadata = serviceIdentity.metadata as IdentityMetadata
  targetDid = identityMetadata.did
  sourceDid  = identityMetadata.did
  auditMetadata = convertAuditMetadataFrom(appName, sourceDid, sourceName, targetDid, targetName)
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
        appName: auditMetadata?.appName,
        sourceDid: auditMetadata?.sourceDid,
        sourceName: auditMetadata?.sourceName,
        targetDid: auditMetadata?.targetDid,
        targetName: auditMetadata?.targetName,
        reason: auditMetadata?.reason,
        status: convertAuditStatusToJson(auditMetadata?.status),
        createdAt: auditMetadata?.createdAt,
        updatedAt: auditMetadata?.updatedAt,
        type: enumToJson(AuditTypeEnumSchema, auditMetadata ? auditMetadata.type : AuditTypeEnum.AUDIT_TYPE_UNKNOWN)
    })
    console.log(`Success to create audit=${JSON.stringify(res)}`)
    uid = res.body?.meta?.uid
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

  it('auditPassed', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    console.log(`targetDid=${targetDid}`)
    console.log(`status=${JSON.stringify(passedStatus)}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.audit(uid, "passed")
    console.log(`Success to audit auditPassed=${JSON.stringify(res)}`)
  })

  it('auditReject', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    console.log(`status=${JSON.stringify(rejectStatus)}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.audit(uid, "reject")
    console.log(`Success to audit rejectStatus=${JSON.stringify(res)}`)
  })

  it('createAuditList', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`sourceDid=${sourceDid}`)
    const res = await auditProvider.createAuditList(1, 10)
    console.log(`Success to res=${JSON.stringify(res)}`)
  })

  it('auditList', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`targetDid=${targetDid}`)
    const res = await auditProvider.auditList(1, 10)
    console.log(`Success to res=${JSON.stringify(res)}`)
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

  it('unbind', async () => {
    console.log(providerOption?.blockAddress)
    console.log(providerOption?.proxy)
    const auditProvider = new AuditProvider(providerOption as ProviderOption)
    console.log(`uid=${uid}`)
    if (!uid) {
      throw Error("uid is null")
    }
    const res = await auditProvider.unbind(uid)
    console.log(`Success to unbind=${JSON.stringify(res)}`)
  })
})
