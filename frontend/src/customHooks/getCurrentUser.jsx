import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser = () => {
    const dispatch = useDispatch()
   
    useEffect(() => {
        const fetchUser = async () => {
            const hasToken = localStorage.getItem("token")
            const hasUser = localStorage.getItem("user")
            
            // If neither token nor cached user exists, mark loading false and null user
            if (!hasToken && !hasUser) {
                dispatch(setUserData(null))
                return
            }

            try {
                const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true })
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log("getCurrentUser error:", error)
                // Only clear the session if the server explicitly rejected the token (401/403/404)
                if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
                    dispatch(setUserData(null))
                }
            }
        }
        fetchUser()
    }, [dispatch])
}

export default getCurrentUser
