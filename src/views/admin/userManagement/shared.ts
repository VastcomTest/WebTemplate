import { useProxyState, useState } from "@/hooks/useState";
import { Group } from "@/models/group";
import { Role } from "@/models/role";
import { User } from "@/models/user";
import { IService } from "@/service/Index";
import { defineStore } from "pinia";

export const useShared = defineStore('share-user',()=>{

  const state = useState({
    availableRoleList:[] as Role[],
    loading:false,
    createDialogVisible: false,
    editDialogVisible: false,
    // current row 
    currentItem: {} as User,
  })

  const getAllRole = async () => {
    state.availableRoleList.value = (await IService.roleservice.getAllRoles()).data
  }

  const setCurrentItem = (item:User) => state.currentItem.value = item


  return {
    ...state,
    getAllRole,
    setCurrentItem
  }

})