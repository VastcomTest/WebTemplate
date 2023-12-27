import { AuthService } from '@/service/auth'
import { GroupService } from './group'
import { RoleService } from './role'
import { UserService } from './user'

export class IService {
  static authservice  = new AuthService()
  static groupservice = new GroupService() 
  static roleservice  = new RoleService()
  static userservice  = new UserService()
}