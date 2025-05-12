import {Authenticate} from '../../../src/identity/authenticate.js'
import {CertificateProvider} from '../../../src/provider/certificate/certificate.js'

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


describe('Certificate', () => {
  it('sign', async () => {
    const domain = '*.store.pub'
    const csr = '-----BEGIN CERTIFICATE REQUEST-----\n' +
      'MIIE3TCCAsUCAQAwgZcxCzAJBgNVBAYTAkNOMRAwDgYDVQQIDAdKaWFuZ1N1MRAw\n' +
      'DgYDVQQHDAdOYW5KaW5nMRIwEAYDVQQKDAlDb21tdW5pdHkxDzANBgNVBAsMBlll\n' +
      'WWluZzEUMBIGA1UEAwwLKi5zdG9yZS5wdWIxKTAnBgkqhkiG9w0BCQEWGnlleWlu\n' +
      'Zy5jb21tdW5pdHlAZ21haWwuY29tMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIIC\n' +
      'CgKCAgEAyfNdVncUT+cYvvGPox7Gm6pbmyrqBaXT7NsZJ1pPGrEqeJXiALo8dCso\n' +
      'M5MSrHwtrhSffuJ0pXc74BSKXUKQ+tJ7+v2bOF6oXeVnzK+WYdk08ls7vJFovIL9\n' +
      'n8Yv4MoBzKxYI1Wvq0Ux8SXwtR4OPQhC1OTcJv78TouucyzDJyhZ5tOxBGlFvD/G\n' +
      'ksl/KUmCMPaKmm3ZgmfodHOsXtDx6X4hXno99IT+ejcUWte84/9C9NpdB4ASiI7E\n' +
      '9MiYx4rum5hOvZdvM3sUwM4IO5Q/xxnl11l8LslE26knWaFFms+hQwLpxkjd6CZy\n' +
      'n+mlel0r0ImBrOXHGdNx3sEdV/oj+hdgep7W42NEKQjC8zLQ1Q0DotXYpfYfX7uS\n' +
      '461QNSEz4wkIRDEf4vLODTwgUOQD+ZYLxS1YojzbhBx6tqq3aQgIyM8HLQTnt2ps\n' +
      '4KV713iajCRKgD6RCBgPtA9lMq/VVfuN+yZOlete0SWt9Qy4WrXy930Yq4RXsncg\n' +
      '47LN7jwhTORRGYBJzOtqOc/Flu8NWW6wOek7BtDOmUJsL9RK+SzQijDo+M7TnLbD\n' +
      'MPQaYNHwpjztHjKajPk8tNvCJF4WmoXBgShv+5JwA9lduxkRm0Mm/89kmmPAkCkS\n' +
      '+ZFDwx6Bwk95wNx6xMSYPBeVkyuWObVk3a/DvH4P2belHI9PKt0CAwEAAaAAMA0G\n' +
      'CSqGSIb3DQEBCwUAA4ICAQBVu5/GRo2zwFWVOYsHjRBuc7Nx+w2Qvi41XWb/cHdd\n' +
      'hzDvsKL738heqXlRA/LHqt1QjjxpzniGuCAk5U9aU9vIb9qIFO5FMxq03bsPua4/\n' +
      'ao9EPXVW9LUWr9aoraDS1e9dSYOX49FioDoBcWuR26fEXyWiRXW+aSTNGVwEzMEG\n' +
      '/e0oVKY4dfcwKJxvkUOfqJ4fKHmFFGnRVKQZRewirrWd2q42XnzChAsRlaYCSk4u\n' +
      'YwqrP++8W13uiWNZA6aVZzQjHbErT/VQUwl8QOmNvJ/vT0vLpIZYDvG80lC/Marp\n' +
      'te47Nc12sJo+lGeEQ/zCeU2gBgH+rbwxJR5NW1eSY0A/sPGcmGk9zuTtP1TIu0EQ\n' +
      'Q1F/YfIoqzM9b18FVg6e/SKclHuVulcNMumRwQagvA9b6958CajyLHvgC9WjyLij\n' +
      'Idiaji6BXHFGSRiT1leNR1AsHZNnRAzGKvpvk6tfFx0r8ciSKQMw6IY66uzyJ26C\n' +
      'DzKhZmcqB88sLn1IKvmuB6Yr/Mva9r6ShHVFsCDB8KB5B18OZ0gtknusr+DOMq/R\n' +
      'yU9/ClEyu6sV6xJ5mser1xog5FPjzy2l7s1kIWbUkYlP+ljw63PfICnkfwucuaZ8\n' +
      'ZOSAn++Qj5HxwSeLXqUsQ2MdNFzE/zps+W1PRSTLPPag/3wBERL2KX1/BevsCh0t\n' +
      'Vg==\n' +
      '-----END CERTIFICATE REQUEST-----'
    const certificateProvider = new CertificateProvider(new Authenticate(identity.blockAddress), provider)
    const result = await certificateProvider.sign(domain, csr)
    console.log(`Success to sign service=${identity.blockAddress.identifier}, domain=${domain}, cert=${result.getCrt()}`)
  })
})