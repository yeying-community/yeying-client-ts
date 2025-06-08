import { Authenticate } from "../common/authenticate";
import { ProviderOption } from "../common/model";
import { Client, createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { create, toBinary, toJson } from "@bufbuild/protobuf";
import { NetworkUnavailable } from "../../common/error";
import { isDeleted, isExisted } from "../../common/status";
import {
  MessageHeader,
} from "../../yeying/api/common/message_pb";
import { Audit, AuditListRequestBodySchema, AuditListRequestSchema, AuditListResponseBodySchema, AuditMetadata, AuditRequestBodySchema, AuditRequestSchema, AuditResponseBodySchema, CreateAuditListRequestBodySchema, CreateAuditListRequestSchema, CreateAuditListResponseBodySchema, CreateRequestBodySchema, CreateRequestSchema, CreateResponseBodySchema, DetailRequestBodySchema, DetailRequestSchema, DetailResponseBodySchema } from "../../yeying/api/audit/audit_pb";
import {ofAuditStatus} from "../../model/audit"

/**
 * AuditProvider 应用审批
 */
export class AuditProvider {
  private readonly authenticate: Authenticate;
  private client: Client<typeof Audit>;

  /**
   * AuditProvider 的构造函数，初始化身份认证和客户端实例。
   *
   * @param option - 服务提供商的选项，包括代理设置等。
   * @example
   *
   * ```ts
   * const option = { proxy: <proxy url>, blockAddress: <your block address> };
   * const provider = new AuditProvider(option);
   * ```
   *
   */
  constructor(option: ProviderOption) {
    this.authenticate = new Authenticate(option.blockAddress);
    this.client = createClient(
      Audit,
      createGrpcWebTransport({
        baseUrl: option.proxy,
        useBinaryFormat: true,
      }),
    );
  }

  /**
   * 创建申请审批流程
   *
   * @param meta 申请元信息
   *
   * @returns 返回申请元信息。
   *
   * @throws  NetworkUnavailable
   *
   */
  create(meta: AuditMetadata) {
    return new Promise<void>(async (resolve, reject) => {
      const body = create(CreateRequestBodySchema, {
        meta: meta,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(CreateRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for creating application.", err);
        return reject(err);
      }

      const request = create(CreateRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.create(request);
        await this.authenticate.doResponse(
          res,
          CreateResponseBodySchema
        );
        resolve();
      } catch (err) {
        console.error("Fail to create audit", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 查看审批流程详情
   *
   * @param meta 申请元信息
   *
   * @returns 返回申请元信息。
   *
   * @throws  NetworkUnavailable
   *
   */
  detail(uid: string) {
    return new Promise<void>(async (resolve, reject) => {
      const body = create(DetailRequestBodySchema, {
        uid: uid,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(DetailRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to detail header for detail audit.", err);
        return reject(err);
      }

      const request = create(DetailRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.detail(request);
        await this.authenticate.doResponse(
          res,
          DetailResponseBodySchema
        );
        resolve();
      } catch (err) {
        console.error("Fail to detail audit", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 审批
   *
   * @param uid 主键 uid
   * @param status 审批状态 passed（同意） / reject（拒绝）
   * @returns 返回申请元信息。
   *
   * @throws  NetworkUnavailable
   *
   */
  audit(uid: string, status: string) {
    return new Promise<void>(async (resolve, reject) => {
      const body = create(AuditRequestBodySchema, {
        uid: uid,
        status: ofAuditStatus(status)
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(AuditRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to audit header for audit application.", err);
        return reject(err);
      }

      const request = create(AuditRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.audit(request);
        await this.authenticate.doResponse(
          res,
          AuditResponseBodySchema
        );
        resolve();
      } catch (err) {
        console.error("Fail to audit", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

   /**
   * 查看我申请的列表
   *
   * @param sourceDid 申请者的身份 did
   *
   * @returns 返回申请元信息列表。
   *
   * @throws  NetworkUnavailable
   *
   */
  createAuditList(sourceDid: string) {
    return new Promise<void>(async (resolve, reject) => {
        const body = create(CreateAuditListRequestBodySchema, {
          sourceDid: sourceDid,
        });
  
        let header: MessageHeader;
        try {
          header = await this.authenticate.createHeader(
            toBinary(CreateAuditListRequestBodySchema, body),
          );
        } catch (err) {
          console.error("Fail to createAuditList header for audit application.", err);
          return reject(err);
        }
  
        const request = create(CreateAuditListRequestSchema, {
          header: header,
          body: body,
        });
        try {
          const res = await this.client.createList(request);
          await this.authenticate.doResponse(
            res,
            CreateAuditListResponseBodySchema
          );
          resolve();
        } catch (err) {
          console.error("Fail to createAuditList", err);
          return reject(new NetworkUnavailable());
        }
      });
  }

  /**
   * 查看我审批的列表
   *
   * @param sourceDid 审批者的身份 did
   *
   * @returns 返回审批元信息列表。
   *
   * @throws  NetworkUnavailable
   *
   */
  auditList(targetDid: string) {
    return new Promise<void>(async (resolve, reject) => {
        const body = create(AuditListRequestBodySchema, {
            targetDid: targetDid,
        });
  
        let header: MessageHeader;
        try {
          header = await this.authenticate.createHeader(
            toBinary(AuditListRequestBodySchema, body),
          );
        } catch (err) {
          console.error("Fail to auditList header for audit application.", err);
          return reject(err);
        }
  
        const request = create(AuditListRequestSchema, {
          header: header,
          body: body,
        });
        try {
          const res = await this.client.auditList(request);
          await this.authenticate.doResponse(
            res,
            AuditListResponseBodySchema
          );
          resolve();
        } catch (err) {
          console.error("Fail to auditList", err);
          return reject(new NetworkUnavailable());
        }
      });
  }
}
