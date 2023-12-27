import { useState } from "@/hooks/useState";
import { stat } from "fs";
import { defineStore, storeToRefs } from "pinia";
import { reactive } from "vue";

export const useSnackBarStore = defineStore("snackbar",()=>{
  const state = useState({
    show: false,
    message: "",
    color: "",
    timeout: 1500,
  })

  function setSuccessSetting(message:string,timeout:number = 2000){
    state.message.value = message
    state.color.value = 'success'
    state.show.value = true 
    state.timeout.value = timeout
  }


  function setErrorSetting(message:string,timeout:number = 2000){
    state.message.value = message
    state.color.value = 'error'
    state.show.value = true 
    state.timeout.value = timeout
  }

  return {
    ...state,
    setSuccessSetting,
    setErrorSetting
  }
})


export class SnackBarUtil {
  static showMessage(message:string,type:'success'|'error' ){
    type === 'success' ? useSnackBarStore().setSuccessSetting(message) : useSnackBarStore().setErrorSetting(message)
  }

  static success(message:string){
    useSnackBarStore().setSuccessSetting(message)
  }

  static error(message:string){
    useSnackBarStore().setErrorSetting(message)
  }
}