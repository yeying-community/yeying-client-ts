import { Identity, IdentityCodeEnum, NetworkTypeEnum } from '@yeying-community/yeying-web3'
import { ApplicationMetadataSchema, ServiceMetadataSchema } from '../yeying/api/common/model_pb'
import { create } from '@bufbuild/protobuf'
import { ApiCodeEnum, ApplicationCodeEnum, ServiceCodeEnum } from '../yeying/api/common/code_pb'

export function convertApplicationMetadataFromIdentity(identity: Identity) {
    const metadata = identity.metadata
    if (metadata === undefined) {
        throw new Error('invalid identity metadata!')
    }

    if (metadata.code !== IdentityCodeEnum.IDENTITY_CODE_APPLICATION) {
        throw new Error(`invalid identity code=${IdentityCodeEnum[metadata.code]}`)
    }

    const extend = identity.applicationExtend
    if (extend === undefined) {
        throw new Error('invalid identity extend!')
    }

    return create(ApplicationMetadataSchema, {
        network: NetworkTypeEnum[metadata.network],
        owner: metadata.parent,
        address: metadata.address,
        name: metadata.name,
        description: metadata.description,
        did: metadata.did,
        version: metadata.version,
        code: ApplicationCodeEnum[extend.code as keyof typeof ApplicationCodeEnum],
        serviceCodes: extend.serviceCodes.split(',').map((a) => ServiceCodeEnum[a as keyof typeof ServiceCodeEnum]),
        hash: extend.hash,
        location: extend.location,
        avatar: metadata.avatar,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
    })
}

export function convertServiceMetadataFromIdentity(identity: Identity) {
    const metadata = identity.metadata
    if (metadata === undefined) {
        throw new Error('invalid identity metadata!')
    }

    if (metadata.code !== IdentityCodeEnum.IDENTITY_CODE_SERVICE) {
        throw new Error(`invalid identity code=${IdentityCodeEnum[metadata.code]}`)
    }

    const extend = identity.serviceExtend
    if (extend === undefined) {
        throw new Error('invalid identity extend!')
    }

    return create(ServiceMetadataSchema, {
        network: NetworkTypeEnum[metadata.network],
        owner: metadata.parent,
        address: metadata.address,
        name: metadata.name,
        description: metadata.description,
        did: metadata.did,
        version: metadata.version,
        code: ServiceCodeEnum[extend.code as keyof typeof ServiceCodeEnum],
        apiCodes: extend.apiCodes.split(',').map((a) => ApiCodeEnum[a as keyof typeof ApiCodeEnum]),
        proxy: extend.proxy,
        grpc: extend.grpc,
        avatar: metadata.avatar,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
    })
}
