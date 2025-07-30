import { getProviderProxy } from '../common/common'
import { LanguageCodeEnum, ServiceCodeEnum } from '../../../src/yeying/api/common/code_pb'
import { UserProvider } from '../../../src/client/user/user'
import { createIdentity, decryptBlockAddress, Identity, IdentityCodeEnum, IdentityMetadata, NetworkTypeEnum, SecurityAlgorithm } from '@yeying-community/yeying-web3'
import { ProviderOption } from '../../../src/client/common/model'
import { TaskProvider } from '../../../src/client/correction/task'
import { v4 as uuidv4 } from 'uuid';
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
    serviceCodes: "SERVICE_CODE_NODE,SERVICE_CODE_AGENT,SERVICE_CODE_WAREHOUSE,SERVICE_CODE_CORRECTION",
    location: "/",
    path: "",
    hash: ""
  }
}

function convertArchiveMetadataDidFromIdentity(identity: Identity) {
    const metadata = identity.metadata
    if (metadata === undefined) {
        throw new Error('invalid identity metadata!')
    }

    if (metadata.code !== IdentityCodeEnum.IDENTITY_CODE_APPLICATION) {
        throw new Error(`invalid identity code=${IdentityCodeEnum[metadata.code]}`)
    }

    const extend = identity.applicationExtend
    if (extend === undefined) {
        throw new Error('invalid identity extend!')
    }
    return metadata.did
}

let did: string | undefined

beforeAll(async () => {
  const password = "123456"
  const serviceIdentity = await createIdentity(applicationTemplate, password)
  did = convertArchiveMetadataDidFromIdentity(serviceIdentity)

  const identityMetadata = serviceIdentity.metadata as IdentityMetadata
  const blockAddress = await decryptBlockAddress(
      serviceIdentity.blockAddress,
      serviceIdentity.securityConfig?.algorithm as SecurityAlgorithm,
      password
  )

  providerOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_CORRECTION),
    blockAddress: blockAddress,
  }
})

let uid: string | undefined = ""
let tagUid: string = ""
describe('Task', () => {
    it('add', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskProvider = new TaskProvider(providerOption)
        tagUid = uuidv4()
        const meta = await taskProvider.add({
            name: "task_" + Date.now(),
            description: "test data",
            tagUid: tagUid,
            did: "did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c",
            studentDidList: "[\"did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c\"]"
        })
        uid = meta.uid
        console.log(`Success to add task meta=${JSON.stringify(meta)}`)
    })
    it('detail', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskProvider = new TaskProvider(providerOption)
        assert.isDefined(uid)
        const meta = await taskProvider.detail(uid)
        console.log(meta)
        assert.isDefined(meta)
        console.log(`Success to detail task meta=${JSON.stringify(meta)}`)
    })
    it('list', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskProvider = new TaskProvider(providerOption)
        const res = await taskProvider.list(1, 10, {did:"did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c"})
        const metaList = res.list
        console.log(JSON.stringify(metaList))
    })
    it('update', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskProvider = new TaskProvider(providerOption)
        const meta = await taskProvider.update({
            uid: uid,
            name: "task_" + Date.now(),
            description: "test data",
            tagUid: tagUid,
            did: "1cad3b2d-b803-4e37-9c0b-2ff64ae2063d",
            isDeleted: true
        })
        console.log(JSON.stringify(meta))
    })
})
