import crypto from 'crypto'
import CryptoJS from 'crypto-js';

function encryptText(text, key, iv, algorithm='aes-256-cbc') {
    let keystring = crypto.createHash('sha256').update(String(key)).digest('hex').substr(0, 32)
    let ivv = crypto.createHash('sha256').update(String(iv)).digest('hex').substr(0, 16)
    const cipher = crypto.createCipheriv(algorithm, keystring, ivv)
    const encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
    return encrypted
}

console.log('encryptText vs encryptText2')

console.log(
    'Before:',
    encryptText('test', 'cat', 'bat')
)

function encryptText2(text, key, iv) {
    let keystring = CryptoJS.SHA256(String(key)).toString(CryptoJS.enc.Hex).substring(0, 32)
    let ivv = CryptoJS.SHA256(String(iv)).toString(CryptoJS.enc.Hex).substring(0, 16)
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(keystring), {
        iv: CryptoJS.enc.Utf8.parse(ivv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })

    return encrypted.toString()
}

console.log(
    'After: ',
    encryptText2('test', 'cat', 'bat')
)

function decryptText(encryptedText, key, iv, algorithm='aes-256-cbc'){
    let keystringBuffer = crypto.createHash('sha256').update(String(key)).digest('hex').substring(0, 32)
    let ivvBuffer = crypto.createHash('sha256').update(String(iv)).digest('hex').substring(0, 16)

    let decipherBuffer = crypto.createDecipheriv(algorithm, keystringBuffer, ivvBuffer)

    let decBuffer = decipherBuffer.update(encryptedText, 'base64', 'utf8')
    decBuffer += decipherBuffer.final()

    return decBuffer
}

function decryptText2(encryptedText, key, iv){
    let keystring = CryptoJS.SHA256(String(key)).toString(CryptoJS.enc.Hex).substring(0, 32)
    let ivv = CryptoJS.SHA256(String(iv)).toString(CryptoJS.enc.Hex).substring(0, 16)

    const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(keystring), {
        iv: CryptoJS.enc.Utf8.parse(ivv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
}

console.log('\ndecryptText vs decryptText2')

console.log('Before:', decryptText('Wn2DlOBavv7h6cVwJi5Vzw==', 'cat', 'bat'))
console.log('After: ', decryptText2('Wn2DlOBavv7h6cVwJi5Vzw==', 'cat', 'bat'))
