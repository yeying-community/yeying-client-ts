export function composite(...arrays: Uint8Array[]): Uint8Array {
    // 计算所有数组的总长度
    const totalLength = arrays.reduce((acc, curr) => acc + curr.length, 0)

    // 创建一个新的 Uint8Array 来存储所有数组的合并结果
    const result = new Uint8Array(totalLength)

    // 用于跟踪写入位置的偏移量
    let offset = 0

    // 迭代每个数组并将其内容复制到结果数组中
    for (const array of arrays) {
        result.set(array, offset)
        offset += array.length
    }

    return result
}
