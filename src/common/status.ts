import { ResponseStatus } from '../yeying/api/common/message_pb'
import { ResponseCodeEnum } from '../yeying/api/common/code_pb'
import {
    AlreadyExist,
    InvalidArgument,
    NoPermission,
    NotFound,
    NotSupported,
    ServiceUnavailable,
    UnknownError
} from './error'

export function convertResponseStatusToError(status: ResponseStatus): Error {
    switch (status.code) {
        case ResponseCodeEnum.ALREADY_EXISTS:
            return new AlreadyExist(status.message)
        case ResponseCodeEnum.INVALID_ARGUMENT:
            return new InvalidArgument(status.message)
        case ResponseCodeEnum.NOT_FOUND:
            return new NotFound(status.message)
        case ResponseCodeEnum.UNAVAILABLE:
            return new ServiceUnavailable(status.message)
        case ResponseCodeEnum.NOT_SUPPORTED:
            return new NotSupported(status.message)
        case ResponseCodeEnum.PERMISSION_DENIED:
            return new NoPermission(status.message)
        default:
            return new UnknownError(status.message)
    }
}

export function isOk(status?: ResponseStatus) {
    return status !== undefined && status.code === ResponseCodeEnum.OK
}

export function isExisted(status?: ResponseStatus) {
    return (
        status !== undefined && (status.code === ResponseCodeEnum.OK || status.code === ResponseCodeEnum.ALREADY_EXISTS)
    )
}

export function isDeleted(status?: ResponseStatus) {
    return status !== undefined && (status.code === ResponseCodeEnum.OK || status.code === ResponseCodeEnum.NOT_FOUND)
}
