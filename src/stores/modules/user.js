import {defineStore} from 'pinia'
import {ref} from 'vue'
import { getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user',() =>{
    const token = ref('')
    const setToken = (data) => {
        token.value = data
    }
    const userInfo = ref({})
    const getuserInfo = async () => {
        const res = await getUserInfo()
        
        userInfo.value = res.data.data   
    }

    const logout = () => {
        token.value = ''
        userInfo.value = {}
    }
    return{
        token,
        setToken,
        userInfo,
        getuserInfo,
        logout
    }
},{
    persist:true
}
 )
     
