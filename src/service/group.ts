import { deleteI, get, patch, post, put } from '@/api/request';
import { ListResponse } from '@/dtos/common/list-response';
import { SuccessResponse } from '@/dtos/common/success-response';
import { Group } from '@/models/group';

export class GroupService {
  private groupTemplate: string = '/api/v1/group';

  getGroupsByCondition(
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) {
    return get<ListResponse<Group>>(
      `${this.groupTemplate}`,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  getMemberGroupsByCondition(userId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number) {
      return get<ListResponse<Group>>(
        `${this.groupTemplate}/user/${userId}`,
        {
          searchTerm: searchTerm || '',
          sort: sort || '',
          order: order || 'asc',
          page: page || 1,
          pageSize: pageSize || 10,
        }
      );
  }

  getAvailableMemberGroupsByCondition(userId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number) {
      return get<ListResponse<Group>>(
        `${this.groupTemplate}/user/${userId}/available`,
        {
            searchTerm: searchTerm || '',
            sort: sort || '',
            order: order || 'asc',
            page: page || 1,
            pageSize: pageSize || 10,
        }
      );
  }

  createGroup(params: { name: string; description: string | undefined; roleId: number; }){
    return post<SuccessResponse>(
      `${this.groupTemplate}`,
      params
    );
  }

  getRoleGroupsByCondition(
    roleId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ){
    return get<ListResponse<Group>>(
      `${this.groupTemplate}/role/${roleId}`,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  getAvailableRoleGroupsByCondition(
    roleId: number,
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ) {
    return get<ListResponse<Group>>(
      `${this.groupTemplate}/role/${roleId}/available`,
      {
          searchTerm: searchTerm || '',
          sort: sort || '',
          order: order || 'asc',
          page: page || 1,
          pageSize: pageSize || 10,
      }
    );
  }

  updateGroup(
    groupId: number,
    { name, description, roleId }: {name:any,description:any,roleId:any}
  ){
    return put<SuccessResponse>(
      `${this.groupTemplate}/${groupId}`,
      {
        name,
        description,
        roleId,
      }
    );
  }

  updateGroupRole(groupId: number, roleId: number) {
    return patch<SuccessResponse>(
      `${this.groupTemplate}/${groupId}/role/${roleId}`,
      {}
    );
  }

  deleteGroup(groupId: number) {
    return deleteI<SuccessResponse>(
      `${this.groupTemplate}/${groupId}`
    );
  }

  addGroupMember(groupId: number, userId: number){
    return post<SuccessResponse>(
      `${this.groupTemplate}/${groupId}/user/${userId}`,
      {}
    );
  }

  removeGroupMember(groupId: number, userId: number){
    return deleteI<SuccessResponse>(
      `${this.groupTemplate}/${groupId}/user/${userId}`
    );
  }

  // getOktaGroups() {
  //   if (!this.allOktaGroups$){
  //     this.allOktaGroups$ = this.httpClient.get<any>(
  //       `${environment.apiUrl}${this.groupTemplate}/okta/all`
  //     ).pipe(shareReplay(1));
  //   }
  //   return this.allOktaGroups$;
  // }

  // syncOktaGroups(oktaGroupId: string): Observable<any> {
  //   return this.httpClient.put<SuccessResponse>(
  //     `${environment.apiUrl}${this.groupTemplate}/okta/${oktaGroupId}/sync`,
  //     {}
  //   );
  // }
}
