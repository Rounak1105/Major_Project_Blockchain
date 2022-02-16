import React from "react";
import {useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css';

const UnitById=()=>{

  const [data_arr,setdata_arr]=useState([])
  
  const history = useHistory()
  const GetData=()=>{
      fetch('http://localhost:4000/channels/mychannel/chaincodes/fabcar?args=['+'\"'+'\"'+']&peer=peer0.org1.example.com&fcn=queryAllUnits',{
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
        <br></br>
        <div className="input-field col s12">

      </div>
       <br /><br /><br />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
      onClick={()=>GetData()}
        >
            Get All Items
        </button>

    </div>
    <div id="result"  style={{visibility : 'hidden'}}>
    <h2 style={{textAlign:'center'}}>Details</h2>
      {data_arr.map(item=>{return (

      <div id="cards" >
        <br></br>         
          <div id = "leftbox">
          <p >Unit ID : {item.Key}</p>
          <p >Unit Name : {item.Record.name}</p>
          <p>Manufacturer : {item.Record.manufacturer}</p>
          </div>
          <div id="middlebox">
          <p>Owner : {item.Record.owner}</p>
          <p>Quantity : {item.Record.quantity}</p>
          <p>Date : {item.Record.date}</p>
          </div>
          <div id="rightbox">
          <p>Location : {item.Record.location}</p>
          <p>Remark : {item.Record.remark}</p>
          </div>
          <br></br>
      </div>
      
      )})}
    </div>
  </div>
  )
}


export default UnitById
