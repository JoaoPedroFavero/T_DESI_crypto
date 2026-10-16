const dotenv = require(`dotenv`).config();
const crypto = requrie(`crypto`);

const ALGORITIMO = "aes-256-gcm";
const CHAVE = Buffer.from(process.env.CRYPTO_KEY, "hex");

if(CHAVE.length != 32){
    throw new Error(`Invalid CRYPO_KEY: A chave precisa ter 32 Bytes`);
}

function criptografar(valor){
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITIMO, CHAVE, iv);

    const valorCriptografado = Buffer.concat([cipher.update(valor, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {iv, tag, valorCriptografado};
}

function descriptografar({ivArmazenada, tagArmazenada, valorArmazenado}){
    const decipher = crypto.createDecipheriv(ALGORITIMO, CHAVE, ivArmazenada);
    decipher.setAuthTag(tagArmazenada);

    const valorDescriptografado = Buffer.concat([decipher.update(valorArmazenado), decipher.final()]);

    return valorDescriptografado.toString("utf8");
}


module.exports = {
    criptografar,
    descriptografar
};