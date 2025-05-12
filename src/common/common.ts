import { CipherTypeEnum, DigitalFormatEnum } from '../yeying/api/common/code_pb'

export function convertToAlgorithmName(type: CipherTypeEnum): string {
    switch (type) {
        case CipherTypeEnum.CIPHER_TYPE_AES_GCM_256:
            return 'AES-GCM'
        default:
            return 'AES-GCM'
    }
}

export function getDigitalFormatByName(name: string) {
    const digitalFormat = Object.values(DigitalFormatEnum).find((t) => {
        const extList = getExtListByDigitalFormat(t as DigitalFormatEnum)
        const exist = extList.find((e) => name !== undefined && name.endsWith(e))
        return exist !== undefined
    })
    return digitalFormat === undefined ? DigitalFormatEnum.DIGITAL_FORMAT_OTHER : (digitalFormat as DigitalFormatEnum)
}

export function getExtListByDigitalFormat(format: DigitalFormatEnum) {
    switch (format) {
        case DigitalFormatEnum.DIGITAL_FORMAT_IMAGE:
            return ['.jpg', 'jpeg', '.gif', '.png', 'webp']
        case DigitalFormatEnum.DIGITAL_FORMAT_VIDEO:
            return ['.mp4', '.avi', '.mov', '.flv']
        case DigitalFormatEnum.DIGITAL_FORMAT_AUDIO:
            return ['.mp3', '.wav', '.ogg']
        case DigitalFormatEnum.DIGITAL_FORMAT_TEXT:
            return ['.txt', '.csv', '.html', '.css']
        case DigitalFormatEnum.DIGITAL_FORMAT_APP:
            return ['.id', '.session', '.app', '.metadata', '.state', '.prompt']
        case DigitalFormatEnum.DIGITAL_FORMAT_OTHER:
            return []
        default:
            return []
    }
}
