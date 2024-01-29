import { permission } from "@/directives/permission";
import { useProxyState, useState } from "@/hooks/useState";
import { Group } from "@/models/group";
import { Permission } from "@/models/permission";
import { Role } from "@/models/role";
import { IService } from "@/service";
import { defineStore } from "pinia";

export const useShared = defineStore('share-role',()=>{

  const state = useState({
    availableRoleList:[] as Role[],
    permissionList: [] as Permission[],
    loading:false,
    createDialogVisible: false,
    editDialogVisible: false,
    // current row 
    currentItem: {} as Role,
  })

  const getAllRole = async () => {
    state.availableRoleList.value = (await IService.roleservice.getAllRoles()).data
  }

  const getAllPermission =async () => {
    state.permissionList.value = (await IService.roleservice.getAllPermissions()).data
  }
  
  const setCurrentItem = (item:Role) => state.currentItem.value = item

  

  return {
    ...state,
    getAllRole,
    setCurrentItem,
    getAllPermission
  }

})