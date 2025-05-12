import {getIdentity, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {toJson} from "@bufbuild/protobuf";
import {SessionProvider} from "../../../src/client/session/session";
import {SessionMetadata, SessionMetadataSchema} from "../../../src/yeying/api/session/session_pb";
import {UserProvider} from "../../../src";

const sessionId: string = "333422fc-a425-4937-b2d9-5584a9bf6346"
const identity = getIdentity()
const providerOption: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_AGENT),
    blockAddress: identity.blockAddress,
}

beforeAll(async () => {
    const userProvider = new UserProvider(providerOption)
    await userProvider.add(identity.metadata.name, identity.metadata.avatar)
})

describe('Session', () => {
    it('create', async () => {
        const sessionProvider = new SessionProvider(providerOption)
        const session = await sessionProvider.create('test', undefined, undefined, sessionId)
        console.log(`Success to create session=${JSON.stringify(toJson(SessionMetadataSchema, session))}`)
        assert.isDefined(session)
    })

    it('search', async () => {
        const sessionProvider = new SessionProvider(providerOption)
        const sessions = await sessionProvider.search()
        for (const session of sessions) {
            console.log(`Success to search session=${JSON.stringify(toJson(SessionMetadataSchema, session))}`)
        }
        assert.isAtLeast(sessions.length, 1)
    })

    it('detail', async () => {
        const sessionProvider = new SessionProvider(providerOption)
        const detail = await sessionProvider.detail(sessionId)
        console.log(`Success to get session detail, session=${JSON.stringify(toJson(SessionMetadataSchema, detail.session as SessionMetadata))}`)
        assert.isDefined(detail)
    })

    it('update', async () => {
        const sessionProvider = new SessionProvider(providerOption)
        const sessionDetail = await sessionProvider.detail(sessionId)
        assert.isDefined(sessionDetail.session)
        const session1 = sessionDetail.session as SessionMetadata
        session1.name = 'test2'
        const session2 = await sessionProvider.update(session1)
        console.log(`Success to update session=${JSON.stringify(toJson(SessionMetadataSchema, session2))}`)
        assert.equal(session2.name, "test2")
    })

    it('delete', async () => {
        const sessionProvider = new SessionProvider(providerOption)
        await sessionProvider.delete(sessionId)
        console.log(`Success to delete provider=${sessionId}`)
    })
})
