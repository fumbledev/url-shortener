import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error.jsx'
import * as Yup from 'yup'
import useFetch from '@/hooks/useFetch'
import { login } from '@/db/apiAuth'
const Login = () => {

    const [formdata,setFormData] = useState({
        email : "",
        password : ""
    })
    const [errors,setErrors] = useState({})


    const handleInputChange = (e) => {
        const {name,value} = e.target
        setFormData((prevState)=>({
            ...prevState,
            [name] : value,

        }))
    }

    const {data,error,loading,fn:fnLogin} = useFetch(login)

    useEffect(()=>{
        console.log(data)
        // if(error===null && data)
    },[data,error])

    const handleLogin = async() =>{
        setErrors([])
        try{
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Invalid Email")
                    .required("Email is Required"),
                password: Yup.string()
                    .min(6,"Password must be at least 6 characters")
                    .required("Password is Required")
            })
            await schema.validate(formdata,{abortEarly:false})
            await fnLogin(formdata)
        }catch(e){
            const newErrors = {};
            e?.inner?.forEach((err) => {
            newErrors[err.path] = err.message;
            });
            setErrors(newErrors);

        }
    }

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    to your account if you already have one
                </CardDescription>
                {error && <Error message={error.message}/>}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className='space-y-1'>
                    <Input value={formdata.email} onChange={handleInputChange} name="email" type="email" placeholder="Please enter your email"/>
                    {errors.email && <Error message={errors.email}/>}
                </div>
                <div className='space-y-1'>
                    <Input onChange={handleInputChange} name="password" type="password" placeholder="Please enter your password"/>
                    {errors.password && <Error message={errors.password}/>}
                </div>
            </CardContent>
            <CardFooter>
                <Button type="button" value={formdata.password} onClick={handleLogin} className="cursor-pointer">
                    {loading ? <BeatLoader size={10} color='#36d7b7'/> : "Login"}
                </Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Login
