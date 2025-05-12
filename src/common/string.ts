export function isValid(s: any) {
    return s !== undefined && s !== null && typeof s === 'string'
}

export function isBlank(s?: string) {
    // 白空格字符: 空格(" "), Tab制表符(\t), 空操作符(\0), 垂直制表符(\v), 换页符(\f)
    // 行结束符: 换行符(\n), 回车符(\r)
    return s === undefined || s === null || s.trim().length === 0
}

export function generateRandomString(length: number = 17) {
    let randomString = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return randomString
}

export function generateUuid(): string {
    // 创建一个 16 字节的随机数组缓冲区
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer)

    // 将缓冲区转换为 UUID 的格式
    buffer[6] &= 0x0f
    buffer[6] |= 0x40
    buffer[8] &= 0x3f
    buffer[8] |= 0x80

    const hex = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
