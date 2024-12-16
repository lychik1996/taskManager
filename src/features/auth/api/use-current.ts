import { useQuery } from "@tanstack/react-query"
import axios from "axios";

const postLogin = async()=>{
    const res = await axios.get('/api/protect/current');
    return res.data;
}

export const useCurrent = ()=>{
    const query =useQuery({
        queryKey:['current'],
        queryFn:async()=>{
            const data = await postLogin();
            return data?data:null;
        },
        retry:0
    })
    return query;
}