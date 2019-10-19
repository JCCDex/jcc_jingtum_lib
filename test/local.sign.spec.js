const chai = require('chai');
const expect = chai.expect;
const LocalSign = require('../dist/local_sign').default;
const config = require('./config');
let {
  testAddress,
  testSecret,
  testDestinationAddress
} = config

describe('test local sign', function() {
  describe('test payment', function() {
    it('should sign success', function() {
      let testData = {
        Flags: 0,
        Fee: 10000,
        TransactionType: 'Payment',
        Account: testAddress,
        Amount: {
          "value": 1,
          "currency": "BIZ",
          "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        },
        Destination: testDestinationAddress,
        Sequence: 2
      };
      let signature = LocalSign(testData, {
        seed: testSecret
      })
      expect(signature).to.equal("1200002200000000240000000261D4838D7EA4C6800000000000000000000000000042495A0000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000002540BE40073210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878744630440220503F3582D68448A81A799995E02ADE8324887E45F6922F1A4AA5AE0706D10505022005373E908C6A2562D545455C7953A5B95BCAC5B2EED7EBD96127F343F4C6A7DF811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D514638314181C68956D7B599EE4AE3C6CB12572F2CB86AA68");
    })
  })

  describe('test create order', function() {
    it('should sign success', function() {
      let testData = {
        Flags: 0,
        Fee: 10000,
        TransactionType: 'OfferCreate',
        Account: testAddress,
        TakerPays: {
          value: '0.00001',
          currency: 'CNY',
          issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
        },
        TakerGets: 9999999999
      }
      let signature = LocalSign(testData, {
        seed: testSecret
      })
      expect(signature).to.equal("120007220000000064D3438D7EA4C68000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665402386F26FB1BDC06840000002540BE40073210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B87874463044022026CA520B4C2F7047A4ADEA99F1210D4B980E5E19A5BD0E8B0ED0DD345BE6512B02202679443D51F3BE5DE609858B6D08D9F7A94E1D633771CAAE0F27485A370532B4811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463");

    })
  })

  describe('test cancel order', function() {
    it('should sign success', function() {
      let testData = {
        Flags: 0,
        Fee: 10 / 1000000,
        Account: testAddress,
        TransactionType: 'OfferCancel',
        OfferSequence: 1,
      }
      let signature = LocalSign(testData, {
        seed: testSecret
      })
      expect(signature).to.equal("120008220000000020190000000168400000000000000A73210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878744630440220138875034D8E98A7C5CA8557CEDE2FDE3B3572D74292715EF5F787F5C8A053C40220181F688F545A1B5E8E6504A7927225D8061BF2179AF2800D7941976788B4D375811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463");

    })
  })

});