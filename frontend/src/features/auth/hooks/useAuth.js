import { login, register, logout } from "../services/auth.api";
import { AuthContext } from "../Auth.context";
import { useContext } from "react";


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context
    
    const handleLogin = async ({email, password})=>{
        setLoading(true)
        try{
            const data = await login({email, password})
            await setUser(data.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async({username, email, password})=>{
        setLoading(true)
        try{
            const data = await register({username, email, password})
            await setUser(data.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    return {handleLogin, handleRegister, handleLogout, loading, user}
} 