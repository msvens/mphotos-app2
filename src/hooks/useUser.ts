import {User} from "../api/types";
import {useEffect, useState} from "react";
import PhotosApi from "../api/photoapi";

export const useUser: () => [boolean, User, () => void] = () => {
    const emptyUser: User = {name: "", bio: "", pic: ""}
    const [isUser, setIsUser] = useState<boolean>(false)
    const [user, setUser] = useState<User> (emptyUser)
    const [refresh, setRefresh] = useState<boolean> (false)

    function checkUser() {
        setRefresh(prev => !prev)
    }

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await PhotosApi.isLoggedIn()
                const res1 = await PhotosApi.getUser()
                setUser(res1)
                setIsUser(res)
            }  catch(error) {
                alert("rror fetching user: "+error.toString())
            }
        }
        fetchData()
    }, [refresh])

    return [isUser, user, checkUser]
}