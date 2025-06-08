import { AuditStatus, CanceledStatus, PassedStatus, PendingStatus, RejectStatus } from "../yeying/api/audit/audit_pb";


/**
 * 类型守卫函数
 * 判断是否审核中
 * @param status 
 * @returns 
 */
export function isPending(status: AuditStatus) {
    return status.status?.case === "pending";
}

/**
 * 类型守卫函数
 * 判断是否取消申请
 * @param status 
 * @returns 
 */
export function isCanceled(status: AuditStatus) {
    return status.status?.case === "canceled";
}

/**
 * 类型守卫函数
 * 判断是否通过
 * @param status 
 * @returns 
 */
export function isPassed(status: AuditStatus) {
    return status.status?.case === "passed";
}


/**
 * 类型守卫函数
 * 判断是否拒绝
 * @param status 
 * @returns 
 */
export function isReject(status: AuditStatus) {
    return status.status?.case === "reject";
}


// 创建 Pending 状态
export const pendingStatus: AuditStatus = {
    status: {
        case: "pending",
        value: {
            text: "申请已提交，等待审核"
        }
    }
} as AuditStatus
  
// 创建 Canceled 状态
export const canceledStatus: AuditStatus = {
    status: {
        case: "canceled",
        value: {
            text: "用户已取消申请"
        }
    }
} as AuditStatus
  
// 创建 Passed 状态
export const passedStatus: AuditStatus = {
    status: {
        case: "passed",
        value: {
            text: "审核已通过"
        }
    }
} as AuditStatus
  
// 创建 Reject 状态
export const rejectStatus: AuditStatus = {
    status: {
        case: "reject",
        value: {
            text: "审核未通过，缺少必要材料"
        }
    }
} as AuditStatus


export function ofAuditStatus(status: string): AuditStatus {
    switch (status) {
        case "pending":
            return {
                status: {
                    case: "pending",
                    value: {
                        text: `申请已提交，等待审核`
                    }
                }
            } as AuditStatus
        case "canceled":
            return {
                status: {
                    case: "canceled",
                    value: {
                        text: `用户已取消申请`
                    }
                }
            } as AuditStatus
        case "passed":
            return {
                status: {
                    case: "passed",
                    value: {
                        text: `审核已通过`
                    }
                }
            } as AuditStatus
        case "reject":
            return {
                status: {
                    case: "reject",
                    value: {
                        text: `审核未通过，缺少必要材料`
                    }
                }
            } as AuditStatus
        default:
            throw Error("status not exists")
    }
}
