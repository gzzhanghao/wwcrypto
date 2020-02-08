import * as pkcs7 from 'pkcs7'
import * as crypto from 'crypto'
import * as XMLParser from 'fast-xml-parser'

const j2xParser = new XMLParser.j2xParser({
  cdataTagName: '__cdata',
})

export interface MessageOptions {
  nonce?: string | number
  timestamp?: string | number
  padding?: Buffer
}

export default class WWCrypto {

  public token: string

  public receiveId: string

  public aesKey: Buffer

  public iv: Buffer

  /**
   * @param token
   * @param encodingAESKey
   * @param receiveId
   */
  constructor(token: string, encodingAESKey: string, receiveId: string) {
    this.token = token
    this.receiveId = receiveId
    this.aesKey = Buffer.from(`${encodingAESKey}=`, 'base64')
    this.iv = this.aesKey.slice(0, 16)
  }

  /**
   * 解密 XML 消息
   *
   * @param signature 消息签名
   * @param timestamp 时间戳
   * @param nonce 随机数
   * @param xml 需要解密的 XML 消息
   * @returns 解密后的消息对象
   */
  public decryptMsg(signature: string, timestamp: string | number, nonce: string | number, xml: string) {
    const outerMsg = XMLParser.parse(xml)['xml']
    if (signature !== this.getSignature(timestamp, nonce, outerMsg['Encrypt'])) {
      console.log(signature, this.getSignature(timestamp, nonce, outerMsg['Encrypt']))
      throw new Error('signature mismatch')
    }
    return XMLParser.parse(this.decrypt(outerMsg['Encrypt']))['xml']
  }

  /**
   * 加密、封装 XML 消息
   *
   * @param message 明文消息内容
   * @param options 自定义 XML 消息属性
   * @returns 封装后的 XML 文本
   */
  public encryptMsg(message: string, options: MessageOptions = {}): string {
    const encrypt = this.encrypt(message, options)
    const nonce = options.nonce || Math.floor(Math.random() * 1e10)
    const timestamp = options.timestamp || Math.floor(Date.now() / 1000)
    const signature = this.getSignature(timestamp, nonce, encrypt)
    return j2xParser.parse({
      xml: {
        Encrypt: { __cdata: encrypt },
        Nonce: { __cdata: nonce },
        TimeStamp: timestamp,
        MsgSignature: { __cdata: signature },
      },
    })
  }

  /**
   * 加密消息
   *
   * @param data 需要加密的明文
   * @returns 以 base64 编码的密文
   */
  public encrypt(data: string, options: MessageOptions = {}) {
    const padding = options.padding || crypto.randomBytes(16)
    if (padding.byteLength !== 16) {
      throw new Error('invalid padding length')
    }
    const message = Buffer.from(data)
    const messageLength = Buffer.allocUnsafe(4)
    messageLength.writeUInt32BE(message.byteLength, 0)
    const rawMsg = Buffer.concat([
      padding,
      messageLength,
      message,
      Buffer.from(this.receiveId),
    ])
    const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv)
    const buffer = Buffer.concat([
      cipher.update(rawMsg),
      cipher.final(),
    ])
    return buffer.toString('base64')
  }

  /**
   * 解密消息
   *
   * @param data 需要解密的密文
   * @returns 解密后的明文
   */
  public decrypt(data: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, this.iv)
    decipher.setAutoPadding(false)
    const buffer = Buffer.from(pkcs7.unpad(Buffer.concat([
      decipher.update(data, 'base64'),
      decipher.final(),
    ])))
    const messageLength = buffer.readUInt32BE(16)
    const receiveId = buffer.slice(20 + messageLength).toString()
    if (receiveId !== this.receiveId) {
      throw new Error('receive id mismatch')
    }
    return buffer.slice(20, 20 + messageLength).toString()
  }

  /**
   * 获取签名
   *
   * @param timestamp 时间戳
   * @param nonce 随机数
   * @param encryptedMsg 密文
   * @returns 消息签名
   */
  public getSignature(timestamp: string | number, nonce: string | number, encryptedMsg: string) {
    const signature = [this.token, timestamp, nonce, encryptedMsg].sort().join('')
    return crypto.createHash('sha1').update(signature).digest('hex')
  }
}
