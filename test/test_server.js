const chai = require('chai');
const expect = chai.expect;
const Server = require('../src/server');
const Remote = require('../src/remote');
const config = require('./config');
const url = require('url');
const TEST_NODE = 'ws://ts5.jingtum.com:5020'
let {
    JT_NODE
} = config

describe('test server', function () {
    describe('test constructor if this is secure', function () {
        let remote = new Remote({
            server: JT_NODE,
            local_sign: true
        });
        let server = new Server(remote, JT_NODE);
        let parsed = url.parse(JT_NODE)
        expect(server._remote instanceof Remote).to.equal(true);
        expect(server._ws).to.equal(null);
        expect(server._connected).to.equal(false);
        expect(server._opened).to.equal(false);
        expect(server._state).to.equal('offline');
        expect(server._id).to.equal(0);
        expect(server._timer).to.equal(0);
        expect(server._url).to.equal(`wss://${server._opts.host}:${server._opts.port}`)
        expect(server._opts).to.deep.equal({
            host: parsed.hostname,
            port: Number(parsed.port),
            secure: parsed.protocol === 'wss:'
        })
    })

    describe('test constructor if this is not secure', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, TEST_NODE);
        let parsed = url.parse(TEST_NODE)
        expect(server._remote instanceof Remote).to.equal(true);
        expect(server._ws).to.equal(null);
        expect(server._connected).to.equal(false);
        expect(server._opened).to.equal(false);
        expect(server._state).to.equal('offline');
        expect(server._id).to.equal(0);
        expect(server._timer).to.equal(0);
        expect(server._url).to.equal(`ws://${server._opts.host}:${server._opts.port}`)
        expect(server._opts).to.deep.equal({
            host: parsed.hostname,
            port: Number(parsed.port),
            secure: parsed.protocol === 'wss:'
        })
    })

    describe('throw error if options is invalid', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, null);
        expect(server.opts).to.be.an('error');
        expect(server.opts.message).to.equal('server options not supplied')
    })

    describe('throw error if host is invalid', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, {
            host: JT_NODE + TEST_NODE
        });
        expect(server.opts_host).to.be.an('error');
        expect(server.opts_host.message).to.equal('server host incorrect')
    })

    describe('throw error if port is not a number', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, {
            host: 'ts5.jingtum.com',
            port: 'aaa'
        });
        expect(server.port).to.be.an('error');
        expect(server.port.message).to.equal('server port not a number')
    })

    describe('throw error if port is less than 1', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, {
            host: 'ts5.jingtum.com',
            port: -1
        });
        expect(server.port).to.be.an('error');
        expect(server.port.message).to.equal('server port out of range')
    })

    describe('throw error if port is more than 65535', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, {
            host: 'ts5.jingtum.com',
            port: 65536
        });
        expect(server.port).to.be.an('error');
        expect(server.port.message).to.equal('server port out of range')
    })

    describe('secure is false if opts.secure is not boolean', function () {
        let remote = new Remote({
            server: TEST_NODE,
            local_sign: true
        });
        let server = new Server(remote, {
            host: 'ts5.jingtum.com',
            port: 5020
        });
        expect(server._opts.secure).to.equal(false);
    })
});