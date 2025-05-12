import {Authenticate} from '../../../src/identity/authenticate.js'
import {InvitationProvider} from '../../../src/provider/invitation/invitation.js'
import {getRegisterScene} from '../../../src/provider/invitation/model.js'

const identity = {
  blockAddress: {
    mnemonic: {
      phrase: 'limb potato can before risk miracle radio voice wheat silly column lend stomach exile guess tornado neck hen',
      path: 'm/44\'/60\'/0\'/0/0',
      locale: 'en'
    },
    privateKey: '0x1b8b419505748c88071b8d28caafa4a74bcdc4a540542e7b4514b13a3f35c96c',
    identifier: 'did:ethr:0x7e4:0x0396be3542029111627e1d08c65a740fcda7b8a341a618ebfe92bace61c0fd5506',
    publicKey: '0x0396be3542029111627e1d08c65a740fcda7b8a341a618ebfe92bace61c0fd5506',
    address: '0x6256583430f59D8d526a0a694e7d37ea1956d0AC',
  }
}

const provider = {proxy: 'http://localhost:8441'}


describe('Invitation', () => {
  it('generate', async () => {
    const invitationProvider = new InvitationProvider(new Authenticate(identity.blockAddress), provider)
    const invitations = await invitationProvider.generate(getRegisterScene(), 2)
    console.log(`Success to generate invitation with owner=${identity.blockAddress.identifier}`)
    invitations.map(i => console.log(`code=${i.getCode()}`))
  })

  it('input', async () => {
    const invitationProvider = new InvitationProvider(new Authenticate(identity.blockAddress), provider)
    const code = 'pVYJCN5ly78Brjv46PbMFGor6UNkpXtx'
    const user = await invitationProvider.input(code)
    console.log(`Success to input invitation for user=${JSON.stringify(user)}`)
  })
})