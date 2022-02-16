import React from "react";
import {useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import axios from 'axios';

import M from 'materialize-css';
import options from 'materialize-css';
const UnitHistory=()=>{
  const [unit_id,setunit_id] = useState("")
  const [data_arr,setdata_arr]=useState([])
    const history = useHistory()
    const GetData=()=>{
        fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=['+'\"'+unit_id+'\"'+']&peer=peer0.org1.example.com&fcn=getHistoryForUnit',{
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
            x.style.visibility='visible'     
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
    <h2 style={{textAlign:'center'}}>Details of {unit_id}</h2>
      {data_arr.map(item=>{return (

      <div id="cards" >
        <br></br>         
          <div id = "leftbox">
          
          <p >Unit Name : {item.Value.name}</p>
          <p>Manufacturer : {item.Value.manufacturer}</p>
          <p>Owner : {item.Value.owner}</p>
          </div>
          <div id="middlebox">
          
          <p>Quantity : {item.Value.quantity}</p>
          <p>Date : {item.Value.date}</p>
          <p>Location : {item.Value.location}</p>
          </div>
          <div id="rightbox">
          
          <p >Timestamp : {item.Timestamp}</p>
          <p>Remark : {item.Value.remark}</p>
          </div>
          <br></br>
      </div>
      
      )})}
    </div>
  </div>
    
    )
}

export default UnitHistory
