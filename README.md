# wwcrypto

企业微信加解密库。各参数的含义请参考 [企业微信 API 文档](https://open.work.weixin.qq.com/api/doc/90000/90139/90968)。

## Install

```bash
npm i wwcrypto
```

## Usage

```js
import WWCrypto from 'wwcrypto'

const wwcrypto = new WWCrypto(token, encodingAESKey, receiveId)

const encryptedMsg = wwcrypto.encryptMsg(message, { timestamp, nonce })

console.log(encryptedMsg)
// -> '<xml>[...]<Encrypt><![CDATA[...]]></Encrypt></xml>'

const decryptedMsg = wwcrypto.decryptMsg(signature, timestamp, nonce, encryptedMsg)

console.log(decryptedMsg)
// -> { AgentID, Content, ... }
```

## API

### WWCrypto( token, encodingAESKey, receiveId )

__Params:__

- `token` __string__
- `encodingAESKey` __string__
- `receiveId` __string__

__Usage:__

初始化加解密库。

### wwcrypto.decryptMsg( signature, timestamp, nonce, xml )

__Params:__

- `signature` __string__
- `timestamp` __string | number__
- `nonce` __string | number__
- `xml` __string__

__Returns: Object__

__Usage:__

校验 signature 并解析 XML 消息内容。

### wwcrypto.encryptMsg( message, [options] )

__Params:__

- `message` __string__
- `options` __Object__
  - `nonce` __string | number__
  - `timestamp` __string | number__
  - `padding` __Buffer__

__Returns: string__

__Usage:__

加密并封装消息，返回 XML 内容。可通过 `options` 配置 XML 消息的各类参数以及拼接在明文前的随机字节。

### wwcrypto.decrypt( data )

__Params:__

- `data` __string__

__Returns: string__

__Usage:__

解密消息。

### wwcrypto.encrypt( data, options )

__Params:__

- `data` __string__
- `options` __Object__
  - `padding` __Buffer__

__Returns: string__

__Usage:__

加密消息，返回 base64 编码后的结果。可通过 `options.padding` 指定头部 16 个随机字节。

### wwcrypto.getSignature( timestamp, nonce, encryptedMsg )

__Params:__

- `timestamp` __string | number__
- `nonce` __string | number__
- `encryptedMsg` __string__

__Returns: string__

__Usage:__

计算签名。
