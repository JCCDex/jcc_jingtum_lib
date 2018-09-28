const chai = require('chai');
const expect = chai.expect;

describe('test remote', function () {
    let utils = require('../src/utils');
    describe('test getCurrency', function () {
        it('return swt if the config is empty', function () {
            let currency = utils.getCurrency('moac');
            expect(currency).to.equal('SWT');
        })
    })
});