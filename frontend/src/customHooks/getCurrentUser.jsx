import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
const getCurrentUser = ()=>{
    let dispatch = useDispatch()
   
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
                dispatch(setUserData(result.data))

            } catch (error) {
                console.log(error)
                if (error?.response?.status === 401) {
                    localStorage.removeItem("token")
                }
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser