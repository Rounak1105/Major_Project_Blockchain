import './App.css';
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Navbar from './containers/Navbar'
import Home from './containers/screen/home'
import Login from './containers/screen/login'
import UpdateItem from './containers/screen/update_item'
import UpdateLocation from './containers/screen/update_location'
import AddItem from './containers/screen/add_item'
import AllUnits from './containers/functions/getAllUnits'
import UnitHistory from './containers/functions/getHistory'
import UnitById from './containers/functions/queryUnitById'
import UnitByOwner from './containers/functions/getUnitByOwner'
import {reducer,initialState} from './containers/reducer'

export const UserContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = localStorage.getItem("user")
    if(user){
      dispatch({type:"USER",payload:user})
    //  history.push('/')

    }else{
      
        history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/"><Home /></Route>
    <Route path="/Login"><Login /></Route>
    <Route path="/UpdateItem"><UpdateItem /></Route>
    <Route path="/UpdateLocation"><UpdateLocation /></Route>
    <Route path="/AddItem"><AddItem /></Route>
    <Route path="/UnitById"><UnitById /></Route>
    <Route path="/UnitByOwner"><UnitByOwner /></Route>
    <Route path="/UnitHistory"><UnitHistory /></Route>
    <Route path="/AllUnits"><AllUnits /></Route>
      
    </Switch>
  )
}


function App() {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
    
       </BrowserRouter>
       </UserContext.Provider >
  );
}

export default App;
