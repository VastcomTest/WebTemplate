import {  type FormRules} from "element-plus"
import { useState } from "./useState"

export function useFormRules<D extends object>(rules:FormRules<D>){
  return useState({
    rules:rules
  }).rules
}
