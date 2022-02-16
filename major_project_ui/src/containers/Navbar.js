import React,{useEffect,createContext,useReducer,useContext} from 'react';
import M from 'materialize-css';
import options from 'materialize-css';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'
import logo from './logo.png';

const Navbar=()=>{
        const {state,dispatch}=useContext(UserContext)
        const history=useHistory()
        const RenderList=()=>{
          if(state){
            return [ 
              <><li><a href="/">Home</a></li><li><a href="/AddItem">Add Item</a></li><li><a href="/UpdateItem">Update Item</a></li><li><a href="/UpdateLocation">Update Location</a></li><li><a class='dropdown-trigger btn' style={{backgroundColor:"transparent"}} href='#' data-target='dropdown1'>Functions ▼</a>

                <ul id='dropdown1' class='dropdown-content'>
                  <li><a href="/UnitById">Get Unit By Id</a></li>
                  <li><a href="/UnitByOwner">Get Unit By Owner</a></li>
                  <li><a href="/UnitHistory">Get Unit History</a></li>
                  <li><a href="/AllUnits">Get All Units</a></li>
                  

                </ul>
                
              </li>
              <button className="btn #c62828" style={{backgroundColor:"transparent"}}
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }}
            >
                Logout
            </button>
              </>
              
            ]
          }
          else{
            return [
              <li><a href="/Login">Login</a></li>

            ]
          }
        }
        return(
    <nav>
    <div className="nav-wrapper">
      {/* <a href="#" className="brand-logo">Logo</a> */}
      <img src={logo} height="50px" style={{paddingTop:"13px"}}  />
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {RenderList()}
      </ul>
    </div>
    </nav>
    )

}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, options);
});



export default Navbar