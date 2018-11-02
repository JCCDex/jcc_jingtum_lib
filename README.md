# About JCC Jingtum lib

[![Build Status](https://travis-ci.com/JCCDex/jcc_jingtum_lib.svg?branch=master)](https://travis-ci.com/JCCDex/jcc_jingtum_lib)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc_jingtum_lib/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc_jingtum_lib?branch=master)

Basic js lib to be used for interacting with jingtum blockchain or consortium blockchain network. Now support browser client.

- Keep only one websocket connecttion to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

## INSTALL

```shell
npm install jcc_jingtum_lib
```

## Documents

For more information see [docs.md](https://github.com/JCCDex/jcc_jingtum_lib/blob/master/docs.md)

## About Test

Because the test network of jingtum is not available, some test examples are based on production network. Please create config.js file in the test folder.

- File Structure

```javascript
module.exports = {
    "JT_NODE": "",
    "TEST_NODE": "",
    "testAddress": "",
    "testSecret": "",
    "testDestinationAddress": "",
    "testCreateHash": ""
}
```