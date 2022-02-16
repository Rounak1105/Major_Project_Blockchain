import React from "react";
import {useState} from 'react'
import {Link,useHistory} from 'react-router-dom'

import M from 'materialize-css';
const UnitByOwner=()=>{

  const [unit_id,setunit_id] = useState("")

    const [data_arr,setdata_arr]=useState([])
    const [owner,setowner] = useState("")
    const history = useHistory()
    const GetData=()=>{
        fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=['+'\"'+owner+'\"'+']&peer=peer0.org1.example.com&fcn=queryUnitsByOwner',{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },     
          }
        ).then(res=>res.json())
        .then(data=>{
            
            
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            // M.toast({html:"Item added successfully",classes:"#43a047 green darken-1"})
            console.log(data)
            setdata_arr(data)

            var x = document.getElementById("result");
            console.log(x.visibility);
            x.style.visibility='visible' ;

            
        }
        
        
     }).catch(err=>{
         console.log(err)
     })
        
    }
    return(
        
        <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Mediceit</h2>
          <input
          type="text"
          placeholder="Owner Name"
          value={owner}
            onChange={(e)=>setowner(e.target.value)}
          />Owner Name
   
          <br /><br /><br />
          <div className="input-field col s12">
  
        </div>
         <br /><br /><br />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={()=>GetData()}
          >
              Get Items
          </button>
  
      </div>
      <div id="result"  style={{visibility : 'hidden'}}>
      <h2 style={{textAlign:'center'}}>Details</h2>
        {data_arr.map(item=>{return (
 
        <div id="cards" >
          <br></br>         
            <div id = "leftbox">
            <p >Unit Name : {item.name}</p>
            <p>Manufacturer : {item.manufacturer}</p>
            </div>
            <div id="middlebox">
            <p>Owner : {item.owner}</p>
            <p>Quantity : {item.quantity}</p>
            <p>Date : {item.date}</p>
            </div>
            <div id="rightbox">
            <p>Location : {item.location}</p>
            <p>Remark : {item.remark}</p>
            </div>
            <br></br>
        </div>
        
        )})}
      
      </div>
      
    </div>
    

    )
}



export default UnitByOwner
