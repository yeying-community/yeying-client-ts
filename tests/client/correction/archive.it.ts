import { ProviderOption } from '../../../src/client/common/model'
import {ArchiveProvider} from "../../../src/client/correction/archive"
import { create } from '@bufbuild/protobuf'
import { LanguageCodeEnum, ServiceCodeEnum } from '../../../src/yeying/api/common/code_pb'
import { createIdentity, decryptBlockAddress, Identity, IdentityCodeEnum, IdentityMetadata, NetworkTypeEnum, SecurityAlgorithm } from '@yeying-community/yeying-web3'
import { getProviderProxy } from '../common/common'
import { UserProvider } from '../../../src/client/user/user'
import { ArchiveMetadataSchema } from '../../../src/yeying/api/correction/meta_pb'
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

let studentDid: string | undefined = "did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c"
let teacherDid: string | undefined = "did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c"
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
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_CORRECTION),
    blockAddress: blockAddress,
  }
})

let uid: string | undefined
describe('Archive', () => {
    // 老师调用，添加自己学生的档案
    it('add', async () => {
        console.log(providerOption?.proxy)
        const archiveProvider = new ArchiveProvider(providerOption as ProviderOption)
        const archiveMeta = {
            name: "archive_" + Date.now(),
            studentDid: studentDid,
            teacherDid: teacherDid,
            subject: "数学"
        }
        const meta = await archiveProvider.add(archiveMeta)
        assert.isDefined(meta)
        console.log(meta)
        uid = meta.uid
    })
    // 老师调用,查看单个学生的档案详情
    it('detail', async () => {
        console.log(providerOption?.proxy)
        const archiveProvider = new ArchiveProvider(providerOption as ProviderOption)
        assert.isDefined(uid)
        const meta = await archiveProvider.detail(uid)
        assert.isDefined(meta)
        console.log(meta)
    })
    // 老师调用，查看自己的学生的所有档案列表
    it('list', async () => {
        console.log(providerOption?.proxy)
        const archiveProvider = new ArchiveProvider(providerOption as ProviderOption)
        assert.isDefined(teacherDid)
        const name = "archive"
        const pageIndex = 1
        const pageSize = 10
        const res = await archiveProvider.list(teacherDid, name, pageIndex, pageSize)
        console.log(res.list)
        const len = res.list?.length
        assert.isAtLeast(len == undefined ? 0 : len, 1)
    })


    // 老师调用，修改自己学生的档案
    it('update', async () => {
        console.log(providerOption?.proxy)
        const archiveProvider = new ArchiveProvider(providerOption as ProviderOption)
        assert.isDefined(uid)
        const archiveMeta = create(ArchiveMetadataSchema, {
            uid: uid,
            name: "archive_" + Date.now(),
            subject: "数学"
        })
        const meta = await archiveProvider.update(archiveMeta)
        assert.isDefined(meta)
        console.log(meta)
    })
    // 学生调用，查看自己的档案
    it('detailStudent', async () => {
        console.log(providerOption?.proxy)
        const archiveProvider = new ArchiveProvider(providerOption as ProviderOption)
        assert.isDefined(studentDid)
        const meta = await archiveProvider.detailStudent(studentDid)
        assert.isDefined(meta)
        console.log(meta)
    })
})
