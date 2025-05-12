import {
    AddUserRequestBodySchema,
    AddUserRequestSchema,
    AddUserResponseBodySchema,
    DeleteUserRequestSchema,
    DeleteUserResponseBodySchema,
    UpdateUserRequestBodySchema,
    UpdateUserRequestSchema,
    UpdateUserResponseBodySchema,
    User,
    UserDetail,
    UserDetailRequestSchema,
    UserDetailResponseBodySchema,
    UserMetadata,
    UserMetadataSchema
} from '../../yeying/api/user/user_pb'
import { Authenticate } from '../common/authenticate'
import { MessageHeader } from '../../yeying/api/common/message_pb'
import { ProviderOption } from '../common/model'
import { create, toBinary } from '@bufbuild/protobuf'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { Client, createClient } from '@connectrpc/connect'
import { signUserMetadata, verifyUserMetadata, verifyUserState } from '../model/model'
import { isDeleted, isExisted } from '../../common/status'
import { getCurrentUtcString } from '@yeying-community/yeying-web3'

/**
 * 提供用户管理功能的类，支持添加、查询、更新和删除用户
 */
export class UserProvider {
    private readonly authenticate: Authenticate
    private client: Client<typeof User>

    /**
     * 构造函数
     * @param option - 包含代理地址和区块地址信息的配置选项
     * @example
     * ```ts
     * const providerOption = { proxy: 'http://proxy.example.com', blockAddress: { identifier: 'example-did', privateKey: 'example-private-key' } }
     * const userProvider = new UserProvider(providerOption)
     * ```
     */
    constructor(option: ProviderOption) {
        this.authenticate = new Authenticate(option.blockAddress)
        this.client = createClient(
            User,
            createGrpcWebTransport({
                baseUrl: option.proxy,
                useBinaryFormat: true
            })
        )
    }

    /**
     * 创建用户元数据，签名并发送请求到后端服务
     *
     * @param name - 用户名称
     * @param avatar - 用户头像 URL
     *
     * @returns 返回添加用户的响应体
     *
     * @example
     * ```ts
     * userProvider.add('John Doe', 'https://example.com/avatar.jpg')
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    add(name: string, avatar: string) {
        return new Promise<UserMetadata>(async (resolve, reject) => {
            const user: UserMetadata = create(UserMetadataSchema, {
                did: this.authenticate.getDid(),
                name: name,
                avatar: avatar,
                createdAt: getCurrentUtcString(),
                updatedAt: getCurrentUtcString()
            })

            const body = create(AddUserRequestBodySchema, { user: user })
            let header: MessageHeader
            try {
                user.signature = await this.authenticate.sign(toBinary(UserMetadataSchema, user))
                header = await this.authenticate.createHeader(toBinary(AddUserRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for adding user', err)
                return reject(err)
            }

            const request = create(AddUserRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.add(request)
                await this.authenticate.doResponse(res, AddUserResponseBodySchema, isExisted)
                await verifyUserMetadata(res.body?.user)
                return resolve(res.body?.user as UserMetadata)
            } catch (err) {
                console.error('Fail to add user', err)
                return reject(err)
            }
        })
    }

    /**
     * 查询用户详情
     *
     * @returns 返回用户详情的响应体
     *
     */
    detail() {
        return new Promise<UserDetail>(async (resolve, reject) => {
            let header
            try {
                header = await this.authenticate.createHeader()
            } catch (err) {
                console.error('Fail to create header for getting user', err)
                return reject(err)
            }

            const request = create(UserDetailRequestSchema, { header: header })
            try {
                const res = await this.client.detail(request)
                await this.authenticate.doResponse(res, UserDetailResponseBodySchema)
                await verifyUserMetadata(res.body?.detail?.user)
                await verifyUserState(res.body?.detail?.state)
                return resolve(res.body?.detail as UserDetail)
            } catch (err) {
                console.error('Fail to get user detail.', err)
                return reject(err)
            }
        })
    }

    /**
     * 更新用户信息
     *
     * @param user 用户元数据对象
     *
     * @returns 返回更新后的用户元数据
     *
     * @example
     * ```ts
     * const userMetadata = { did: 'example-did', name: 'New Name', avatar: 'https://example.com/new-avatar.jpg' }
     * userProvider.update(userMetadata)
     *   .then(updatedUser => console.log(updatedUser))
     *   .catch(err => console.error(err))
     * ```
     */
    update(user: UserMetadata): Promise<UserMetadata> {
        return new Promise<UserMetadata>(async (resolve, reject) => {
            const body = create(UpdateUserRequestBodySchema, { user: user })
            let header
            try {
                user.updatedAt = getCurrentUtcString()
                await signUserMetadata(this.authenticate, user)
                header = await this.authenticate.createHeader(toBinary(UpdateUserRequestBodySchema, body))
            } catch (err) {
                console.error('Fail to create header for modifying user', err)
                return reject(err)
            }

            const request = create(UpdateUserRequestSchema, { header: header, body: body })
            try {
                const res = await this.client.update(request)
                await this.authenticate.doResponse(res, UpdateUserResponseBodySchema)
                await verifyUserMetadata(res.body?.user)
                return resolve(res.body?.user as UserMetadata)
            } catch (err) {
                console.error('Fail to update user', err)
                return reject(err)
            }
        })
    }

    /**
     * 删除用户
     *
     * @returns 无返回
     *
     * @example
     * ```ts
     * userProvider.delete()
     *   .then(response => console.log(response))
     *   .catch(err => console.error(err))
     * ```
     */
    delete() {
        return new Promise<void>(async (resolve, reject) => {
            let header
            try {
                header = await this.authenticate.createHeader()
            } catch (err) {
                console.error('Fail to create header for deleting user', err)
                return reject(err)
            }

            const request = create(DeleteUserRequestSchema, { header: header })
            try {
                const res = await this.client.delete(request)
                await this.authenticate.doResponse(res, DeleteUserResponseBodySchema, isDeleted)
                resolve()
            } catch (err) {
                console.error('Fail to get user state', err)
                return reject(err)
            }
        })
    }

    /**
     * 更新时间戳并签名用户元数据
     * @param user - 用户元数据对象
     * @returns 返回签名后的用户元数据
     * @example
     * ```ts
     * const userMetadata = { did: 'example-did', name: 'New Name', avatar: 'https://example.com/new-avatar.jpg' }
     * const signedUser = await userProvider.signUserMetadata(userMetadata)
     * ```
     */
    private async signUserMetadata(user: UserMetadata) {
        user.updatedAt = getCurrentUtcString()
        user.signature = ''
        user.signature = await this.authenticate.sign(toBinary(UserMetadataSchema, user))
        return user
    }
}
