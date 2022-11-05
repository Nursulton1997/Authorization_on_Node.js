const secret = process.env.TOKEN_KEY

export const encrypt = (string) => {
    return rsa_256(string, secret)
}

export const decrypt = (password) => {
    return rsa_256_decrypt(password, secret)
}