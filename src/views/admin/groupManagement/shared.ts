import { useProxyState, useState } from "@/hooks/useState";
import { Group } from "@/models/group";
import { Role } from "@/models/role";
import { IService } from "@/service/Index";
import { defineStore } from "pinia";

export const useShared = defineStore('share-group',()=>{

  const state = useState({
    availableRoleList:[] as Role[],
    loading:false,
    createDialogVisible: false,
    editDialogVisible: false,
    // current row 
    currentItem: {} as Group,
  })

  const getAllRole = async () => {
    state.availableRoleList.value = (await IService.roleservice.getAllRoles()).data
  }

  const setCurrentItem = (item:Group) => state.currentItem.value = item


  return {
    ...state,
    getAllRole,
    setCurrentItem
  }

})