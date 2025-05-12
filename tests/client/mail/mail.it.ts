import {getBlockAddress, getProviderProxy} from "../common/common";
import {ProviderOption} from "../../../src/client/common/model";
import {ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {MailProvider} from "../../../src/client/mail/mail";

const provider: ProviderOption = {
    proxy: getProviderProxy(ServiceCodeEnum.SERVICE_CODE_NODE),
    blockAddress: getBlockAddress(),
}

describe('Mail', () => {
    it('send', async () => {
        const mailProvider = new MailProvider(provider)
        await mailProvider.send("mock@mail.com")
        console.log(`Success to send email`)
    })

    it('verify', async () => {
        const mailProvider = new MailProvider(provider)
        const toMail = "mock@mail.com"
        console.log("start verify email:", toMail)
        await mailProvider.verify(toMail, "mockCode")
    })
})
