import React from "react";
import {useState,useContext} from 'react'
import M from 'materialize-css';
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import mp2 from './mp2.png';



const Login=()=>{
    const [password,setPasword] = useState("")
    const [name,setName] = useState("")
    const [role,setrole] = useState("")
    const history = useHistory()
    const {state,dispatch}=useContext(UserContext)
    const User_register=(access)=>{
        console.log(access)
        fetch("http://localhost:4000/users",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                
                "username":name,
                "orgName":"Org1",
                "role":access
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            localStorage.setItem("jwt",data.token)
            localStorage.setItem("user",name)
            dispatch({type:"USER",payload:data.user})
            M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
            history.push('/')
            window.location.reload();
        }
     }).catch(err=>{
         console.log(err)
     })
        
    }
    

    const Signin=()=>{
        fetch("http://localhost:4000/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                
                "username":name,
                "password":password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)

           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            setrole(data.role)

            console.log(data.role)
            // M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
            User_register(data.role)
            
        }
     }).catch(err=>{
         console.log(err)
     })
        
    }
    
    return(
        <><div><img className='login_image' src={mp2}/>
        <div className="mycard" style={{width:"600px",paddingLeft:"1%"}} >
        
            <div className="card auth-card input-field" style={{float:"left"}}>
                <h2>Mediceit</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)} />
        
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => Signin()}
                >
                    Login
                </button>
        
        
            </div>
            </div>
        </div></>


    )
}

export default Login


{/*  */}