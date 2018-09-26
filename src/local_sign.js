var base = require('jcc_jingtum_base_lib').Wallet;
var jser = require('../lib/Serializer').Serializer;

function jingtum_sign_tx(in_tx, in_v, token) {
    token = token || 'swt';
    var wt = new base(in_v.seed, token);
    in_tx.SigningPubKey = wt.getPublicKey();
    var prefix = 0x53545800;
    var hash = jser.from_json(in_tx, token).hash(prefix, token);
    in_tx.TxnSignature = wt.signTx(hash);
    return jser.from_json(in_tx, token).to_hex();
}

module.exports = jingtum_sign_tx;