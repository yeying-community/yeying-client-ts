import { ProviderOption } from '../../../src/client/common/model';
import { LanguageCodeEnum, ServiceCodeEnum } from '../../../src/yeying/api/common/code_pb';
import { createIdentity, decryptBlockAddress, Identity, IdentityCodeEnum, IdentityMetadata, NetworkTypeEnum, SecurityAlgorithm } from '@yeying-community/yeying-web3';
import { getProviderProxy } from '../common/common';
import { UserProvider } from '../../../src/client/user/user';
import { TaskTagProvider } from '../../../src/client/correction/tasktag';
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

let uid: string = ""
describe('TaskTag', () => {
    it('add', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskTagProvider = new TaskTagProvider(providerOption)
        const meta = await taskTagProvider.add({
            name: "task_tag_" + Date.now(),
            did: "1cad3b2d-b803-4e37-9c0b-2ff64ae2063d",
        })
        console.log(meta)
        assert.isDefined(meta.uid)
        uid = meta.uid
    })
    it('detail', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskTagProvider = new TaskTagProvider(providerOption)
        const meta = await taskTagProvider.detail(uid)
        assert.isDefined(meta)
        console.log(`Success to detail task meta=${meta}`)
    })
    it('list', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskTagProvider = new TaskTagProvider(providerOption)
        const res = await taskTagProvider.list("1cad3b2d-b803-4e37-9c0b-2ff64ae2063d")
        console.log(res.list)
    })
    it('update', async () => {
        console.log(providerOption?.proxy)
        assert.isDefined(providerOption)
        const taskTagProvider = new TaskTagProvider(providerOption)
        const meta = await taskTagProvider.update({
            uid: uid,
            name: "task_tag_" + Date.now(),
            did: "1cad3b2d-b803-4e37-9c0b-2ff64ae2063d",
            isDeleted: true
        })
        console.log(meta)
        assert.isDefined(meta)
    })
})
