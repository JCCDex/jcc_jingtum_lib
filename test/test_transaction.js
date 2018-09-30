const chai = require('chai');
const expect = chai.expect;
const Transaction = require('../src/transaction');
const Event = require('events').EventEmitter;
const Remote = require('../src/remote');
const config = require('./config');
const Request = require('../src/request')
const sinon = require('sinon')
let {
    JT_NODE
} = config

describe('test Transaction', function () {
    describe('test constructor', function () {
        let remote = new Remote({
            server: JT_NODE,
            local_sign: true
        });
        remote._token = null;
        let inst = new Transaction(remote);
        expect(inst._token).to.equal('swt');
        expect(inst._remote instanceof Remote).to.equal(true);
        expect(inst.tx_json).to.deep.equal({
            Flags: 0,
            Fee: 10000
        })
        expect(inst._filter instanceof Function).to.equal(true)
        expect(inst instanceof Event).to.equal(true)
        expect(inst._secret).to.equal(undefined);
        expect(inst._filter('a')).to.equal('a')
    })

    describe('test parseJson', function () {
        it('set tx_json and return itself', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let ins = inst.parseJson({
                Account: '1111'
            });
            expect(inst.tx_json).to.deep.equal({
                Account: '1111'
            })
            expect(ins instanceof Transaction).to.equal(true);
        })
    })

    describe('test getAccount', function () {
        it('return account from tx_json', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.parseJson({
                Account: '1111'
            });
            expect(inst.getAccount()).to.equal('1111')
        })
    })

    describe('test getTransactionType', function () {
        it('return TransactionType from tx_json', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.parseJson({
                TransactionType: 'Signer'
            });
            expect(inst.getTransactionType()).to.equal('Signer')
        })
    })

    describe('test setSecret', function () {
        it('set _secret successfully if the secret is valid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret);
            expect(inst._secret).to.equal(config.testSecret)
        })

        it('the tx_json._secret is error if the secret is invalid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret.substring(1));
            expect(inst.tx_json._secret).to.be.an('error');
            expect(inst.tx_json._secret.message).to.equal('invalid secret');
            expect(inst._secret).to.equal(undefined)
        })
    })

    describe('test addMemo', function () {
        it('throw error if the memo is not string', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.addMemo(null);
            expect(inst.tx_json.memo_type).to.be.an('error');
            expect(inst.tx_json.memo_len).to.equal(undefined)
            expect(inst.tx_json.memo_type.message).to.equal('invalid memo type');
        })

        it("throw error if the memo's length is more than 2048", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let memo = '';
            for (let index = 0; index < 2049; index++) {
                memo += 'a'
            }
            inst.addMemo(memo);
            expect(inst.tx_json.memo_len).to.be.an('error');
            expect(inst.tx_json.memo_type).to.equal(undefined)
            expect(inst.tx_json.memo_len.message).to.equal('memo is too long');
        })

        it("set Memos successfully if the memo is valid", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.addMemo('test');
            expect(inst.tx_json.Memos).to.deep.equal([{
                Memo: {
                    MemoData: '74657374'
                }
            }]);
        })
    })

    describe('test setFee', function () {
        it('throw error if the fee is not number', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setFee('aaaa');
            expect(inst.tx_json.Fee).to.be.an('error');
            expect(inst.tx_json.Fee.message).to.equal('invalid fee')
        })

        it("throw error if the fee is too low", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setFee(9);
            expect(inst.tx_json.Fee).to.be.an('error');
            expect(inst.tx_json.Fee.message).to.equal('fee is too low')
        })

        it("set Fee successfully if the fee is valid", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.addMemo('test');
            inst.setFee("1000");
            expect(inst.tx_json.Fee).to.equal(1000);
        })
    })

    describe('test setPath', function () {
        it('return error if the key is not string', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let res = inst.setPath({});
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid path key');
        })

        it("return error if the key length is not 40", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let res = inst.setPath('aaaaa');
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid path key');
            expect(inst.tx_json.Paths).to.equal(undefined);
            expect(inst.tx_json.SendMax).to.equal(undefined);
        })

        it("return error if the value is not exist from cache with key", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let sha = '19db22e0ca8b5b3c285cfbaef9386cf7d062cbb1'
            let res = inst.setPath(sha);
            expect(res).to.be.an('error');
            expect(res.message).to.equal('non exists path key');
            expect(inst.tx_json.Paths).to.equal(undefined);
            expect(inst.tx_json.SendMax).to.equal(undefined);
        })

        it("return undedined if the value is empty array from cache with key", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let sha = '19db22e0ca8b5b3c285cfbaef9386cf7d062cbb1'
            let testData = {
                path: '[]',
                choice: {
                    currency: 'JSECT',
                    issuer: config.testAddress,
                    value: '0.0002'
                }
            }
            remote._paths.set(sha, testData);
            let res = inst.setPath(sha);
            expect(res).to.equal(undefined);
            expect(inst.tx_json.Paths).to.equal(undefined);
            expect(inst.tx_json.SendMax).to.equal(undefined);
        })

        it("set Paths and SendMax successfully if the amount is number", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let sha = '19db22e0ca8b5b3c285cfbaef9386cf7d062cbb1'
            let testData = {
                path: '[[{"account":"jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or","type":1,"type_hex":"0000000000000001"},{"currency":"SWT","type":16,"type_hex":"0000000000000010"}]]',
                choice: "1"
            }
            remote._paths.set(sha, testData);
            inst.setPath(sha);
            expect(inst.tx_json.Paths).to.deep.equal(JSON.parse(testData.path));
            expect(inst.tx_json.SendMax).to.equal('1');
        })

        it("set Paths and SendMax successfully if the amount is object", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let sha = '19db22e0ca8b5b3c285cfbaef9386cf7d062cbb1'
            let testData = {
                path: '[[{"account":"jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or","type":1,"type_hex":"0000000000000001"},{"currency":"SWT","type":16,"type_hex":"0000000000000010"}]]',
                choice: {
                    currency: 'JSECT',
                    issuer: config.testAddress,
                    value: '0.0002'
                }
            }
            remote._paths.set(sha, testData);
            inst.setPath(sha);
            expect(inst.tx_json.Paths).to.deep.equal(JSON.parse(testData.path));
            expect(inst.tx_json.SendMax).to.deep.equal({
                currency: 'JSECT',
                issuer: config.testAddress,
                value: '0.00020002'
            });
        })

        it("SendMax is error if the amount is not invalid", function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let sha = '19db22e0ca8b5b3c285cfbaef9386cf7d062cbb1'
            let testData = {
                path: '[[{"account":"jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or","type":1,"type_hex":"0000000000000001"},{"currency":"SWT","type":16,"type_hex":"0000000000000010"}]]',
                choice: 0.002
            }
            remote._paths.set(sha, testData);
            inst.setPath(sha);
            expect(inst.tx_json.Paths).to.deep.equal(JSON.parse(testData.path));
            expect(inst.tx_json.SendMax).to.be.an('error')
            expect(inst.tx_json.SendMax.message).to.equal('invalid amount to max')
        })
    })

    describe('test setSendMax', function () {
        it('set successfully if amount is valid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let amount = {
                currency: 'JSECT',
                issuer: config.testAddress,
                value: '0.0002'
            };
            inst.setSendMax(amount);
            expect(inst.tx_json.SendMax).to.deep.equal(amount);
        })

        it('return error if amount is invalid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let amount = 1;
            let res = inst.setSendMax(amount);
            expect(inst.tx_json.SendMax).to.equal(undefined);
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid send max amount')
        })
    })

    describe('test setTransferRate', function () {
        it('set successfully if rate is valid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let rate = 0.01
            inst.setTransferRate(rate);
            expect(inst.tx_json.TransferRate).to.equal(1010000000);
        })

        it('return error if rate is not number', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let rate = '0.01'
            let res = inst.setTransferRate(rate);
            expect(inst.tx_json.TransferRate).to.equal(undefined);
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid transfer rate')
        })

        it('return error if rate is less than 0', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let rate = -0.01
            let res = inst.setTransferRate(rate);
            expect(inst.tx_json.TransferRate).to.equal(undefined);
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid transfer rate')
        })

        it('return error if rate is more than 1', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let rate = 1.01
            let res = inst.setTransferRate(rate);
            expect(inst.tx_json.TransferRate).to.equal(undefined);
            expect(res).to.be.an('error');
            expect(res.message).to.equal('invalid transfer rate')
        })
    })

    describe('test setFlags', function () {
        it('not change flags if the flags is undefined', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setFlags();
            expect(inst.tx_json.Flags).to.equal(0);
        })

        it('if the flags is number', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setFlags(0x00010000);
            expect(inst.tx_json.Flags).to.equal(0x00010000);
        })

        it('if the flags is string', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.tx_json.TransactionType = 'Payment';
            inst.setFlags('PartialPayment');
            expect(inst.tx_json.Flags).to.equal(131072)
        })

        it('if the transaction_flags is empty object', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.tx_json.TransactionType = 'Payments';
            inst.setFlags('PartialPayment');
            expect(inst.tx_json.Flags).to.equal(0)
        })

        it('if the flags is array', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.tx_json.TransactionType = 'Payment';
            inst.setFlags(['PartialPayment', 'NoSkywellDirect']);
            expect(inst.tx_json.Flags).to.equal(196608)
        })
    })

    describe('test setSequence', function () {
        it('set successfully if sequence is valid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSequence(1111);
            expect(inst.tx_json.Sequence).to.equal(1111);
        })

        it('return error if sequence is invalid', function () {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            let res = inst.setSequence('1.11');
            expect(inst.tx_json.Sequence).to.be.an('error');
            expect(res instanceof Transaction).to.equal(true);
            expect(inst.tx_json.Sequence.message).to.equal('invalid sequence')
        })
    })

    describe('test sign', function () {

        it('sign payment successfully for case one', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret);
            let testData = {
                Flags: 0,
                Fee: 10000,
                TransactionType: 'Payment',
                Account: config.testAddress,
                Amount: '1000000',
                Destination: config.testDestinationAddress,
                Memos: [{
                    Memo: {
                        MemoData: 'test'
                    }
                }],
                SendMax: '1',
                Sequence: 4737
            }
            inst.parseJson(testData);
            inst.sign(function (err, hash) {
                expect(err).to.be.null;
                expect(inst.tx_json.Amount).to.equal(1)
                expect(inst.tx_json.Fee).to.equal(0.01)
                expect(inst.tx_json.SendMax).to.equal(0.000001)
                expect(inst.tx_json.Memos).to.deep.equal([{
                    Memo: {
                        MemoData: '\u0000\u0000'
                    }
                }])
                expect(hash).to.be.a('string');
                done()
            })
        })

        it('sign payment successfully for case two', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret);
            let testData = {
                Flags: 0,
                Fee: 10000,
                TransactionType: 'Payment',
                Account: config.testAddress,
                Amount: {
                    "value": 1,
                    "currency": "BIZ",
                    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                Destination: config.testDestinationAddress,
                Sequence: 4737
            }
            inst.parseJson(testData);
            inst.sign(function (err, hash) {
                expect(err).to.be.null;
                expect(inst.tx_json.Amount).to.deep.equal({
                    "value": 1,
                    "currency": "BIZ",
                    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                })
                expect(inst.tx_json.Fee).to.equal(0.01)
                expect(inst.tx_json.SendMax).to.equal(undefined)
                expect(hash).to.be.a('string');
                done()
            })
        })

        it('sign order successfully for case one', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret);
            let testData = {
                Flags: 0,
                Fee: 10000,
                TransactionType: 'OfferCreate',
                Account: config.testAddress,
                TakerPays: '1000000',
                TakerGets: {
                    value: '0.00001',
                    currency: 'CNY',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                },
                Sequence: 4737
            }
            inst.parseJson(testData);
            inst.sign(function (err, hash) {
                expect(err).to.be.null;
                expect(inst.tx_json.TakerPays).to.deep.equal(1)
                expect(inst.tx_json.TakerGets).to.deep.equal({
                    value: '0.00001',
                    currency: 'CNY',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                })
                expect(inst.tx_json.Fee).to.equal(0.01)
                expect(hash).to.be.a('string');
                done()
            })
        })

        it('sign order successfully for case two', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret);
            let testData = {
                Flags: 0,
                Fee: 10000,
                TransactionType: 'OfferCreate',
                Account: config.testAddress,
                TakerPays: {
                    value: '0.00001',
                    currency: 'CNY',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                },
                TakerGets: 1000000,
                Sequence: 4737
            }
            inst.parseJson(testData);
            inst.sign(function (err, hash) {
                expect(err).to.be.null;
                expect(inst.tx_json.TakerGets).to.deep.equal(1)
                expect(inst.tx_json.TakerPays).to.deep.equal({
                    value: '0.00001',
                    currency: 'CNY',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                })
                expect(inst.tx_json.Fee).to.equal(0.01)
                expect(hash).to.be.a('string');
                done()
            })
        })

        it('sign in error', function (done) {
            let remote = new Remote({
                server: JT_NODE,
                local_sign: true
            });
            let inst = new Transaction(remote);
            inst.setSecret(config.testSecret.substring(1));
            let testData = {
                Flags: 0,
                Fee: 10000,
                TransactionType: 'OfferCreate',
                Account: config.testAddress,
                TakerPays: {
                    value: '0.00001',
                    currency: 'CNY',
                    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
                },
                TakerGets: 1000000,
                Sequence: 4737
            }
            inst.parseJson(testData);
            inst.sign(function (err, hash) {
                expect(err).to.be.an('error');
                expect(hash).to.be.undefined;
                done()
            })
        })

        // it('sign order successfully through request sequence', function (done) {
        //     this.timeout(0)
        //     let remote = new Remote({
        //         server: JT_NODE,
        //         local_sign: true
        //     });
        //     let inst = new Transaction(remote);
        //     inst.setSecret(config.testSecret);
        //     let testData = {
        //         Flags: 0,
        //         Fee: 10000,
        //         TransactionType: 'OfferCreate',
        //         Account: config.testAddress,
        //         TakerPays: {
        //             value: '0.00001',
        //             currency: 'CNY',
        //             issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
        //         },
        //         TakerGets: 1000000
        //     }
        //     inst.parseJson(testData);
        //     let stub = sinon.stub(inst, "sign");
        //     stub.onCall().returns(new Error('aaaaaaa'))
        //     remote.connect((err, res) => {
        //         inst.sign(function (err, hash) {
        //             expect(err).to.be.null;
        //             console.log(testData)
        //             expect(hash).to.be.a('string');
        //             done()
        //             remote.disconnect();
        //             stub.restore()
        //         })
        //     })
        // })
    })
});