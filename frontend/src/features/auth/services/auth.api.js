import axios from 'axios'

const api = axios.create({
    url: 'http://localhost:3000',
    withCredentials:true
})

//Login api
export async function login({email, password}){
    try{
        const response = await api.post("/api/auth/register",{email, password})
        return response
    }catch(err){
        console.log(err)
    }
}

//Register api
export async function register({username, email, password}){
    try{
        const response = await api.post("/api/auth/register", {username, email, password})
        return response
    }catch(err){
        console.log(err)
    }
}

//Logout api
export async function logout(){
    try{
        const response = await api.post("/api/auth/logout")
        return response
    }catch(err){
        console.log(err)
    }
}

//Get refresh token
export async function getRefreshToken(){
    try{
        const response = await api.post("/api/auth/refresh-token")
        return response
    }catch(err){
        console.log(err)
    }
}