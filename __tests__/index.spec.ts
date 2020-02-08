import WWCrypto from '../src/index'
import * as data from './data.json'

const wwcrypto = new WWCrypto(data.params.token, data.params.encodingAESKey, data.params.receiveId)

it('decrypt message', () => {
  const parsedMessage = wwcrypto.decryptMsg(data.signature, data.params.timestamp, data.params.nonce, data.carrierXML)
  expect(parsedMessage).toMatchSnapshot()
})

it('encrypt message', () => {
  const encryptedXML = wwcrypto.encryptMsg(data.decryptedMessage, {
    padding: Buffer.from(data.padding, 'base64'),
    nonce: data.params.nonce,
    timestamp: data.params.timestamp,
  })
  expect(encryptedXML).toMatchSnapshot()
})

it('encrypt data', () => {
  const encryptedMessage = wwcrypto.encrypt(data.decryptedMessage, {
    padding: Buffer.from(data.padding, 'base64'),
  })
  expect(encryptedMessage).toMatchSnapshot()
})

it('decrypt data', () => {
  const decryptedMessage = wwcrypto.decrypt(data.encryptedMessage)
  expect(decryptedMessage).toEqual(data.decryptedMessage)
})

it('is decrypt encrypted message', () => {
  const encryptedMsg = wwcrypto.encryptMsg(data.decryptedMessage, {
    padding: Buffer.from(data.padding, 'base64'),
    nonce: data.params.nonce,
    timestamp: data.params.timestamp,
  })
  const signature = encryptedMsg.match(/<MsgSignature><!\[CDATA\[(.+?)]]><\/MsgSignature>/)[1]
  const decryptedMsg = wwcrypto.decryptMsg(signature, data.params.timestamp, data.params.nonce, encryptedMsg)
  expect(decryptedMsg).toMatchSnapshot()
})

it('calculate signature', () => {
  const signature = wwcrypto.getSignature(data.params.timestamp, data.params.nonce, data.encryptedMessage)
  expect(signature).toEqual(data.signature)
})
