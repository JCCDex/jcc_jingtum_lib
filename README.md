# About JCC Jingtum lib

![npm](https://img.shields.io/npm/v/jcc_jingtum_lib.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc_jingtum_lib.svg?branch=master)](https://travis-ci.com/JCCDex/jcc_jingtum_lib)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc_jingtum_lib/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc_jingtum_lib?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/jcc_jingtum_lib.svg)](http://npm-stat.com/charts.html?package=jcc_jingtum_lib)

Basic js lib to be used for interacting with jingtum blockchain or consortium blockchain network. Now support browser client.

- Keep only one websocket connection to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

原始代码来自[jingtum-lib](https://www.npmjs.com/package/jingtum-lib)，在此基础上[JCCDex团队](https://github.com/JCCDex)做以下增强

The team [JCCDex](https://github.com/JCCDex) made the following enhancements to the code from jingtum
* 支持浏览器 Support running in browsers 
* 支持所有的井通联盟链 Support all jingtum alliance chains

井畅应用交流群: 557524730

JCCDex Tech support QQ group ID: 557524730

## INSTALL

```shell
npm install jcc_jingtum_lib
```

## Documents

For more information see [docs.md](https://github.com/JCCDex/jcc_jingtum_lib/blob/master/docs.md)

## Clone from github
```shell
git clone https://github.com/JCCDex/jcc_jingtum_lib.git
cd jcc_jingtum_lib
npm install
npm run test
```
You will see this image, enjoy it.
