// @generated by protoc-gen-es v2.2.3 with parameter "target=ts,json_types=true"
// @generated from file yeying/api/correction/mistakes.proto (package yeying.api.correction, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { MessageHeader, MessageHeaderJson, ResponseStatus, ResponseStatusJson } from "../common/message_pb";
import { file_yeying_api_common_message } from "../common/message_pb";
import type { MistakesMetadata, MistakesMetadataJson } from "./meta_pb";
import { file_yeying_api_correction_meta } from "./meta_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file yeying/api/correction/mistakes.proto.
 */
export const file_yeying_api_correction_mistakes: GenFile = /*@__PURE__*/
  fileDesc("CiR5ZXlpbmcvYXBpL2NvcnJlY3Rpb24vbWlzdGFrZXMucHJvdG8SFXlleWluZy5hcGkuY29ycmVjdGlvbiKDAQoSTWlzdGFrZXNBZGRSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISOwoEYm9keRgCIAEoCzItLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0FkZFJlcXVlc3RCb2R5Ik8KFk1pc3Rha2VzQWRkUmVxdWVzdEJvZHkSNQoEbWV0YRgBIAEoCzInLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc01ldGFkYXRhIoUBChNNaXN0YWtlc0FkZFJlc3BvbnNlEjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPAoEYm9keRgCIAEoCzIuLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0FkZFJlc3BvbnNlQm9keSKDAQoXTWlzdGFrZXNBZGRSZXNwb25zZUJvZHkSMQoGc3RhdHVzGAEgASgLMiEueWV5aW5nLmFwaS5jb21tb24uUmVzcG9uc2VTdGF0dXMSNQoEbWV0YRgCIAEoCzInLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc01ldGFkYXRhIoUBChNNaXN0YWtlc0xpc3RSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPAoEYm9keRgCIAEoCzIuLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0xpc3RSZXF1ZXN0Qm9keSIvChdNaXN0YWtlc0xpc3RSZXF1ZXN0Qm9keRIUCgx0ZXN0UGFwZXJVaWQYASABKAkihwEKFE1pc3Rha2VzTGlzdFJlc3BvbnNlEjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPQoEYm9keRgCIAEoCzIvLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0xpc3RSZXNwb25zZUJvZHkihAEKGE1pc3Rha2VzTGlzdFJlc3BvbnNlQm9keRIxCgZzdGF0dXMYASABKAsyIS55ZXlpbmcuYXBpLmNvbW1vbi5SZXNwb25zZVN0YXR1cxI1CgRsaXN0GAIgAygLMicueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzTWV0YWRhdGEiiQEKFU1pc3Rha2VzRGV0YWlsUmVxdWVzdBIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEj4KBGJvZHkYAiABKAsyMC55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNEZXRhaWxSZXF1ZXN0Qm9keSIoChlNaXN0YWtlc0RldGFpbFJlcXVlc3RCb2R5EgsKA3VpZBgBIAEoCSKLAQoWTWlzdGFrZXNEZXRhaWxSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEj8KBGJvZHkYAiABKAsyMS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNEZXRhaWxSZXNwb25zZUJvZHkihgEKGk1pc3Rha2VzRGV0YWlsUmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzEjUKBG1ldGEYAiABKAsyJy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNNZXRhZGF0YSKNAQoXTWlzdGFrZXNBbmFseXNpc1JlcXVlc3QSMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchJACgRib2R5GAIgASgLMjIueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzQW5hbHlzaXNSZXF1ZXN0Qm9keSIpChtNaXN0YWtlc0FuYWx5c2lzUmVxdWVzdEJvZHkSCgoCcWEYASABKAkijwEKGE1pc3Rha2VzQW5hbHlzaXNSZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEkEKBGJvZHkYAiABKAsyMy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNBbmFseXNpc1Jlc3BvbnNlQm9keSJRChxNaXN0YWtlc0FuYWx5c2lzUmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzIokBChVNYWtlQ29ycmVjdGlvblJlcXVlc3QSMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchI+CgRib2R5GAIgASgLMjAueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1ha2VDb3JyZWN0aW9uUmVxdWVzdEJvZHkiJwoZTWFrZUNvcnJlY3Rpb25SZXF1ZXN0Qm9keRIKCgJxYRgBIAEoCSKLAQoWTWFrZUNvcnJlY3Rpb25SZXNwb25zZRIwCgZoZWFkZXIYASABKAsyIC55ZXlpbmcuYXBpLmNvbW1vbi5NZXNzYWdlSGVhZGVyEj8KBGJvZHkYAiABKAsyMS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWFrZUNvcnJlY3Rpb25SZXNwb25zZUJvZHkiTwoaTWFrZUNvcnJlY3Rpb25SZXNwb25zZUJvZHkSMQoGc3RhdHVzGAEgASgLMiEueWV5aW5nLmFwaS5jb21tb24uUmVzcG9uc2VTdGF0dXMihwEKFE1pc3Rha2VzUHJpbnRSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPQoEYm9keRgCIAEoCzIvLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc1ByaW50UmVxdWVzdEJvZHkiJgoYTWlzdGFrZXNQcmludFJlcXVlc3RCb2R5EgoKAnFhGAEgASgJIokBChVNaXN0YWtlc1ByaW50UmVzcG9uc2USMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchI+CgRib2R5GAIgASgLMjAueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzUHJpbnRSZXNwb25zZUJvZHkiTgoZTWlzdGFrZXNQcmludFJlc3BvbnNlQm9keRIxCgZzdGF0dXMYASABKAsyIS55ZXlpbmcuYXBpLmNvbW1vbi5SZXNwb25zZVN0YXR1cyKJAQoVTWlzdGFrZXNTdWJtaXRSZXF1ZXN0EjAKBmhlYWRlchgBIAEoCzIgLnlleWluZy5hcGkuY29tbW9uLk1lc3NhZ2VIZWFkZXISPgoEYm9keRgCIAEoCzIwLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc1N1Ym1pdFJlcXVlc3RCb2R5IicKGU1pc3Rha2VzU3VibWl0UmVxdWVzdEJvZHkSCgoCcWEYASABKAkiiwEKFk1pc3Rha2VzU3VibWl0UmVzcG9uc2USMAoGaGVhZGVyGAEgASgLMiAueWV5aW5nLmFwaS5jb21tb24uTWVzc2FnZUhlYWRlchI/CgRib2R5GAIgASgLMjEueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzU3VibWl0UmVzcG9uc2VCb2R5Ik8KGk1pc3Rha2VzU3VibWl0UmVzcG9uc2VCb2R5EjEKBnN0YXR1cxgBIAEoCzIhLnlleWluZy5hcGkuY29tbW9uLlJlc3BvbnNlU3RhdHVzMuUFCghNaXN0YWtlcxJeCgNBZGQSKS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNBZGRSZXF1ZXN0GioueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzQWRkUmVzcG9uc2UiABJhCgRMaXN0EioueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzTGlzdFJlcXVlc3QaKy55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNMaXN0UmVzcG9uc2UiABJnCgZEZXRhaWwSLC55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNEZXRhaWxSZXF1ZXN0Gi0ueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzRGV0YWlsUmVzcG9uc2UiABJtCghBbmFseXNpcxIuLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0FuYWx5c2lzUmVxdWVzdBovLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc0FuYWx5c2lzUmVzcG9uc2UiABJvCg5NYWtlQ29ycmVjdGlvbhIsLnlleWluZy5hcGkuY29ycmVjdGlvbi5NYWtlQ29ycmVjdGlvblJlcXVlc3QaLS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWFrZUNvcnJlY3Rpb25SZXNwb25zZSIAEmQKBVByaW50EisueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzUHJpbnRSZXF1ZXN0GiwueWV5aW5nLmFwaS5jb3JyZWN0aW9uLk1pc3Rha2VzUHJpbnRSZXNwb25zZSIAEmcKBlN1Ym1pdBIsLnlleWluZy5hcGkuY29ycmVjdGlvbi5NaXN0YWtlc1N1Ym1pdFJlcXVlc3QaLS55ZXlpbmcuYXBpLmNvcnJlY3Rpb24uTWlzdGFrZXNTdWJtaXRSZXNwb25zZSIAQhdaFXlleWluZy9hcGkvY29ycmVjdGlvbmIGcHJvdG8z", [file_yeying_api_common_message, file_yeying_api_correction_meta]);

/**
 * Add
 *
 * @generated from message yeying.api.correction.MistakesAddRequest
 */
export type MistakesAddRequest = Message<"yeying.api.correction.MistakesAddRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesAddRequestBody body = 2;
   */
  body?: MistakesAddRequestBody;
};

/**
 * Add
 *
 * @generated from message yeying.api.correction.MistakesAddRequest
 */
export type MistakesAddRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesAddRequestBody body = 2;
   */
  body?: MistakesAddRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAddRequest.
 * Use `create(MistakesAddRequestSchema)` to create a new message.
 */
export const MistakesAddRequestSchema: GenMessage<MistakesAddRequest, MistakesAddRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 0);

/**
 * @generated from message yeying.api.correction.MistakesAddRequestBody
 */
export type MistakesAddRequestBody = Message<"yeying.api.correction.MistakesAddRequestBody"> & {
  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 1;
   */
  meta?: MistakesMetadata;
};

/**
 * @generated from message yeying.api.correction.MistakesAddRequestBody
 */
export type MistakesAddRequestBodyJson = {
  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 1;
   */
  meta?: MistakesMetadataJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAddRequestBody.
 * Use `create(MistakesAddRequestBodySchema)` to create a new message.
 */
export const MistakesAddRequestBodySchema: GenMessage<MistakesAddRequestBody, MistakesAddRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 1);

/**
 * @generated from message yeying.api.correction.MistakesAddResponse
 */
export type MistakesAddResponse = Message<"yeying.api.correction.MistakesAddResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesAddResponseBody body = 2;
   */
  body?: MistakesAddResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesAddResponse
 */
export type MistakesAddResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesAddResponseBody body = 2;
   */
  body?: MistakesAddResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAddResponse.
 * Use `create(MistakesAddResponseSchema)` to create a new message.
 */
export const MistakesAddResponseSchema: GenMessage<MistakesAddResponse, MistakesAddResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 2);

/**
 * @generated from message yeying.api.correction.MistakesAddResponseBody
 */
export type MistakesAddResponseBody = Message<"yeying.api.correction.MistakesAddResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 2;
   */
  meta?: MistakesMetadata;
};

/**
 * @generated from message yeying.api.correction.MistakesAddResponseBody
 */
export type MistakesAddResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 2;
   */
  meta?: MistakesMetadataJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAddResponseBody.
 * Use `create(MistakesAddResponseBodySchema)` to create a new message.
 */
export const MistakesAddResponseBodySchema: GenMessage<MistakesAddResponseBody, MistakesAddResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 3);

/**
 * 列表
 *
 * @generated from message yeying.api.correction.MistakesListRequest
 */
export type MistakesListRequest = Message<"yeying.api.correction.MistakesListRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesListRequestBody body = 2;
   */
  body?: MistakesListRequestBody;
};

/**
 * 列表
 *
 * @generated from message yeying.api.correction.MistakesListRequest
 */
export type MistakesListRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesListRequestBody body = 2;
   */
  body?: MistakesListRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesListRequest.
 * Use `create(MistakesListRequestSchema)` to create a new message.
 */
export const MistakesListRequestSchema: GenMessage<MistakesListRequest, MistakesListRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 4);

/**
 * @generated from message yeying.api.correction.MistakesListRequestBody
 */
export type MistakesListRequestBody = Message<"yeying.api.correction.MistakesListRequestBody"> & {
  /**
   * 试卷uid
   *
   * @generated from field: string testPaperUid = 1;
   */
  testPaperUid: string;
};

/**
 * @generated from message yeying.api.correction.MistakesListRequestBody
 */
export type MistakesListRequestBodyJson = {
  /**
   * 试卷uid
   *
   * @generated from field: string testPaperUid = 1;
   */
  testPaperUid?: string;
};

/**
 * Describes the message yeying.api.correction.MistakesListRequestBody.
 * Use `create(MistakesListRequestBodySchema)` to create a new message.
 */
export const MistakesListRequestBodySchema: GenMessage<MistakesListRequestBody, MistakesListRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 5);

/**
 * @generated from message yeying.api.correction.MistakesListResponse
 */
export type MistakesListResponse = Message<"yeying.api.correction.MistakesListResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesListResponseBody body = 2;
   */
  body?: MistakesListResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesListResponse
 */
export type MistakesListResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesListResponseBody body = 2;
   */
  body?: MistakesListResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesListResponse.
 * Use `create(MistakesListResponseSchema)` to create a new message.
 */
export const MistakesListResponseSchema: GenMessage<MistakesListResponse, MistakesListResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 6);

/**
 * @generated from message yeying.api.correction.MistakesListResponseBody
 */
export type MistakesListResponseBody = Message<"yeying.api.correction.MistakesListResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * repeated 表示 List
   *
   * @generated from field: repeated yeying.api.correction.MistakesMetadata list = 2;
   */
  list: MistakesMetadata[];
};

/**
 * @generated from message yeying.api.correction.MistakesListResponseBody
 */
export type MistakesListResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * repeated 表示 List
   *
   * @generated from field: repeated yeying.api.correction.MistakesMetadata list = 2;
   */
  list?: MistakesMetadataJson[];
};

/**
 * Describes the message yeying.api.correction.MistakesListResponseBody.
 * Use `create(MistakesListResponseBodySchema)` to create a new message.
 */
export const MistakesListResponseBodySchema: GenMessage<MistakesListResponseBody, MistakesListResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 7);

/**
 * 详情
 *
 * @generated from message yeying.api.correction.MistakesDetailRequest
 */
export type MistakesDetailRequest = Message<"yeying.api.correction.MistakesDetailRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesDetailRequestBody body = 2;
   */
  body?: MistakesDetailRequestBody;
};

/**
 * 详情
 *
 * @generated from message yeying.api.correction.MistakesDetailRequest
 */
export type MistakesDetailRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesDetailRequestBody body = 2;
   */
  body?: MistakesDetailRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesDetailRequest.
 * Use `create(MistakesDetailRequestSchema)` to create a new message.
 */
export const MistakesDetailRequestSchema: GenMessage<MistakesDetailRequest, MistakesDetailRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 8);

/**
 * @generated from message yeying.api.correction.MistakesDetailRequestBody
 */
export type MistakesDetailRequestBody = Message<"yeying.api.correction.MistakesDetailRequestBody"> & {
  /**
   * @generated from field: string uid = 1;
   */
  uid: string;
};

/**
 * @generated from message yeying.api.correction.MistakesDetailRequestBody
 */
export type MistakesDetailRequestBodyJson = {
  /**
   * @generated from field: string uid = 1;
   */
  uid?: string;
};

/**
 * Describes the message yeying.api.correction.MistakesDetailRequestBody.
 * Use `create(MistakesDetailRequestBodySchema)` to create a new message.
 */
export const MistakesDetailRequestBodySchema: GenMessage<MistakesDetailRequestBody, MistakesDetailRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 9);

/**
 * @generated from message yeying.api.correction.MistakesDetailResponse
 */
export type MistakesDetailResponse = Message<"yeying.api.correction.MistakesDetailResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesDetailResponseBody body = 2;
   */
  body?: MistakesDetailResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesDetailResponse
 */
export type MistakesDetailResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesDetailResponseBody body = 2;
   */
  body?: MistakesDetailResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesDetailResponse.
 * Use `create(MistakesDetailResponseSchema)` to create a new message.
 */
export const MistakesDetailResponseSchema: GenMessage<MistakesDetailResponse, MistakesDetailResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 10);

/**
 * @generated from message yeying.api.correction.MistakesDetailResponseBody
 */
export type MistakesDetailResponseBody = Message<"yeying.api.correction.MistakesDetailResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;

  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 2;
   */
  meta?: MistakesMetadata;
};

/**
 * @generated from message yeying.api.correction.MistakesDetailResponseBody
 */
export type MistakesDetailResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;

  /**
   * @generated from field: yeying.api.correction.MistakesMetadata meta = 2;
   */
  meta?: MistakesMetadataJson;
};

/**
 * Describes the message yeying.api.correction.MistakesDetailResponseBody.
 * Use `create(MistakesDetailResponseBodySchema)` to create a new message.
 */
export const MistakesDetailResponseBodySchema: GenMessage<MistakesDetailResponseBody, MistakesDetailResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 11);

/**
 * 错误分析
 *
 * @generated from message yeying.api.correction.MistakesAnalysisRequest
 */
export type MistakesAnalysisRequest = Message<"yeying.api.correction.MistakesAnalysisRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesAnalysisRequestBody body = 2;
   */
  body?: MistakesAnalysisRequestBody;
};

/**
 * 错误分析
 *
 * @generated from message yeying.api.correction.MistakesAnalysisRequest
 */
export type MistakesAnalysisRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesAnalysisRequestBody body = 2;
   */
  body?: MistakesAnalysisRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAnalysisRequest.
 * Use `create(MistakesAnalysisRequestSchema)` to create a new message.
 */
export const MistakesAnalysisRequestSchema: GenMessage<MistakesAnalysisRequest, MistakesAnalysisRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 12);

/**
 * @generated from message yeying.api.correction.MistakesAnalysisRequestBody
 */
export type MistakesAnalysisRequestBody = Message<"yeying.api.correction.MistakesAnalysisRequestBody"> & {
  /**
   * @generated from field: string qa = 1;
   */
  qa: string;
};

/**
 * @generated from message yeying.api.correction.MistakesAnalysisRequestBody
 */
export type MistakesAnalysisRequestBodyJson = {
  /**
   * @generated from field: string qa = 1;
   */
  qa?: string;
};

/**
 * Describes the message yeying.api.correction.MistakesAnalysisRequestBody.
 * Use `create(MistakesAnalysisRequestBodySchema)` to create a new message.
 */
export const MistakesAnalysisRequestBodySchema: GenMessage<MistakesAnalysisRequestBody, MistakesAnalysisRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 13);

/**
 * @generated from message yeying.api.correction.MistakesAnalysisResponse
 */
export type MistakesAnalysisResponse = Message<"yeying.api.correction.MistakesAnalysisResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesAnalysisResponseBody body = 2;
   */
  body?: MistakesAnalysisResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesAnalysisResponse
 */
export type MistakesAnalysisResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesAnalysisResponseBody body = 2;
   */
  body?: MistakesAnalysisResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAnalysisResponse.
 * Use `create(MistakesAnalysisResponseSchema)` to create a new message.
 */
export const MistakesAnalysisResponseSchema: GenMessage<MistakesAnalysisResponse, MistakesAnalysisResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 14);

/**
 * @generated from message yeying.api.correction.MistakesAnalysisResponseBody
 */
export type MistakesAnalysisResponseBody = Message<"yeying.api.correction.MistakesAnalysisResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;
};

/**
 * @generated from message yeying.api.correction.MistakesAnalysisResponseBody
 */
export type MistakesAnalysisResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;
};

/**
 * Describes the message yeying.api.correction.MistakesAnalysisResponseBody.
 * Use `create(MistakesAnalysisResponseBodySchema)` to create a new message.
 */
export const MistakesAnalysisResponseBodySchema: GenMessage<MistakesAnalysisResponseBody, MistakesAnalysisResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 15);

/**
 * 错误订正
 *
 * @generated from message yeying.api.correction.MakeCorrectionRequest
 */
export type MakeCorrectionRequest = Message<"yeying.api.correction.MakeCorrectionRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MakeCorrectionRequestBody body = 2;
   */
  body?: MakeCorrectionRequestBody;
};

/**
 * 错误订正
 *
 * @generated from message yeying.api.correction.MakeCorrectionRequest
 */
export type MakeCorrectionRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MakeCorrectionRequestBody body = 2;
   */
  body?: MakeCorrectionRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MakeCorrectionRequest.
 * Use `create(MakeCorrectionRequestSchema)` to create a new message.
 */
export const MakeCorrectionRequestSchema: GenMessage<MakeCorrectionRequest, MakeCorrectionRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 16);

/**
 * @generated from message yeying.api.correction.MakeCorrectionRequestBody
 */
export type MakeCorrectionRequestBody = Message<"yeying.api.correction.MakeCorrectionRequestBody"> & {
  /**
   * @generated from field: string qa = 1;
   */
  qa: string;
};

/**
 * @generated from message yeying.api.correction.MakeCorrectionRequestBody
 */
export type MakeCorrectionRequestBodyJson = {
  /**
   * @generated from field: string qa = 1;
   */
  qa?: string;
};

/**
 * Describes the message yeying.api.correction.MakeCorrectionRequestBody.
 * Use `create(MakeCorrectionRequestBodySchema)` to create a new message.
 */
export const MakeCorrectionRequestBodySchema: GenMessage<MakeCorrectionRequestBody, MakeCorrectionRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 17);

/**
 * @generated from message yeying.api.correction.MakeCorrectionResponse
 */
export type MakeCorrectionResponse = Message<"yeying.api.correction.MakeCorrectionResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MakeCorrectionResponseBody body = 2;
   */
  body?: MakeCorrectionResponseBody;
};

/**
 * @generated from message yeying.api.correction.MakeCorrectionResponse
 */
export type MakeCorrectionResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MakeCorrectionResponseBody body = 2;
   */
  body?: MakeCorrectionResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MakeCorrectionResponse.
 * Use `create(MakeCorrectionResponseSchema)` to create a new message.
 */
export const MakeCorrectionResponseSchema: GenMessage<MakeCorrectionResponse, MakeCorrectionResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 18);

/**
 * @generated from message yeying.api.correction.MakeCorrectionResponseBody
 */
export type MakeCorrectionResponseBody = Message<"yeying.api.correction.MakeCorrectionResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;
};

/**
 * @generated from message yeying.api.correction.MakeCorrectionResponseBody
 */
export type MakeCorrectionResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;
};

/**
 * Describes the message yeying.api.correction.MakeCorrectionResponseBody.
 * Use `create(MakeCorrectionResponseBodySchema)` to create a new message.
 */
export const MakeCorrectionResponseBodySchema: GenMessage<MakeCorrectionResponseBody, MakeCorrectionResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 19);

/**
 * 打印错题题目
 *
 * @generated from message yeying.api.correction.MistakesPrintRequest
 */
export type MistakesPrintRequest = Message<"yeying.api.correction.MistakesPrintRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesPrintRequestBody body = 2;
   */
  body?: MistakesPrintRequestBody;
};

/**
 * 打印错题题目
 *
 * @generated from message yeying.api.correction.MistakesPrintRequest
 */
export type MistakesPrintRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesPrintRequestBody body = 2;
   */
  body?: MistakesPrintRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesPrintRequest.
 * Use `create(MistakesPrintRequestSchema)` to create a new message.
 */
export const MistakesPrintRequestSchema: GenMessage<MistakesPrintRequest, MistakesPrintRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 20);

/**
 * @generated from message yeying.api.correction.MistakesPrintRequestBody
 */
export type MistakesPrintRequestBody = Message<"yeying.api.correction.MistakesPrintRequestBody"> & {
  /**
   * @generated from field: string qa = 1;
   */
  qa: string;
};

/**
 * @generated from message yeying.api.correction.MistakesPrintRequestBody
 */
export type MistakesPrintRequestBodyJson = {
  /**
   * @generated from field: string qa = 1;
   */
  qa?: string;
};

/**
 * Describes the message yeying.api.correction.MistakesPrintRequestBody.
 * Use `create(MistakesPrintRequestBodySchema)` to create a new message.
 */
export const MistakesPrintRequestBodySchema: GenMessage<MistakesPrintRequestBody, MistakesPrintRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 21);

/**
 * @generated from message yeying.api.correction.MistakesPrintResponse
 */
export type MistakesPrintResponse = Message<"yeying.api.correction.MistakesPrintResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesPrintResponseBody body = 2;
   */
  body?: MistakesPrintResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesPrintResponse
 */
export type MistakesPrintResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesPrintResponseBody body = 2;
   */
  body?: MistakesPrintResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesPrintResponse.
 * Use `create(MistakesPrintResponseSchema)` to create a new message.
 */
export const MistakesPrintResponseSchema: GenMessage<MistakesPrintResponse, MistakesPrintResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 22);

/**
 * @generated from message yeying.api.correction.MistakesPrintResponseBody
 */
export type MistakesPrintResponseBody = Message<"yeying.api.correction.MistakesPrintResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;
};

/**
 * @generated from message yeying.api.correction.MistakesPrintResponseBody
 */
export type MistakesPrintResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;
};

/**
 * Describes the message yeying.api.correction.MistakesPrintResponseBody.
 * Use `create(MistakesPrintResponseBodySchema)` to create a new message.
 */
export const MistakesPrintResponseBodySchema: GenMessage<MistakesPrintResponseBody, MistakesPrintResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 23);

/**
 * 提交订正的题目，重新生成图片，提交大模型批改
 *
 * @generated from message yeying.api.correction.MistakesSubmitRequest
 */
export type MistakesSubmitRequest = Message<"yeying.api.correction.MistakesSubmitRequest"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesSubmitRequestBody body = 2;
   */
  body?: MistakesSubmitRequestBody;
};

/**
 * 提交订正的题目，重新生成图片，提交大模型批改
 *
 * @generated from message yeying.api.correction.MistakesSubmitRequest
 */
export type MistakesSubmitRequestJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesSubmitRequestBody body = 2;
   */
  body?: MistakesSubmitRequestBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesSubmitRequest.
 * Use `create(MistakesSubmitRequestSchema)` to create a new message.
 */
export const MistakesSubmitRequestSchema: GenMessage<MistakesSubmitRequest, MistakesSubmitRequestJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 24);

/**
 * @generated from message yeying.api.correction.MistakesSubmitRequestBody
 */
export type MistakesSubmitRequestBody = Message<"yeying.api.correction.MistakesSubmitRequestBody"> & {
  /**
   * @generated from field: string qa = 1;
   */
  qa: string;
};

/**
 * @generated from message yeying.api.correction.MistakesSubmitRequestBody
 */
export type MistakesSubmitRequestBodyJson = {
  /**
   * @generated from field: string qa = 1;
   */
  qa?: string;
};

/**
 * Describes the message yeying.api.correction.MistakesSubmitRequestBody.
 * Use `create(MistakesSubmitRequestBodySchema)` to create a new message.
 */
export const MistakesSubmitRequestBodySchema: GenMessage<MistakesSubmitRequestBody, MistakesSubmitRequestBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 25);

/**
 * @generated from message yeying.api.correction.MistakesSubmitResponse
 */
export type MistakesSubmitResponse = Message<"yeying.api.correction.MistakesSubmitResponse"> & {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeader;

  /**
   * @generated from field: yeying.api.correction.MistakesSubmitResponseBody body = 2;
   */
  body?: MistakesSubmitResponseBody;
};

/**
 * @generated from message yeying.api.correction.MistakesSubmitResponse
 */
export type MistakesSubmitResponseJson = {
  /**
   * @generated from field: yeying.api.common.MessageHeader header = 1;
   */
  header?: MessageHeaderJson;

  /**
   * @generated from field: yeying.api.correction.MistakesSubmitResponseBody body = 2;
   */
  body?: MistakesSubmitResponseBodyJson;
};

/**
 * Describes the message yeying.api.correction.MistakesSubmitResponse.
 * Use `create(MistakesSubmitResponseSchema)` to create a new message.
 */
export const MistakesSubmitResponseSchema: GenMessage<MistakesSubmitResponse, MistakesSubmitResponseJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 26);

/**
 * @generated from message yeying.api.correction.MistakesSubmitResponseBody
 */
export type MistakesSubmitResponseBody = Message<"yeying.api.correction.MistakesSubmitResponseBody"> & {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatus;
};

/**
 * @generated from message yeying.api.correction.MistakesSubmitResponseBody
 */
export type MistakesSubmitResponseBodyJson = {
  /**
   * @generated from field: yeying.api.common.ResponseStatus status = 1;
   */
  status?: ResponseStatusJson;
};

/**
 * Describes the message yeying.api.correction.MistakesSubmitResponseBody.
 * Use `create(MistakesSubmitResponseBodySchema)` to create a new message.
 */
export const MistakesSubmitResponseBodySchema: GenMessage<MistakesSubmitResponseBody, MistakesSubmitResponseBodyJson> = /*@__PURE__*/
  messageDesc(file_yeying_api_correction_mistakes, 27);

/**
 * *
 * 错题管理
 *
 * @generated from service yeying.api.correction.Mistakes
 */
export const Mistakes: GenService<{
  /**
   * 添加错题
   *
   * @generated from rpc yeying.api.correction.Mistakes.Add
   */
  add: {
    methodKind: "unary";
    input: typeof MistakesAddRequestSchema;
    output: typeof MistakesAddResponseSchema;
  },
  /**
   * 列表
   *
   * @generated from rpc yeying.api.correction.Mistakes.List
   */
  list: {
    methodKind: "unary";
    input: typeof MistakesListRequestSchema;
    output: typeof MistakesListResponseSchema;
  },
  /**
   * 详情
   *
   * @generated from rpc yeying.api.correction.Mistakes.Detail
   */
  detail: {
    methodKind: "unary";
    input: typeof MistakesDetailRequestSchema;
    output: typeof MistakesDetailResponseSchema;
  },
  /**
   * 错误分析
   *
   * @generated from rpc yeying.api.correction.Mistakes.Analysis
   */
  analysis: {
    methodKind: "unary";
    input: typeof MistakesAnalysisRequestSchema;
    output: typeof MistakesAnalysisResponseSchema;
  },
  /**
   * 错误订正
   *
   * @generated from rpc yeying.api.correction.Mistakes.MakeCorrection
   */
  makeCorrection: {
    methodKind: "unary";
    input: typeof MakeCorrectionRequestSchema;
    output: typeof MakeCorrectionResponseSchema;
  },
  /**
   * 打印错题题目
   *
   * @generated from rpc yeying.api.correction.Mistakes.Print
   */
  print: {
    methodKind: "unary";
    input: typeof MistakesPrintRequestSchema;
    output: typeof MistakesPrintResponseSchema;
  },
  /**
   * 提交订正的题目，重新生成图片，提交大模型批改
   *
   * @generated from rpc yeying.api.correction.Mistakes.Submit
   */
  submit: {
    methodKind: "unary";
    input: typeof MistakesSubmitRequestSchema;
    output: typeof MistakesSubmitResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_yeying_api_correction_mistakes, 0);

