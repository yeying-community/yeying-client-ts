export enum ResultDataType {
    Text,
    ArrayBuffer,
    DataUrl
}

export function readFile(file: Blob, type: ResultDataType = ResultDataType.ArrayBuffer): Promise<Uint8Array | string> {
    return new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader()
        // 成功读取的回调函数
        reader.onload = () => {
            switch (type) {
                case ResultDataType.ArrayBuffer:
                    resolve(new Uint8Array(reader.result as ArrayBuffer))
                    break
                case ResultDataType.Text:
                    // @ts-ignore
                    resolve(reader.result as string)
                    break
                case ResultDataType.DataUrl:
                    // @ts-ignore
                    resolve(reader.result as string)
                    break
                default:
                    resolve(new Uint8Array(reader.result as ArrayBuffer))
                    break
            }
        }

        // 读取错误的回调函数
        reader.onerror = () => {
            reject(reader.error)
        }

        // 根据需要的格式读取文件
        switch (type) {
            case ResultDataType.ArrayBuffer:
                reader.readAsArrayBuffer(file)
                break
            case ResultDataType.DataUrl:
                reader.readAsDataURL(file) // 如果要读取为 Data URL
                break
            case ResultDataType.Text:
                reader.readAsText(file) // 如果你要读取为文本
                break
            default:
                reader.readAsArrayBuffer(file) // 如果要读取为 ArrayBuffer
                break
        }
    })
}

export async function readBlock(file: File, start: number, end: number) {
    const data = await readFile(file.slice(start, end), ResultDataType.ArrayBuffer)
    return data as Uint8Array
}
