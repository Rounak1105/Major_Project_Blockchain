import React from "react";
import {useState} from 'react'
import {Link,useHistory} from 'react-router-dom'

import M from 'materialize-css';
const UnitById=()=>{

  const [unit_id,setunit_id] = useState("")

    
    const [unit_name,setunit_name] = useState("")
    const [owner,setowner] = useState("")
    const [manufacturer,setmanufacturer] = useState("")
    const [quantity,setquantity] = useState("")
    const [date,setdate] = useState("")
    const [location,setlocation] = useState("")
    const [remark,setremark] = useState("")
    const history = useHistory()
    const GetData=()=>{
        fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=['+'\"'+unit_id+'\"'+']&peer=peer0.org1.example.com&fcn=queryUnit',{
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
            console.log(data['name'])
            setunit_name(data['name']);
            setmanufacturer(data['manufacturer']);
            setowner(data['owner']);
            setquantity(data['quantity']);
            setdate(data['date']);
            setlocation(data['location']);
            setremark(data['remark']);
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
          placeholder="Item Id"
          value={unit_id}
            onChange={(e)=>setunit_id(e.target.value)}
          />Item Id
   
          <br /><br /><br />
          <div className="input-field col s12">
  
        </div>
         <br /><br /><br />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={()=>GetData()}
          >
              Get Item
          </button>
  
      </div>
      <div id="result"  style={{visibility : 'hidden'}}>
      <div className="card auth-card input-field">
          <h2>Details</h2>
          <h5>Unit Id : {unit_id}</h5>
          <h5>Unit Name : {unit_name}</h5>
          <h5>Manufacturer : {manufacturer}</h5>
          <h5>Owner : {owner}</h5>
          <h5>Quantity : {quantity}</h5>
          <h5>Date : {date}</h5>
          <h5>Location : {location}</h5>
          <h5>Remark : {remark}</h5>
            
      </div>
      </div>
      
    </div>
    

    )
}



export default UnitById
