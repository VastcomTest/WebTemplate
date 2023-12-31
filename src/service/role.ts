import { ListResponse } from '@/dtos/common/list-response';
import { SuccessResponse } from '@/dtos/common/success-response';
import { Permission } from '@/models/permission';
import { Role } from '@/models/role';
import { deleteI, get, post, put } from '@/api/request';

export class RoleService {
  private roleTemplate: string = '/api/v1/role';
  private permissionTemplate: string = '/api/v1/role/permission';

  getAllRoles() {
    return get<Role[]>(`${this.roleTemplate}/all`)
  }

  getRolesByCondition(
    searchTerm?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ){
    return get<ListResponse<Role>>(this.roleTemplate,
      {
        searchTerm: searchTerm || '',
        sort: sort || '',
        order: order || 'asc',
        page: page || 1,
        pageSize: pageSize || 10,
      }
    );
  }

  createRole({ name, description }: any) {
    return post<SuccessResponse>(`${this.roleTemplate}`,
      {
        name,
        description,
      }
    );
  }

  updateRole(roleId: number, { name, description }: any) {
    return put<SuccessResponse>(
      `${this.roleTemplate}/${roleId}`,
      {
        name,
        description,
      }
    );
  }

  deleteRole(roleId: number){
    return deleteI<SuccessResponse>(
      `${this.roleTemplate}/${roleId}`
    );
  }

  getAllPermissions() {
    return get<Permission[]>(`${this.permissionTemplate}/all`)
  }

  getPermissionsByRoleId(roleId: number) {
    return get<Permission[]>(
      `${this.permissionTemplate}/${roleId}`
    );
  }

  updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ){
    return put<any>(
      `${this.permissionTemplate}/${roleId}`,
      {
        permissionIds,
      }
    );
  }
}
