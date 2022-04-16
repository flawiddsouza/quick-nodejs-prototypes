function textToBuffer(text) {
    const encoder = new TextEncoder()
    return encoder.encode(text)
}

function bufferToText(buffer) {
    const decoder = new TextDecoder()
    return decoder.decode(buffer)
}

function bufferToBase64String(buffer) {
    return window.btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function base64StringToBuffer(base64String) {
    return Uint8Array.from(window.atob(base64String), c => c.charCodeAt(0))
}

async function getSHA256Hex(text) {
    const buffer = await window.crypto.subtle.digest('SHA-256', textToBuffer(text))
    // convert array buffer to byte array
    const hashArray = Array.from(new Uint8Array(buffer))
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}

async function createKeyString(text) {
    const hexString = await getSHA256Hex(text)
    return hexString.substring(0, 32)
}

async function createIvString(text) {
    const hexString = await getSHA256Hex(text)
    return hexString.substring(0, 16)
}

function getKey(key) {
    return window.crypto.subtle.importKey(
        'raw',
        textToBuffer(key),
        'AES-CBC',
        true,
        ['encrypt', 'decrypt']
    )
}

async function encryptText(text, key, iv) {
    const keyString = await createKeyString(key)
    const ivString = await createIvString(iv)
    const encryptedText = await window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv: textToBuffer(ivString)
        },
        await getKey(keyString),
        textToBuffer(text)
    )

    return bufferToBase64String(encryptedText)
}

async function decryptText(encryptedText, key, iv) {
    const keyString = await createKeyString(key)
    const ivString = await createIvString(iv)
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: textToBuffer(ivString)
        },
        await getKey(keyString),
        base64StringToBuffer(encryptedText)
    )


    return bufferToText(decryptedBuffer)
}

async function main() {
    const encryptedText = await encryptText('test', 'cat', 'bat')
    const decryptedText = await decryptText(encryptedText, 'cat', 'bat')
    console.log({ encryptedText, decryptedText })
}

main()
