import { TaskStatusEnumJson } from "../../../yeying/api/correction/imagecontent_pb"

export type TaskListCondition = {
    did?: string
    taskName?: string
    tagUid?: string, 
    startTime?: bigint, 
    endTime?: bigint, 
    status?: TaskStatusEnumJson
}