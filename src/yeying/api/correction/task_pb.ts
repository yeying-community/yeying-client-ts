// @generated by protoc-gen-es v2.2.3 with parameter "target=ts,json_types=true"
// @generated from file yeying/api/correction/task.proto (package yeying.api.correction, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { MessageHeader, MessageHeaderJson, RequestPage, RequestPageJson, ResponsePage, ResponsePageJson, ResponseStatus, ResponseStatusJson } from "../common/message_pb";
import { file_yeying_api_common_message } from "../common/message_pb";
import { file_google_protobuf_wrappers } from "@bufbuild/protobuf/wkt";
import { file_yeying_api_correction_imagecontent } from "./imagecontent_pb";
import type { GroupMetaData, GroupMetaDataJson, TagCountMeta, TagCountMetaJson, TaskMetadata, TaskMetadataJson } from "./meta_pb";
import { file_yeying_api_correction_meta } from "./meta_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file yeying/api/correction/task.proto.
 */
export const file_yeying_api_correction_task: GenFile = /*@__PURE__*/
  fileDesc("CiB5ZXlpbmcvYXBpL2NvcnJlY3Rpb24vdGFzay5wcm90bxIVeWV5aW5nLmFwaS5jb3JyZWN0aW9uInsKDkFkZFRhc2tSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISNwoEYm9keRgCIAEoCzIpLnlleWluZy5hcGkuY29ycmVjdGlvbi5BZGRUYXNrUmVxdWVzdEJvZHkiRwoSQWRkVGFza1JlcXVlc3RCb2R5EjEKBG1ldGEYASABKAsyIy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVGFza01ldGFkYXRhIn0KD0FkZFRhc2tSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjgKBGJvZHkYAiABKAsyKi55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uQWRkVGFza1Jlc3BvbnNlQm9keSJ7ChNBZGRUYXNrUmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzEjEKBG1ldGEYAiABKAsyIy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVGFza01ldGFkYXRhIoEBChFEZXRhaWxUYXNrUmVxdWVzdBIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjoKBGJvZHkYAiABKAsyLC55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uRGV0YWlsVGFza1JlcXVlc3RCb2R5IiQKFURldGFpbFRhc2tSZXF1ZXN0Qm9keRILCgN1aWQYASABKAkigwEKEkRldGFpbFRhc2tSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjsKBGJvZHkYAiABKAsyLS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uRGV0YWlsVGFza1Jlc3BvbnNlQm9keSK5AQoWRGV0YWlsVGFza1Jlc3BvbnNlQm9keRIxCgZzdGF0dXMYASABKAsyIS55ZXlpbmcuYXBpLmNvbW1vbi5SZXNwb25zZVN0YXR1cxIxCgRtZXRhGAIgASgLMiMueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlRhc2tNZXRhZGF0YRI5CgtzdHVkZW50TGlzdBgDIAMoCzIkLnlleWluZy5hcGkuY29ycmVjdGlvbi5Hcm91cE1ldGFEYXRhIn0KD0xpc3RUYXNrUmVxdWVzdBIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjgKBGJvZHkYAiABKAsyKi55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTGlzdFRhc2tSZXF1ZXN0Qm9keSKAAQoTTGlzdFRhc2tSZXF1ZXN0Qm9keRI7Cgljb25kaXRpb24YASABKAsyKC55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVGFza0xpc3RDb25kaXRpb24SLAoEcGFnZRgCIAEoCzIeLnlleWluZy5hcGkuY29tbW9uLlJlcXVlc3RQYWdlIn8KEExpc3RUYXNrUmVzcG9uc2USMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchI5CgRib2R5GAIgASgLMisueWV5aW5nLmFwaS5jb3JyZWN0aW9uLkxpc3RUYXNrUmVzcG9uc2VCb2R5IqsBChRMaXN0VGFza1Jlc3BvbnNlQm9keRIxCgZzdGF0dXMYASABKAsyIS55ZXlpbmcuYXBpLmNvbW1vbi5SZXNwb25zZVN0YXR1cxIxCgRsaXN0GAIgAygLMiMueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlRhc2tNZXRhZGF0YRItCgRwYWdlGAMgASgLMh8ueWV5aW5nLmFwaS5jb21tb24uUmVzcG9uc2VQYWdlIoUBChNUYWdDb3VudFRhc2tSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPAoEYm9keRgCIAEoCzIuLnlleWluZy5hcGkuY29ycmVjdGlvbi5UYWdDb3VudFRhc2tSZXF1ZXN0Qm9keSImChdUYWdDb3VudFRhc2tSZXF1ZXN0Qm9keRILCgNkaWQYASABKAkihwEKFFRhZ0NvdW50VGFza1Jlc3BvbnNlEjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPQoEYm9keRgCIAEoCzIvLnlleWluZy5hcGkuY29ycmVjdGlvbi5UYWdDb3VudFRhc2tSZXNwb25zZUJvZHkigAEKGFRhZ0NvdW50VGFza1Jlc3BvbnNlQm9keRIxCgZzdGF0dXMYASABKAsyIS55ZXlpbmcuYXBpLmNvbW1vbi5SZXNwb25zZVN0YXR1cxIxCgRtZXRhGAIgAygLMiMueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlRhZ0NvdW50TWV0YSKBAQoRVXBkYXRlVGFza1JlcXVlc3QSMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchI6CgRib2R5GAIgASgLMiwueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlVwZGF0ZVRhc2tSZXF1ZXN0Qm9keSJKChVVcGRhdGVUYXNrUmVxdWVzdEJvZHkSMQoEbWV0YRgBIAEoCzIjLnlleWluZy5hcGkuY29ycmVjdGlvbi5UYXNrTWV0YWRhdGEigwEKElVwZGF0ZVRhc2tSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjsKBGJvZHkYAiABKAsyLS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVXBkYXRlVGFza1Jlc3BvbnNlQm9keSJ+ChZVcGRhdGVUYXNrUmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzEjEKBG1ldGEYAiABKAsyIy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVGFza01ldGFkYXRhIoEBChFEZWxldGVUYXNrUmVxdWVzdBIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjoKBGJvZHkYAiABKAsyLC55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uRGVsZXRlVGFza1JlcXVlc3RCb2R5IiQKFURlbGV0ZVRhc2tSZXF1ZXN0Qm9keRILCgN1aWQYASABKAkigwEKEkRlbGV0ZVRhc2tSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEjsKBGJvZHkYAiABKAsyLS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uRGVsZXRlVGFza1Jlc3BvbnNlQm9keSJ+ChZEZWxldGVUYXNrUmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzEjEKBG1ldGEYAiABKAsyIy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uVGFza01ldGFkYXRhIosBChFUYXNrTGlzdENvbmRpdGlvbhILCgNkaWQYASABKAkSEAoIdGFza05hbWUYAiABKAkSDgoGdGFnVWlkGAMgASgJEg4KBnN0YXR1cxgEIAEoBRIRCglzdGFydFRpbWUYBSABKAMSDwoHZW5kVGltZRgGIAEoAxITCgtkZXNjcmlwdGlvbhgHIAEoCTLDBAoEVGFzaxJWCgNBZGQSJS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uQWRkVGFza1JlcXVlc3QaJi55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uQWRkVGFza1Jlc3BvbnNlIgASXwoGRGV0YWlsEigueWV5aW5nLmFwaS5jb3JyZWN0aW9uLkRldGFpbFRhc2tSZXF1ZXN0GikueWV5aW5nLmFwaS5jb3JyZWN0aW9uLkRldGFpbFRhc2tSZXNwb25zZSIAElkKBExpc3QSJi55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTGlzdFRhc2tSZXF1ZXN0GicueWV5aW5nLmFwaS5jb3JyZWN0aW9uLkxpc3RUYXNrUmVzcG9uc2UiABJlCghUYWdDb3VudBIqLnlleWluZy5hcGkuY29ycmVjdGlvbi5UYWdDb3VudFRhc2tSZXF1ZXN0GisueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlRhZ0NvdW50VGFza1Jlc3BvbnNlIgASXwoGVXBkYXRlEigueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlVwZGF0ZVRhc2tSZXF1ZXN0GikueWV5aW5nLmFwaS5jb3JyZWN0aW9uLlVwZGF0ZVRhc2tSZXNwb25zZSIAEl8KBkRlbGV0ZRIoLnlleWluZy5hcGkuY29ycmVjdGlvbi5EZWxldGVUYXNrUmVxdWVzdBopLnlleWluZy5hcGkuY29ycmVjdGlvbi5EZWxldGVUYXNrUmVzcG9uc2UiAEIXWhV5ZXlpbmcvYXBpL2NvcnJlY3Rpb25iBnByb3RvMw", [file_yeying_api_common_message, file_google_protobuf_wrappers, file_yeying_api_correction_imagecontent, file_yeying_api_correction_meta]);

/**
 * Add
 *
 * @generated from message yeying.api.correction.AddTaskRequest
 */
export type AddTaskRequest = Message<"yeying.api.correction.AddTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.AddTaskRequestBody body = 2;
   */
  body?: AddTaskRequestBody;
};

/**
 * Add
 *
 * @generated from message yeying.api.correction.AddTaskRequest
 */
export type AddTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.AddTaskRequestBody body = 2;
   */
  body?: AddTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.AddTaskRequest.
 * Use `create(AddTaskRequestSchema)` to create a new message.
 */
export const AddTaskRequestSchema: GenMessage<AddTaskRequest, AddTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 0);

/**
 * @generated from message yeying.api.correction.AddTaskRequestBody
 */
export type AddTaskRequestBody = Message<"yeying.api.correction.AddTaskRequestBody"> & {
  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 1;
   */
  meta?: TaskMetadata;
};

/**
 * @generated from message yeying.api.correction.AddTaskRequestBody
 */
export type AddTaskRequestBodyJson = {
  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 1;
   */
  meta?: TaskMetadataJson;
};

/**
 * Describes the message yeying.api.correction.AddTaskRequestBody.
 * Use `create(AddTaskRequestBodySchema)` to create a new message.
 */
export const AddTaskRequestBodySchema: GenMessage<AddTaskRequestBody, AddTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 1);

/**
 * @generated from message yeying.api.correction.AddTaskResponse
 */
export type AddTaskResponse = Message<"yeying.api.correction.AddTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.AddTaskResponseBody body = 2;
   */
  body?: AddTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.AddTaskResponse
 */
export type AddTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.AddTaskResponseBody body = 2;
   */
  body?: AddTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.AddTaskResponse.
 * Use `create(AddTaskResponseSchema)` to create a new message.
 */
export const AddTaskResponseSchema: GenMessage<AddTaskResponse, AddTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 2);

/**
 * @generated from message yeying.api.correction.AddTaskResponseBody
 */
export type AddTaskResponseBody = Message<"yeying.api.correction.AddTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadata;
};

/**
 * @generated from message yeying.api.correction.AddTaskResponseBody
 */
export type AddTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadataJson;
};

/**
 * Describes the message yeying.api.correction.AddTaskResponseBody.
 * Use `create(AddTaskResponseBodySchema)` to create a new message.
 */
export const AddTaskResponseBodySchema: GenMessage<AddTaskResponseBody, AddTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 3);

/**
 * Detail
 *
 * @generated from message yeying.api.correction.DetailTaskRequest
 */
export type DetailTaskRequest = Message<"yeying.api.correction.DetailTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.DetailTaskRequestBody body = 2;
   */
  body?: DetailTaskRequestBody;
};

/**
 * Detail
 *
 * @generated from message yeying.api.correction.DetailTaskRequest
 */
export type DetailTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.DetailTaskRequestBody body = 2;
   */
  body?: DetailTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.DetailTaskRequest.
 * Use `create(DetailTaskRequestSchema)` to create a new message.
 */
export const DetailTaskRequestSchema: GenMessage<DetailTaskRequest, DetailTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 4);

/**
 * @generated from message yeying.api.correction.DetailTaskRequestBody
 */
export type DetailTaskRequestBody = Message<"yeying.api.correction.DetailTaskRequestBody"> & {
  /**
   * @generated from field: string uid = 1;
   */
  uid: string;
};

/**
 * @generated from message yeying.api.correction.DetailTaskRequestBody
 */
export type DetailTaskRequestBodyJson = {
  /**
   * @generated from field: string uid = 1;
   */
  uid?: string;
};

/**
 * Describes the message yeying.api.correction.DetailTaskRequestBody.
 * Use `create(DetailTaskRequestBodySchema)` to create a new message.
 */
export const DetailTaskRequestBodySchema: GenMessage<DetailTaskRequestBody, DetailTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 5);

/**
 * @generated from message yeying.api.correction.DetailTaskResponse
 */
export type DetailTaskResponse = Message<"yeying.api.correction.DetailTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.DetailTaskResponseBody body = 2;
   */
  body?: DetailTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.DetailTaskResponse
 */
export type DetailTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.DetailTaskResponseBody body = 2;
   */
  body?: DetailTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.DetailTaskResponse.
 * Use `create(DetailTaskResponseSchema)` to create a new message.
 */
export const DetailTaskResponseSchema: GenMessage<DetailTaskResponse, DetailTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 6);

/**
 * @generated from message yeying.api.correction.DetailTaskResponseBody
 */
export type DetailTaskResponseBody = Message<"yeying.api.correction.DetailTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadata;

  /**
   * 关联学生列表
   *
   * @generated from field: repeated yeying.api.correction.GroupMetaData studentList = 3;
   */
  studentList: GroupMetaData[];
};

/**
 * @generated from message yeying.api.correction.DetailTaskResponseBody
 */
export type DetailTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadataJson;

  /**
   * 关联学生列表
   *
   * @generated from field: repeated yeying.api.correction.GroupMetaData studentList = 3;
   */
  studentList?: GroupMetaDataJson[];
};

/**
 * Describes the message yeying.api.correction.DetailTaskResponseBody.
 * Use `create(DetailTaskResponseBodySchema)` to create a new message.
 */
export const DetailTaskResponseBodySchema: GenMessage<DetailTaskResponseBody, DetailTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 7);

/**
 * List
 *
 * @generated from message yeying.api.correction.ListTaskRequest
 */
export type ListTaskRequest = Message<"yeying.api.correction.ListTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.ListTaskRequestBody body = 2;
   */
  body?: ListTaskRequestBody;
};

/**
 * List
 *
 * @generated from message yeying.api.correction.ListTaskRequest
 */
export type ListTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.ListTaskRequestBody body = 2;
   */
  body?: ListTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.ListTaskRequest.
 * Use `create(ListTaskRequestSchema)` to create a new message.
 */
export const ListTaskRequestSchema: GenMessage<ListTaskRequest, ListTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 8);

/**
 * @generated from message yeying.api.correction.ListTaskRequestBody
 */
export type ListTaskRequestBody = Message<"yeying.api.correction.ListTaskRequestBody"> & {
  /**
   * @generated from field: yeying.api.correction.TaskListCondition condition = 1;
   */
  condition?: TaskListCondition;

  /**
   * @generated from field: yeying.api.common.RequestPage page = 2;
   */
  page?: RequestPage;
};

/**
 * @generated from message yeying.api.correction.ListTaskRequestBody
 */
export type ListTaskRequestBodyJson = {
  /**
   * @generated from field: yeying.api.correction.TaskListCondition condition = 1;
   */
  condition?: TaskListConditionJson;

  /**
   * @generated from field: yeying.api.common.RequestPage page = 2;
   */
  page?: RequestPageJson;
};

/**
 * Describes the message yeying.api.correction.ListTaskRequestBody.
 * Use `create(ListTaskRequestBodySchema)` to create a new message.
 */
export const ListTaskRequestBodySchema: GenMessage<ListTaskRequestBody, ListTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 9);

/**
 * @generated from message yeying.api.correction.ListTaskResponse
 */
export type ListTaskResponse = Message<"yeying.api.correction.ListTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.ListTaskResponseBody body = 2;
   */
  body?: ListTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.ListTaskResponse
 */
export type ListTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.ListTaskResponseBody body = 2;
   */
  body?: ListTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.ListTaskResponse.
 * Use `create(ListTaskResponseSchema)` to create a new message.
 */
export const ListTaskResponseSchema: GenMessage<ListTaskResponse, ListTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 10);

/**
 * @generated from message yeying.api.correction.ListTaskResponseBody
 */
export type ListTaskResponseBody = Message<"yeying.api.correction.ListTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * repeated 表示 List
   *
   * @generated from field: repeated yeying.api.correction.TaskMetadata list = 2;
   */
  list: TaskMetadata[];

  /**
   * @generated from field: yeying.api.common.ResponsePage page = 3;
   */
  page?: ResponsePage;
};

/**
 * @generated from message yeying.api.correction.ListTaskResponseBody
 */
export type ListTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * repeated 表示 List
   *
   * @generated from field: repeated yeying.api.correction.TaskMetadata list = 2;
   */
  list?: TaskMetadataJson[];

  /**
   * @generated from field: yeying.api.common.ResponsePage page = 3;
   */
  page?: ResponsePageJson;
};

/**
 * Describes the message yeying.api.correction.ListTaskResponseBody.
 * Use `create(ListTaskResponseBodySchema)` to create a new message.
 */
export const ListTaskResponseBodySchema: GenMessage<ListTaskResponseBody, ListTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 11);

/**
 * tag 名下的任务数量
 *
 * @generated from message yeying.api.correction.TagCountTaskRequest
 */
export type TagCountTaskRequest = Message<"yeying.api.correction.TagCountTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.TagCountTaskRequestBody body = 2;
   */
  body?: TagCountTaskRequestBody;
};

/**
 * tag 名下的任务数量
 *
 * @generated from message yeying.api.correction.TagCountTaskRequest
 */
export type TagCountTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.TagCountTaskRequestBody body = 2;
   */
  body?: TagCountTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.TagCountTaskRequest.
 * Use `create(TagCountTaskRequestSchema)` to create a new message.
 */
export const TagCountTaskRequestSchema: GenMessage<TagCountTaskRequest, TagCountTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 12);

/**
 * @generated from message yeying.api.correction.TagCountTaskRequestBody
 */
export type TagCountTaskRequestBody = Message<"yeying.api.correction.TagCountTaskRequestBody"> & {
  /**
   * 登录用户did
   *
   * @generated from field: string did = 1;
   */
  did: string;
};

/**
 * @generated from message yeying.api.correction.TagCountTaskRequestBody
 */
export type TagCountTaskRequestBodyJson = {
  /**
   * 登录用户did
   *
   * @generated from field: string did = 1;
   */
  did?: string;
};

/**
 * Describes the message yeying.api.correction.TagCountTaskRequestBody.
 * Use `create(TagCountTaskRequestBodySchema)` to create a new message.
 */
export const TagCountTaskRequestBodySchema: GenMessage<TagCountTaskRequestBody, TagCountTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 13);

/**
 * @generated from message yeying.api.correction.TagCountTaskResponse
 */
export type TagCountTaskResponse = Message<"yeying.api.correction.TagCountTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.TagCountTaskResponseBody body = 2;
   */
  body?: TagCountTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.TagCountTaskResponse
 */
export type TagCountTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.TagCountTaskResponseBody body = 2;
   */
  body?: TagCountTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.TagCountTaskResponse.
 * Use `create(TagCountTaskResponseSchema)` to create a new message.
 */
export const TagCountTaskResponseSchema: GenMessage<TagCountTaskResponse, TagCountTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 14);

/**
 * @generated from message yeying.api.correction.TagCountTaskResponseBody
 */
export type TagCountTaskResponseBody = Message<"yeying.api.correction.TagCountTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: repeated yeying.api.correction.TagCountMeta meta = 2;
   */
  meta: TagCountMeta[];
};

/**
 * @generated from message yeying.api.correction.TagCountTaskResponseBody
 */
export type TagCountTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: repeated yeying.api.correction.TagCountMeta meta = 2;
   */
  meta?: TagCountMetaJson[];
};

/**
 * Describes the message yeying.api.correction.TagCountTaskResponseBody.
 * Use `create(TagCountTaskResponseBodySchema)` to create a new message.
 */
export const TagCountTaskResponseBodySchema: GenMessage<TagCountTaskResponseBody, TagCountTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 15);

/**
 * Update
 *
 * @generated from message yeying.api.correction.UpdateTaskRequest
 */
export type UpdateTaskRequest = Message<"yeying.api.correction.UpdateTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.UpdateTaskRequestBody body = 2;
   */
  body?: UpdateTaskRequestBody;
};

/**
 * Update
 *
 * @generated from message yeying.api.correction.UpdateTaskRequest
 */
export type UpdateTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.UpdateTaskRequestBody body = 2;
   */
  body?: UpdateTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.UpdateTaskRequest.
 * Use `create(UpdateTaskRequestSchema)` to create a new message.
 */
export const UpdateTaskRequestSchema: GenMessage<UpdateTaskRequest, UpdateTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 16);

/**
 * @generated from message yeying.api.correction.UpdateTaskRequestBody
 */
export type UpdateTaskRequestBody = Message<"yeying.api.correction.UpdateTaskRequestBody"> & {
  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 1;
   */
  meta?: TaskMetadata;
};

/**
 * @generated from message yeying.api.correction.UpdateTaskRequestBody
 */
export type UpdateTaskRequestBodyJson = {
  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 1;
   */
  meta?: TaskMetadataJson;
};

/**
 * Describes the message yeying.api.correction.UpdateTaskRequestBody.
 * Use `create(UpdateTaskRequestBodySchema)` to create a new message.
 */
export const UpdateTaskRequestBodySchema: GenMessage<UpdateTaskRequestBody, UpdateTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 17);

/**
 * @generated from message yeying.api.correction.UpdateTaskResponse
 */
export type UpdateTaskResponse = Message<"yeying.api.correction.UpdateTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.UpdateTaskResponseBody body = 2;
   */
  body?: UpdateTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.UpdateTaskResponse
 */
export type UpdateTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.UpdateTaskResponseBody body = 2;
   */
  body?: UpdateTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.UpdateTaskResponse.
 * Use `create(UpdateTaskResponseSchema)` to create a new message.
 */
export const UpdateTaskResponseSchema: GenMessage<UpdateTaskResponse, UpdateTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 18);

/**
 * @generated from message yeying.api.correction.UpdateTaskResponseBody
 */
export type UpdateTaskResponseBody = Message<"yeying.api.correction.UpdateTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadata;
};

/**
 * @generated from message yeying.api.correction.UpdateTaskResponseBody
 */
export type UpdateTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadataJson;
};

/**
 * Describes the message yeying.api.correction.UpdateTaskResponseBody.
 * Use `create(UpdateTaskResponseBodySchema)` to create a new message.
 */
export const UpdateTaskResponseBodySchema: GenMessage<UpdateTaskResponseBody, UpdateTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 19);

/**
 * Delete
 *
 * @generated from message yeying.api.correction.DeleteTaskRequest
 */
export type DeleteTaskRequest = Message<"yeying.api.correction.DeleteTaskRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.DeleteTaskRequestBody body = 2;
   */
  body?: DeleteTaskRequestBody;
};

/**
 * Delete
 *
 * @generated from message yeying.api.correction.DeleteTaskRequest
 */
export type DeleteTaskRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.DeleteTaskRequestBody body = 2;
   */
  body?: DeleteTaskRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.DeleteTaskRequest.
 * Use `create(DeleteTaskRequestSchema)` to create a new message.
 */
export const DeleteTaskRequestSchema: GenMessage<DeleteTaskRequest, DeleteTaskRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 20);

/**
 * @generated from message yeying.api.correction.DeleteTaskRequestBody
 */
export type DeleteTaskRequestBody = Message<"yeying.api.correction.DeleteTaskRequestBody"> & {
  /**
   * @generated from field: string uid = 1;
   */
  uid: string;
};

/**
 * @generated from message yeying.api.correction.DeleteTaskRequestBody
 */
export type DeleteTaskRequestBodyJson = {
  /**
   * @generated from field: string uid = 1;
   */
  uid?: string;
};

/**
 * Describes the message yeying.api.correction.DeleteTaskRequestBody.
 * Use `create(DeleteTaskRequestBodySchema)` to create a new message.
 */
export const DeleteTaskRequestBodySchema: GenMessage<DeleteTaskRequestBody, DeleteTaskRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 21);

/**
 * @generated from message yeying.api.correction.DeleteTaskResponse
 */
export type DeleteTaskResponse = Message<"yeying.api.correction.DeleteTaskResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.DeleteTaskResponseBody body = 2;
   */
  body?: DeleteTaskResponseBody;
};

/**
 * @generated from message yeying.api.correction.DeleteTaskResponse
 */
export type DeleteTaskResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.DeleteTaskResponseBody body = 2;
   */
  body?: DeleteTaskResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.DeleteTaskResponse.
 * Use `create(DeleteTaskResponseSchema)` to create a new message.
 */
export const DeleteTaskResponseSchema: GenMessage<DeleteTaskResponse, DeleteTaskResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 22);

/**
 * @generated from message yeying.api.correction.DeleteTaskResponseBody
 */
export type DeleteTaskResponseBody = Message<"yeying.api.correction.DeleteTaskResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadata;
};

/**
 * @generated from message yeying.api.correction.DeleteTaskResponseBody
 */
export type DeleteTaskResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.TaskMetadata meta = 2;
   */
  meta?: TaskMetadataJson;
};

/**
 * Describes the message yeying.api.correction.DeleteTaskResponseBody.
 * Use `create(DeleteTaskResponseBodySchema)` to create a new message.
 */
export const DeleteTaskResponseBodySchema: GenMessage<DeleteTaskResponseBody, DeleteTaskResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 23);

/**
 * @generated from message yeying.api.correction.TaskListCondition
 */
export type TaskListCondition = Message<"yeying.api.correction.TaskListCondition"> & {
  /**
   * @generated from field: string did = 1;
   */
  did: string;

  /**
   * @generated from field: string taskName = 2;
   */
  taskName: string;

  /**
   * @generated from field: string tagUid = 3;
   */
  tagUid: string;

  /**
   * 任务状态
   *
   * @generated from field: int32 status = 4;
   */
  status: number;

  /**
   * 开始时间
   *
   * @generated from field: int64 startTime = 5;
   */
  startTime: bigint;

  /**
   * 结束时间
   *
   * @generated from field: int64 endTime = 6;
   */
  endTime: bigint;

  /**
   * @generated from field: string description = 7;
   */
  description: string;
};

/**
 * @generated from message yeying.api.correction.TaskListCondition
 */
export type TaskListConditionJson = {
  /**
   * @generated from field: string did = 1;
   */
  did?: string;

  /**
   * @generated from field: string taskName = 2;
   */
  taskName?: string;

  /**
   * @generated from field: string tagUid = 3;
   */
  tagUid?: string;

  /**
   * 任务状态
   *
   * @generated from field: int32 status = 4;
   */
  status?: number;

  /**
   * 开始时间
   *
   * @generated from field: int64 startTime = 5;
   */
  startTime?: string;

  /**
   * 结束时间
   *
   * @generated from field: int64 endTime = 6;
   */
  endTime?: string;

  /**
   * @generated from field: string description = 7;
   */
  description?: string;
};

/**
 * Describes the message yeying.api.correction.TaskListCondition.
 * Use `create(TaskListConditionSchema)` to create a new message.
 */
export const TaskListConditionSchema: GenMessage<TaskListCondition, TaskListConditionJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_task, 24);

/**
 * *
 * 老师教学任务管理
 * 对应的 DB 表：correction.teaching_tasks
 *
 * @generated from service yeying.api.correction.Task
 */
export const Task: GenService<{
  /**
   * 创建任务：由老师负创建教学任务
   *
   * @generated from rpc yeying.api.correction.Task.Add
   */
  add: {
    methodKind: "unary";
    input: typeof AddTaskRequestSchema;
    output: typeof AddTaskResponseSchema;
  },
  /**
   * 任务详情
   *
   * @generated from rpc yeying.api.correction.Task.Detail
   */
  detail: {
    methodKind: "unary";
    input: typeof DetailTaskRequestSchema;
    output: typeof DetailTaskResponseSchema;
  },
  /**
   * 查询老师名下总的任务列表
   *
   * @generated from rpc yeying.api.correction.Task.List
   */
  list: {
    methodKind: "unary";
    input: typeof ListTaskRequestSchema;
    output: typeof ListTaskResponseSchema;
  },
  /**
   * 查询老师名下创建的 tag 名下对应的任务数量
   *
   * @generated from rpc yeying.api.correction.Task.TagCount
   */
  tagCount: {
    methodKind: "unary";
    input: typeof TagCountTaskRequestSchema;
    output: typeof TagCountTaskResponseSchema;
  },
  /**
   * 更新任务
   *
   * @generated from rpc yeying.api.correction.Task.Update
   */
  update: {
    methodKind: "unary";
    input: typeof UpdateTaskRequestSchema;
    output: typeof UpdateTaskResponseSchema;
  },
  /**
   * 删除任务
   *
   * @generated from rpc yeying.api.correction.Task.Delete
   */
  delete: {
    methodKind: "unary";
    input: typeof DeleteTaskRequestSchema;
    output: typeof DeleteTaskResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_yeying_api_correction_task, 0);

