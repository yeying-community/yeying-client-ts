import { Authenticate } from "../common/authenticate";
import { ProviderOption } from "../common/model";
import { Client, createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { create, toBinary, toJson } from "@bufbuild/protobuf";
import {
  Application,
  CreateApplicationRequestBodySchema,
  CreateApplicationRequestSchema,
  CreateApplicationResponseBodySchema,
  DeleteApplicationRequestBodySchema,
  DeleteApplicationRequestSchema,
  DeleteApplicationResponseBodySchema,
  SearchApplicationRequestBodySchema,
  SearchApplicationRequestSchema,
  SearchApplicationResponseBody,
  SearchApplicationResponseBodySchema,
  ApplicationDetailRequestBodySchema,
  ApplicationDetailRequestSchema,
  ApplicationDetailResponseBodySchema,
  OfflineApplicationRequestSchema,
  OfflineApplicationRequestBodySchema,
  OfflineApplicationResponseBodySchema,

  OnlineApplicationRequestSchema,
  OnlineApplicationRequestBodySchema,
  OnlineApplicationResponseBodySchema,

  AuditApplicationRequestSchema,
  AuditApplicationRequestBodySchema,
  AuditApplicationResponseBodySchema,
  SearchCondition,
  ApplicationCommentSchema,
  ApplicationDetailResponseBody,
  CreateApplicationResponseBody,
  DeleteApplicationResponseBody,
  OfflineApplicationResponseBody,
  OnlineApplicationResponseBody,
  AuditApplicationResponseBody,
  CreateApplicationResponse,
  SearchApplicationResponse,
  DeleteApplicationResponse,
  ApplicationDetailResponse,
  OfflineApplicationResponse,
  OnlineApplicationResponse,
  AuditApplicationResponse,
} from "../../yeying/api/application/application_pb";
import { NetworkUnavailable } from "../../common/error";
import {
  ApplicationMetadata,
  ApplicationMetadataSchema,
} from "../../yeying/api/common/model_pb";
import {
  signApplicationMetadata,
  verifyApplicationMetadata,
} from "../model/model";
import { isDeleted, isExisted } from "../../common/status";
import {
  MessageHeader,
  RequestPageSchema,
} from "../../yeying/api/common/message_pb";
/**
 * ApplicationProvider 管理应用。
 */
export class ApplicationProvider {
  private readonly authenticate: Authenticate;
  private client: Client<typeof Application>;

  /**
   * ApplicationProvider 的构造函数，初始化身份认证和客户端实例。
   *
   * @param option - 服务提供商的选项，包括代理设置等。
   * @example
   *
   * ```ts
   * const option = { proxy: <proxy url>, blockAddress: <your block address> };
   * const provider = new ApplicationProvider(option);
   * ```
   *
   */
  constructor(option: ProviderOption) {
    this.authenticate = new Authenticate(option.blockAddress);
    this.client = createClient(
      Application,
      createGrpcWebTransport({
        baseUrl: option.proxy,
        useBinaryFormat: true,
      }),
    );
  }

  /**
   * 创建应用
   *
   * @param application 应用元信息
   *
   * @returns 返回应用元信息。
   *
   * @throws  NetworkUnavailable
   *
   */
  create(application: ApplicationMetadata) {
    return new Promise<CreateApplicationResponse>(async (resolve, reject) => {
      const body = create(CreateApplicationRequestBodySchema, {
        application: application,
      });

      let header: MessageHeader;
      try {
        await signApplicationMetadata(this.authenticate, application);
        header = await this.authenticate.createHeader(
          toBinary(CreateApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for creating application.", err);
        return reject(err);
      }

      const request = create(CreateApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.create(request);
        await this.authenticate.doResponse(
          res,
          CreateApplicationResponseBodySchema,
          isExisted,
        );
        await verifyApplicationMetadata(res.body?.application);
        resolve(res as CreateApplicationResponse);
      } catch (err) {
        console.error("Fail to create application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 搜索应用
   *
   * @param page 当前页码
   * @param pageSize 每页显示的条目数
   * @param condition 搜索条件
   *
   * @returns 返回应用元信息列表。
   *
   * @throws  NetworkUnavailable
   *
   */
  search(page: number, pageSize: number, condition?: SearchCondition) {
    return new Promise<SearchApplicationResponse>(async (resolve, reject) => {
      const body = create(SearchApplicationRequestBodySchema, {
        page: create(RequestPageSchema, { page: page, pageSize: pageSize }),
        condition: condition,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(SearchApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for searching application.", err);
        return reject(err);
      }

      const request = create(SearchApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.search(request);
        await this.authenticate.doResponse(
          res,
          SearchApplicationResponseBodySchema,
        );
        const body = res.body as SearchApplicationResponseBody;
        const applications = [];
        for (const application of body.applications) {
          try {
            await verifyApplicationMetadata(application);
            applications.push(application);
          } catch (err) {
            console.error(
              `invalid application=${JSON.stringify(toJson(ApplicationMetadataSchema, application))} when searching application.`,
              err,
            );
          }
        }
        resolve(res as SearchApplicationResponse);
      } catch (err) {
        console.error("Fail to search application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 删除应用
   * @param did 唯一身份
   * @param version 应用版本
   * @returns 
   * @throws  NetworkUnavailable
   */
  delete(did: string, version: number) {
    return new Promise<DeleteApplicationResponse>(async (resolve, reject) => {
      const body = create(DeleteApplicationRequestBodySchema, {
        did: did,
        version: version,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(DeleteApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for deleting application.", err);
        return reject(err);
      }

      const request = create(DeleteApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.delete(request);
        await this.authenticate.doResponse(
          res,
          DeleteApplicationResponseBodySchema,
          isDeleted,
        );
        
        return resolve(res as DeleteApplicationResponse);
      } catch (err) {
        console.error("Fail to delete application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 查看应用详情
   * @param did 唯一身份
   * @param version 应用版本
   * @returns 应用元信息
   * @throws  NetworkUnavailable
   */
  detail(did: string, version: number) {
    return new Promise<ApplicationDetailResponse>(async (resolve, reject) => {
      const body = create(ApplicationDetailRequestBodySchema, {
        did: did,
        version: version,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(ApplicationDetailRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for deleting application.", err);
        return reject(err);
      }

      const request = create(ApplicationDetailRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.detail(request);
        await this.authenticate.doResponse(
          res,
          ApplicationDetailResponseBodySchema,
        );
        return resolve(res as ApplicationDetailResponse);
      } catch (err) {
        console.error("Fail to detail application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 下架应用
   * @param did 唯一身份
   * @param version 应用版本
   * @returns 下架之后的应用状态元信息
   * @throws  NetworkUnavailable
   */
  offline(did: string, version: number) {
    return new Promise<OfflineApplicationResponse>(async (resolve, reject) => {
      const body = create(OfflineApplicationRequestBodySchema, {
        did: did,
        version: version,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(OfflineApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for deleting application.", err);
        return reject(err);
      }

      const request = create(OfflineApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.offline(request);
        await this.authenticate.doResponse(
          res,
          OfflineApplicationResponseBodySchema,
        );
        return resolve(res as OfflineApplicationResponse);
      } catch (err) {
        console.error("Fail to offline application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 上架应用
   * @param did 唯一身份
   * @param version 应用版本
   * @returns 上架之后的应用状态元信息
   * @throws  NetworkUnavailable
   */
  online(did: string, version: number) {
    return new Promise<OnlineApplicationResponse>(async (resolve, reject) => {
      const body = create(OnlineApplicationRequestBodySchema, {
        did: did,
        version: version,
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(OnlineApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for deleting application.", err);
        return reject(err);
      }

      const request = create(OnlineApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.online(request);
        await this.authenticate.doResponse(
          res,
          OnlineApplicationResponseBodySchema,
        );
        return resolve(res as OnlineApplicationResponse);
      } catch (err) {
        console.error("Fail to online application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }

  /**
   * 审核应用
   * @param did 唯一身份
   * @param version 应用版本
   * @param auditor 审核人
   * @param comment 注释-审核意见
   * @param passed 是否同意
   * @param signature 应用签名
   * @returns 审核之后的应用状态元信息
   * @throws  NetworkUnavailable
   */
  audit(did: string, version: number, passed: boolean, signature?: string, auditor?: string, comment?: string) {
    return new Promise<AuditApplicationResponse>(async (resolve, reject) => {
      const commentMeta = create(ApplicationCommentSchema, {
        auditor: auditor,
        comment: comment,
        passed: passed,
        signature: signature
      })
      const body = create(AuditApplicationRequestBodySchema, {
        did: did,
        version: version,
        comment: commentMeta
      });

      let header: MessageHeader;
      try {
        header = await this.authenticate.createHeader(
          toBinary(AuditApplicationRequestBodySchema, body),
        );
      } catch (err) {
        console.error("Fail to create header for deleting application.", err);
        return reject(err);
      }

      const request = create(AuditApplicationRequestSchema, {
        header: header,
        body: body,
      });
      try {
        const res = await this.client.audit(request);
        await this.authenticate.doResponse(
          res,
          AuditApplicationResponseBodySchema,
        );
        return resolve(res as AuditApplicationResponse);
      } catch (err) {
        console.error("Fail to audit application", err);
        return reject(new NetworkUnavailable());
      }
    });
  }
}
