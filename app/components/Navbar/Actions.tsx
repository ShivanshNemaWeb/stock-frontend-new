'use client'
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
interface User{
    name:string,
    email:string,
    _id:string,
    phone:string
}
import Image from "next/image";
const Actions = () => {
    const [isUser, setIsUser] = useState(false);
    const [user, setUser] = useState<User>();
    const getUser = async (token: string) => {
        try{
            const user = await axios.get('https://stock-backend-new-qrfb.onrender.com/user/profile',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(user.status == 200){
              setIsUser(true);
              setUser(user.data.user);
            }
        }
        catch(error){
             setIsUser(false);
        }
    }
    useEffect(() => {
      const token = Cookies.get('token');
      if(token){
        getUser(token);
      }
    }, [])
    return(
   <>
    {
        isUser?(<>
        <div style={{display:'flex'}}>
        <Image className="selectedColor " src='/Icon/Personal.svg' width={'15'} height={'15'} alt={''} />
        <Link href='/dashboard'>
        <h1 style={{color:'white',marginLeft:'5px',cursor:'pointer'}}>{user?.name}</h1>
        </Link>
        </div>
        </>):(<>
            <div className='flex'>
        <Link href='/login'>
            <button className=' lg:flex justify-end text-xl font-semibold py-2 px-3 lg:px-6 navbutton text-white m-2'>Login</button>
        </Link>
        
        </div>

        </>)
    }
    </>

)
}
export default Actions