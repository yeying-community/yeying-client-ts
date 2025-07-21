import {
    AuditMetadataSchema,
} from '../yeying/api/audit/audit_pb'
import { create } from '@bufbuild/protobuf'

export function convertAuditMetadataFrom(
    appOrServiceMetadata: string,
    applicant: string,
    approver: string,
) {
    return create(AuditMetadataSchema, {
        appOrServiceMetadata: appOrServiceMetadata,
        applicant: applicant,
        approver: approver,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reason: '申请应用会员权限',
        signature: 'signature'
    })
}
