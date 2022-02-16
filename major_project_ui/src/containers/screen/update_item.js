import React from "react";
import {useState} from 'react'
import M from 'materialize-css';
import {Link,useHistory} from 'react-router-dom'

const UpdateItem=()=>{

    const [unit_id,setunit_id] = useState("")
    const [owner,setowner] = useState("")
    const [location,setlocation] = useState("")
    
    const history = useHistory()
    const UpdateData=()=>{
        fetch("http://localhost:4000/channels/mychannel/chaincodes/fabcar",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                "fcn":"restrictedChangeUnitOwner",
                "peers":["peer0.org1.example.com","peer0.org2.example.com"],
                "chainCodeName":"fabcar",
                "channelName":"mychannel",
                "args":[unit_id,owner,location]
                
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              M.toast({html: data.message,classes:"#c62828 red darken-3"})
           }
           else{
        

            // dispatch({type:"USER",payload:data.user})
            M.toast({html:"Item added successfully",classes:"#43a047 green darken-1"})
            
        }
     }).catch(err=>{
         console.log(err)
     })
        
    }

    return(
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Update Item</h2>
            <input
            type="text"
            placeholder="Item Id"
            value={unit_id}
            onChange={(e)=>setunit_id(e.target.value)}
            />Item Id
            <input
            type="text"
            placeholder="Owner Name"
            value={owner}
            onChange={(e)=>setowner(e.target.value)}
            />Owner Name
            <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e)=>setlocation(e.target.value)}
            />Location
            <br /><br /><br />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>UpdateData()}
            >
                Update Owner
            </button>
           
    
        </div>
      </div>
    )
}

export default UpdateItem