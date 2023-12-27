import { ListResponse } from '@/dtos/common/list-response';
import { User } from '@/models/user';
import { SuccessResponse } from '@/dtos/common/success-response';
import { Response, deleteI, get , post, put } from '@/api/request'

export class UserService {
  private userTemplate: string = '/api/v1/user';

  getUsersByCondition(
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ): Promise<Response<ListResponse<User>>> {
    return get<ListResponse<User>>(`${this.userTemplate}`,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  getGroupMembersByCondition(
    groupId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ): Promise<Response<ListResponse<User>>> {
    return get<ListResponse<User>>(`${this.userTemplate}/group/${groupId}`,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  getAvailableGroupMembersByCondition(
    groupId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ): Promise<Response<ListResponse<User>>> {
    return get<ListResponse<User>>(`${this.userTemplate}/group/${groupId}/available`,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  createUser({
    username,
    email,
    firstName,
    lastName,
    password,
    nickName,
    chineseName,
  }: any): Promise<Response<ListResponse<User>>>{
    return post<ListResponse<User>>(`${this.userTemplate}`,
      {
        username,
        email,
        firstName,
        lastName,
        password,
        nickName,
        chineseName,
      }
    );
  }

  updateUser(
    userId: number,
    {
      username,
      email,
      firstName,
      lastName,
      nickName,
      chineseName,
      requireChangePassword,
      passwordNeverExpire,
      localAccount,
      locked,
    }: any
  ): Promise<Response<SuccessResponse>> {
    return put<SuccessResponse>(
      `${this.userTemplate}/${userId}`,
      {
        username,
        email,
        firstName,
        lastName,
        nickName,
        chineseName,
        requireChangePassword,
        passwordNeverExpire,
        localAccount,
        locked,
      }
    );
  }

  deleteUser(userId: number): Promise<Response<SuccessResponse>> {
    return deleteI<SuccessResponse>(
      `${this.userTemplate}/${userId}`
    );
  }
}
