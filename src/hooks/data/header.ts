import { BaseInfo } from './../../types/entity/goodOrService';
import { useFormRules } from "@/hooks/useFormRules"
import { useState } from "@/hooks/useState"
import { random } from "xe-utils"
import { fundingSource ,facultyOrDepartment } from '@/constants/selection'
import { getCurrentDate } from "@/utils/Date"

export function useHeaderState(){

  const { applicationId , basicForm ,basicFormRef ,isOpen , isReadDoc }  = useState({
    applicationId:'',
    basicForm:{
      date:getCurrentDate(),
      brNo:'',
      fundingSourceVal:'Non-Research',
      fundingSource,
      staffName:'staff A',
      alternateContactPerson:'Staff B',
      facultyOrDepartmentVal:'FAH',
      facultyOrDepartment,
      subject:''
    } as BaseInfo,
    basicFormRef:null,
    isOpen:false,
    isReadDoc:false
  })

  const basicFormRule = useFormRules<typeof basicForm>({
      date:[{ required:true,trigger:'blur' }],
      staffName:[{ required:true,trigger:'blur' }],
      brNo:[{ required:true,trigger:'blur' }],
      alternateContactPerson:[{ required:true,trigger:'blur' }],
      fundingSourceVal:[{ required:true,trigger:'blur' }],
      facultyOrDepartmentVal:[{ required:true,trigger:'blur' }],
      subject:[{ required:true,trigger:'blur' }]
  })

  function brNoRestrict(v:string){
    const currentLetter = v.charAt(v.length-1)
    const isValid = /\d+|\,/.test(currentLetter)
    isValid? basicForm.value.brNo = v : basicForm.value.brNo = v.substring(0,v.length-1)
  }
  return {
    applicationId,
    basicForm,
    basicFormRef,
    isOpen,
    isReadDoc,
    basicFormRule,
    brNoRestrict
  }
}
