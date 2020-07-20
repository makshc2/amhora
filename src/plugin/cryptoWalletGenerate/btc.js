/* eslint-disable */
let bip39 = require('bip39')
let hdkey = require('hdkey')
let createHash = require('create-hash')
let bitcoin = require('bitcoinjs-lib');
let bs58check = require('bs58check');

const BTC_TESTNET_NETWORK = {
    messagePrefix: '\x19Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: { // can't find
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239
}
const BTC_MAINNET_NETWORK = {
    messagePrefix: '\x19Bitcoin Signed Message:\n',
    bech32: 'bc',
    // bip32: { // can't find
    //     public: 0x019da462,
    //     private: 0x019d9cfe,
    // },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128
}
// const NETWORKS = require('bitcoinjs-lib/types/networks')
export {generateWallet, signTransaction, generatePrivateKey}
// process.env.NODE_ENV === 'development'   add to dev mode
function generateWallet(seed, index = 0, isSegWit) {
    console.log(seed)
    const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
    const masterPrivateKey = root.privateKey.toString('hex')
    const addrnode = root.derive(`m/44'/1'/0'/0/${index}`)
    // const addrnode = root.derive("m/44'/1'/0'/0/0"); => Testnet LTC && BTC && BCH
    //
    //     // const addrnode = root.derive("m/44'/0'/0'/0/0"); => BTC
    //     // const addrnode = root.derive("m/44'/2'/0'/0/0"); => LTC
    //     // const addrnode = root.derive("m/44'/145'/0'/0/0"); => BCH
    /// Private and Public Key
    const rawPbK = Buffer.from(addrnode._publicKey);
    const rawPvK = addrnode._privateKey;
    /// Hashing the raw publiv key
    const hash1pbk = createHash('sha256').update(rawPbK).digest();
    const hash1rmd = createHash('rmd160').update(hash1pbk).digest();
    // Space allocation
    let pubAddr = Buffer.allocUnsafe(21);
    // Adding testnet prefix
    pubAddr.writeUInt8(0x6f, 0);
    // pubAddr.writeUInt8(0x30, 0); => LTC
    // pubAddr.writeUInt8(0x00, 0); => BCH && BTC
    hash1rmd.copy(pubAddr, 1);
    let pbAddr
    if (isSegWit) {
        let privateKey = addrnode.privateKey
        let keyPair = bitcoin.ECPair.fromPrivateKey(privateKey)
        const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: BTC_TESTNET_NETWORK})
        pbAddr = address
    } else {
        pbAddr = bs58check.encode(pubAddr);
    }
    console.log(pbAddr)
    return {
        address: pbAddr,
        currency: 'btc',
        derivation: addrnode,
        privateKey: rawPvK,
        derivationCode: `m/44'/1'/0'/0/${index}`,
        index: index
    }
}

function signTransaction(txHex, seed, addresses) {
    const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
    let tx = bitcoin.Transaction.fromHex(txHex.tx_hex)
    let mapOfDerive = []
    let multiSign = function () {
        let psbt = new bitcoin.Psbt();
        psbt.addOutputs(tx.outs)
        txHex.inputs.forEach(async (item, index) => {
            let baseInput = item
            let input = {
                hash: baseInput.tx_id,
                index: baseInput.index,
                nonWitnessUtxo: Buffer.from(baseInput.tx_hex, 'hex')
            }
            let prevTx = bitcoin.Transaction.fromHex(baseInput.tx_hex)
            let address = bitcoin.address.fromOutputScript(prevTx.outs[input.index].script, bitcoin.networks.testnet)
            let currentDerivation = addresses[address]
            psbt.addInput(input)
            const addrnode = root.derive(`m/44'/1'/0'/0/${currentDerivation}`),
                privateKey = addrnode.privateKey,
                keyPair = bitcoin.ECPair.fromPrivateKey(privateKey)
            mapOfDerive[index] = keyPair
        })
        return psbt
    }
    let psbtToSign = multiSign()
    mapOfDerive.forEach((item, index) => {
        psbtToSign.signInput(index, item)
    })
    psbtToSign.validateSignaturesOfAllInputs()
    psbtToSign.finalizeAllInputs()
    let signedTx = psbtToSign.extractTransaction().toHex()
    return {
        transaction: signedTx
    }
}

function generatePrivateKey(seed, derivationNum) {
    let allPrivateKey = []
    const root = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
    const addrnode = root.derive(`m/44'/1'/0'/0/${derivationNum}`)
    const keyPair = bitcoin.ECPair.fromPrivateKey(addrnode.privateKey, { network: BTC_TESTNET_NETWORK })
    allPrivateKey.push(keyPair.toWIF())
    return allPrivateKey
}

