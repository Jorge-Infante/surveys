import {apiClient} from '@/api/base_api'
export const saveSurvey = async ({commit},data)=>{
    const url = 'v1/survey/'
    const res = await apiClient.post(url,data)
    console.log('la data: ',data)
    return res
} 