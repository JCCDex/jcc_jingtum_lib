const chai = require('chai');
const expect = chai.expect;
const config = require('./config')
const Serializer = require('../lib/Serializer').Serializer
describe('test Serializer', function () {
    describe('test constructor', function () {
        it('if the buf is array and token is undefined', function () {
            let inst = new Serializer([]);
            expect(inst.buffer).to.deep.equal([])
            expect(inst._token).to.equal('swt');
            expect(inst.pointer).to.equal(0)
        })

        it('if the buf is buffer', function () {
            let inst = new Serializer(Buffer.from('test'));
            expect(inst.buffer).to.deep.equal(Buffer.from('test'))
            expect(inst._token).to.equal('swt');
            expect(inst.pointer).to.equal(0)
        })

        it('if the buf is string', function () {
            let inst = new Serializer('test', 'bwt');
            expect(inst.buffer).to.deep.equal([478, 477])
            expect(inst._token).to.equal('bwt');
            expect(inst.pointer).to.equal(0)
        })

        it('if the buf is empty', function () {
            let inst = new Serializer(undefined, 'bwt');
            expect(inst.buffer).to.deep.equal([])
            expect(inst._token).to.equal('bwt');
            expect(inst.pointer).to.equal(0)
        })

        it('if the buf is object', function () {
            expect(() => new Serializer({}, 'bwt')).to.throw('Invalid buffer passed.')
        })
    })
});