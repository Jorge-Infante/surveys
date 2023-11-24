import {authClient} from '@/api/base_api'
export const login = async ({commit},data)=>{
    const url = '/v1/token/'
    const res = await authClient.post(url,data)
    console.log(`RESPONSE API ${url}`,res)
    return res
} 