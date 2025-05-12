import { generateUuid } from '../../common/string'
import { MessageHeader, MessageHeaderSchema } from '../../yeying/api/common/message_pb'
import { AuthenticateTypeEnum } from '../../yeying/api/common/code_pb'
import {
    BlockAddress,
    digest,
    fromDidToPublicKey,
    fromISO,
    getCurrentUtcString,
    isExpired,
    parseDateTime,
    signHashBytes,
    verifyHashBytes
} from '@yeying-community/yeying-web3'
import { InvalidArgument, NetworkUnavailable, NoPermission } from '../../common/error'
import { composite } from '../../common/bytes'
import { create, toBinary } from '@bufbuild/protobuf'
import { convertResponseStatusToError, isOk } from '../../common/status'

/**
 * 用于身份验证的类，负责生成和验证消息头签名
 */
export class Authenticate {
    private blockAddress: BlockAddress

    /**
     * 构造函数
     * @param blockAddress - 包含 DID 和私钥的地址信息
     * @example
     * ```ts
     * const blockAddress = { identifier: 'example-did', privateKey: 'example-private-key' };
     * const auth = new Authenticate(blockAddress);
     * ```
     */
    constructor(blockAddress: BlockAddress) {
        this.blockAddress = blockAddress
    }

    /**
     * 获取当前实例的 DID
     * @returns 返回 DID 字符串
     * @example
     * ```ts
     * const did = auth.getDid();
     * ```
     */
    getDid() {
        return this.blockAddress.identifier
    }

    /**
     * 生成签名的消息头
     * @param body - 可选的附加消息体
     * @returns 返回签名后的消息头
     * @example
     * ```ts
     * const header = await auth.createHeader();
     * ```
     */
    async createHeader(body?: Uint8Array): Promise<MessageHeader> {
        const header: MessageHeader = create(MessageHeaderSchema, {
            did: this.blockAddress.identifier,
            authType: AuthenticateTypeEnum.AUTHENTICATE_TYPE_CERT,
            nonce: generateUuid(),
            version: 0,
            timestamp: getCurrentUtcString()
        })

        const data =
            body === undefined
                ? toBinary(MessageHeaderSchema, header)
                : composite(toBinary(MessageHeaderSchema, header), body)
        const signature = await this.sign(data)
        header.authContent = signature
        return header
    }

    /**
     * 对数据进行签名
     * @param data 需要签名的数据
     * @returns 返回签名后的数据
     * @example
     * ```ts
     * const data = new Uint8Array([1, 2, 3]);
     * const signature = await auth.sign(data);
     * ```
     */
    async sign(data: Uint8Array) {
        const hashBytes = await digest(data, 'SHA-256')
        return await signHashBytes(this.blockAddress.privateKey, hashBytes)
    }

    /**
     * 验证签名是否有效
     * @param did - DID 字符串
     * @param data - 需要验证的数据
     * @param signature - 签名字符串
     * @returns 如果签名有效，返回 true；否则返回 false
     * @example
     * ```typescript
     * const data = new Uint8Array([1, 2, 3]);
     * const isValid = await auth.verify('example-did', data, 'example-signature');
     * console.log(isValid); // 输出: true 或 false
     * ```
     */
    static async verify(did: string, data: Uint8Array, signature: string) {
        const hashBytes = await digest(data, 'SHA-256')
        return await verifyHashBytes(fromDidToPublicKey(did), hashBytes, signature)
    }

    /**
     * 验证消息头的签名是否有效
     * @param header - 消息头对象
     * @param body - 可选的附加消息体
     * @throws {@link InvalidArgument} 如果时间戳过期
     * @throws {@link NoPermission} 如果签名无效
     * @example
     * ```typescript
     * const header = await auth.createHeader();
     * try {
     *   await auth.verifyHeader(header, undefined);
     *   console.log('Header is valid');
     * } catch (err) {
     *   console.error(err);
     * }
     * ```
     */
    async verifyHeader(header: MessageHeader, body: Uint8Array | undefined) {
        const datetime = fromISO(header.timestamp)
        if (isExpired(datetime, 5 * 60)) {
            throw new InvalidArgument('Timestamp expired')
        }

        const signature = header.authContent
        header.authContent = ''

        const data: Uint8Array =
            body === undefined
                ? toBinary(MessageHeaderSchema, header)
                : composite(toBinary(MessageHeaderSchema, header), body)
        const success = await Authenticate.verify(header.did, data, signature)
        if (!success) {
            throw new NoPermission('Invalid signature')
        }
    }

    /**
     * 处理响应并验证其签名
     *
     * @param response 响应对象
     * @param bodySchema 响应体的 Protobuf 模式
     * @param isSuccess 判断状态是否成功函数
     *
     * @throws {@link InvalidArgument} 如果时间戳过期
     * @throws {@link NoPermission} 如果签名无效
     *
     * @example
     * ```typescript
     * const response = { header: { ... }, body: { ... } };
     * const bodySchema = MessageHeaderSchema;
     * try {
     *   await auth.doResponse(response, bodySchema);
     *   console.log('Response is valid');
     * } catch (err) {
     *   console.error(err);
     * }
     * ```
     */
    async doResponse(response: any, bodySchema: any, isSuccess: Function = isOk) {
        if (
            response === undefined ||
            response.header === undefined ||
            response.body === undefined ||
            response.body.status === undefined
        ) {
            throw new NetworkUnavailable('protocol error!')
        }

        if (!isSuccess(response.body.status)) {
            throw convertResponseStatusToError(response.body.status)
        }

        await this.verifyHeader(response.header, toBinary(bodySchema, response.body))
    }
}
