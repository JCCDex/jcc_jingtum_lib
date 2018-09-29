const chai = require('chai');
chai.use(require('chai-json-schema'));
const Remote = require('../src/remote');
const schema = require('./schema');
const expect = chai.expect;
const TEST_NODE = 'ws://ts5.jingtum.com:5020'
const config = require('./config');
let {
    JT_NODE,
    testAddress,
    testSecret,
    testDestinationAddress,
    testCreateHash,
    testCancelHash,
    testPayHash
} = config

describe('test remote', function () {

    describe('test constructor', function () {
        it('throw error if the arguments is undefined', function () {
            let remote = new Remote();
            expect(remote.type).to.be.an('error');
        })

        it('the default _token is swt', function () {
            let remote = new Remote({
                server: JT_NODE
            });
            expect(remote._token).to.be.equal('swt');
        })

        it('if the server is ws', function () {
            let remote = new Remote({
                server: TEST_NODE
            })
            expect(remote._server._opts.secure).to.equal(false)
        })
    })

    describe('test _updateServerStatus', function () {
        it('the server is offline if the online states does not include the server status', function () {
            let remote = new Remote({
                server: JT_NODE
            });
            remote._updateServerStatus({
                load_base: 256,
                load_factor: 256,
                server_status: 'disconnect',
                pubkey_node: ''
            })
            expect(remote.isConnected()).to.equal(false)
        })

        it('connect in error if the _server is empty', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote._server = null;
            remote.connect((err, result) => {
                expect(err).to.be.a('string')
                done();
            });
        })

        it('not call disconnet if the _server is empty', function () {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote._server = null;
            remote.disconnect();
            expect(true);
        })
    })

    describe('test requestServerInfo', function () {
        it('should request server info successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestServerInfo();
                expect(remote.isConnected()).to.equal(true);
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.SERVER_INFO_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestLedgerClosed', function () {
        it('should request ledger closed successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedgerClosed();
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_CLOSED_SCHEMA);
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestLedger', function () {
        it('should request ledger successfully if the option of full is true', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedger({
                    full: true
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request ledger successfully if the option of expand is true', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedger({
                    expand: true
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request ledger successfully if the option of transactions is true', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedger({
                    transactions: true,
                    ledger_hash: '9E0277C68A170EFE1F5B91A7D99645D56F8843D1CBB69149919B50506A258C61',
                    ledger_index: '10817678'
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request ledger successfully if the option of accounts is true', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedger({
                    accounts: true
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request ledger successfully if the option is empty object', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestLedger({});
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

    })

    describe('test requestTx', function () {
        it('should request tx successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestTx({
                    hash: testCreateHash
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.TX_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestAccountInfo', function () {
        it('should request account info successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountInfo({
                    account: testAddress
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_INFO_SCHEMA);
                    expect(result.account_data.Account).to.equal(testAddress)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestAccountTums', function () {
        it('should request account tums successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountTums({
                    account: testAddress
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_TUMS_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestAccountRelations', function () {
        it('should request account relations successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountRelations({
                    account: testAddress,
                    type: "trust",
                    ledger_index: "10000"
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_RELATIONS_SCHEMA);
                    expect(result.account).to.equal(testAddress)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestAccountOffers', function () {
        it('should request account offers successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountOffers({
                    account: testAddress
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_OFFERS_SCHEMA);
                    expect(result.account).to.equal(testAddress)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestAccountTx', function () {
        it('should request account tx successfully with more options', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountTx({
                    account: testAddress,
                    ledger_min: 1,
                    ledger_max: 1000,
                    limit: 10,
                    offset: 10,
                    forward: true,
                    marker: {
                        ledger: 0,
                        seq: 0
                    }
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_TX_SCHEMA);
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request account tx successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestAccountTx({
                    account: testAddress
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ACCOUNT_TX_SCHEMA);
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestOrderBook', function () {
        it('should request order book successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestOrderBook({
                    gets: {
                        currency: "CNY",
                        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                    },
                    pays: {
                        currency: "SWT",
                        issuer: ""
                    },
                    taker: 'jjjjjjjjjjjjjjjjjjjjBZbvri'
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ORDER_BOOK_SECHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })

        it('should request order book successfully if the option of taker is empty', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestOrderBook({
                    gets: {
                        currency: "CNY",
                        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                    },
                    pays: {
                        currency: "SWT",
                        issuer: ""
                    }
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.ORDER_BOOK_SECHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test requestPathFind', function () {
        it('should request path successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let req = remote.requestPathFind({
                    account: testAddress,
                    destination: testDestinationAddress,
                    amount: {
                        value: "0.001",
                        currency: "SWT",
                        issuer: ""
                    }
                });
                req.submit((err, result) => {
                    expect(result).to.be.jsonSchema(schema.PATH_FIND_SCHEMA)
                    remote.disconnect();
                    done()
                })
            });
        })
    })

    describe('test createAccountStub', function () {
        it('create account stub successfully', function () {
            let Account = require('../src/account');
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            let stub = remote.createAccountStub();
            expect(stub instanceof Account).to.equal(true);
        })
    })

    describe('test createOrderBookStub', function () {
        it('create order book stub successfully', function () {
            let OrderBook = require('../src/orderbook');
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            let stub = remote.createOrderBookStub();
            expect(stub instanceof OrderBook).to.equal(true);
        })
    })


    describe('test buildOfferCreateTx', function () {
        it('should buildOfferCreateTx successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let options = {
                    type: 'Buy',
                    account: testAddress,
                    taker_gets: {
                        value: '0.00001',
                        currency: 'CNY',
                        issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                    },
                    taker_pays: {
                        value: '1',
                        currency: 'SWT',
                        issuer: ''
                    }
                };
                let tx = remote.buildOfferCreateTx(options);
                tx.setSecret(testSecret);
                tx.submit(function (err, result) {
                    expect(result).to.be.jsonSchema(schema.ORDER_SCHEMA);
                    remote.disconnect()
                    done();
                });
            });
        })
    })

    describe('test buildPaymentTx', function () {
        it('should buildPaymentTx successfully', function (done) {
            this.timeout(0);
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true,
                token: 'swt'
            });
            remote.connect((err, result) => {
                let tx = remote.buildPaymentTx({
                    account: testAddress,
                    to: testDestinationAddress,
                    amount: {
                        "value": 1,
                        "currency": "SWT",
                        "issuer": ""
                    }
                });
                tx.setSecret(testSecret);
                tx.addMemo('测试0.5swt.');
                tx.submit(function (err, result) {
                    expect(result).to.be.jsonSchema(schema.PAYMENT_SCHEMA)
                    remote.disconnect()
                    done()
                });
            });
        })
    })
});