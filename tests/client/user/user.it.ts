import {UserProvider} from '../../../src/client/user/user'
import {getProviderProxy} from "../common/common";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {ProviderOption} from "../../../src/client/common/model";
import {toJson} from "@bufbuild/protobuf";
import {UserDetailSchema, UserMetadata, UserMetadataSchema,} from "../../../src/yeying/api/user/user_pb";

const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_AGENT),
    blockAddress: {
        "identifier": "did:ethr:0x07e4:0x020857ce40b7f57cb8834e56f9076aa4c322437158195b7ea520e19e4d78dd55a9",
        "address": "0x464a4037A6eB22403721243466FAB30990ccdd22",
        "privateKey": "0xfc91385ea0275307e6879f3d135bcc6799c3aa480e4cb2dc98ea694cfd0f1015",
        "publicKey": "0x020857ce40b7f57cb8834e56f9076aa4c322437158195b7ea520e19e4d78dd55a9",
        "mnemonic": {
            "phrase": "hand apple spike inside combine adult accident talent story measure long guess",
            "path": "m/44'/60'/0'/0/0",
            "locale": "en",
            "password": ""
        }
    },
}

describe('User', () => {
    it('delete', async () => {
        const userProvider = new UserProvider(providerOption)
        await userProvider.delete()
    })

    it('add', async () => {
        const userProvider = new UserProvider(providerOption)
        const user = await userProvider.add('test1', "avatar1")
        console.log(`Success to add new user=${JSON.stringify(toJson(UserMetadataSchema, user))}`)
    })

    it('detail', async () => {
        const userProvider = new UserProvider(providerOption)
        const detail = await userProvider.detail()
        console.log(`Success to get user=${JSON.stringify(toJson(UserDetailSchema, detail))}`)
    })

    it('update', async () => {
        const userProvider = new UserProvider(providerOption)
        const detail = await userProvider.detail()
        const user1 = detail.user as UserMetadata

        user1.name = "test2"
        const user2 = await userProvider.update(user1)

        console.log(`Success to update user=${JSON.stringify(toJson(UserMetadataSchema, user2))}`)
        assert.equal(user2.name, user1.name)
    })
})