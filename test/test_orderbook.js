const chai = require('chai');
const expect = chai.expect;
const OrderBook = require('../src/orderbook');
const Remote = require('../src/remote');
const config = require('./config');
const txData = require('./tx_data');
let {
    JT_NODE
} = config

describe('test TypesUtils', function () {
    describe('test constructor', function () {
        let remote = new Remote({
            server: JT_NODE,
            local_sign: true
        });
        remote._token = null;
        let orderBook = new OrderBook(remote);
        expect(orderBook._token).to.equal('swt');
    })

    describe('emit transactions with meta data', function () {
        let remote = new Remote({
            server: JT_NODE,
            local_sign: true
        });
        let orderBook = new OrderBook(remote);
        orderBook._remote.emit('transactions', txData.input26);
    })

    describe('emit transactions without meta data', function () {
        let remote = new Remote({
            server: JT_NODE,
            local_sign: true
        });
        let orderBook = new OrderBook(remote);
        orderBook._remote.emit('transactions', txData.input24)
    })
});