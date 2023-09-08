import { useFormRules } from "@/hooks/useFormRules"
import { useState } from "@/hooks/useState"

export function useFileState(){
  const { fileTableData, fileFormRef } = useState({
    fileTableData:{
      proposal:[],
      invoicedOrReceipts:[],
      actualExchangeRateJustification:[],
      passportOrIDCopy:[],
      others:[]
    },
    fileFormRef:null
  })


  function fileValidate(rules: any,val: any,callback: (any?:any) => void){
    if(val.length===0){
      callback('please upload ' + rules.field )
    }else{
      callback()
    }
  }

  const fileFormRule = useFormRules<typeof fileTableData>({
    proposal:[{ required:true,validator:fileValidate,trigger:'blur'}],
    invoicedOrReceipts:[{ required:true,validator:fileValidate,trigger:'blur'}],
    actualExchangeRateJustification:[{ required:true,validator:fileValidate,trigger:'blur'}],
    passportOrIDCopy:[{ required:true,validator:fileValidate,trigger:'blur'}],
    others:[{ required:false}],
  })

  return {
    fileFormRef,
    fileTableData,
    fileFormRule,
    fileValidate
  }
}
