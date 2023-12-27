
import {toRefs, reactive, Ref, ToRefs, proxyRefs} from 'vue'

function useState<T extends Object>(state:T){
    return toRefs(reactive({
        ...state
    }))
}


function useProxyState<T extends Object>(state:T){
    return proxyRefs(toRefs(reactive({
        ...state
    })))
}



export {
    useState,
    useProxyState
}
