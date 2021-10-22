import React from 'react';

import {
  BrowserRouter as Router,
  Switch, Route, Link,
  useHistory,
} from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux'
import { actions, pomodoro } from './redux';

import { usePomodoroLocalStorage, useNotifications } from './pomodoro';

// * Constants

const baseURL= '/react/pomodoro'



function Top (){
  const pomodoro = useSelector(state=>state.pomodoro)
  var text;

  switch(pomodoro.status){
    case 'ready':
      text = 'POMODORO'
      break;
    case 'work':
      text = pomodoro.overtime ? 'TIME FOR A BREAK!' : 'WORK'
      break;
    case 'short':
      text = pomodoro.overtime ? 'BREAK IS OVER' : 'SHORT-BREAK'
      break;
    case 'long':
      text = 'LONG-BREAK'
      break;
    default:
      text= '?'; break;
  }

  return (
    <div className="text-center font-bold text-3xl p-4"
      >{text}</div>
  )
}

function TomatoBox({children}){
  const pomodoro = useSelector(state=>state.pomodoro)
  const dispatch = useDispatch()


  var color = ' border-tomato-dark bg-tomato '

  if(['short','long'].includes(pomodoro.status)){
    color = ' bg-green border-green-dark'
  }
  

  const click = ()=>{
    switch(pomodoro.status){
      case 'ready':
        dispatch(actions.work());       break;
      case 'work':
        if(pomodoro.overtime)
          dispatch(actions.break())
        else
          dispatch(actions.pause());
        break;
      case 'short':
        if(pomodoro.overtime)
          dispatch(actions.complete())
        else
          dispatch(actions.pause());      
        break;
      case 'long':
        if(pomodoro.overtime)
          dispatch(actions.complete())
        else
          dispatch(actions.pause());      
        break;
      // *
      default:  break;  
    }
  }

  return (
    <div 
      onClick={click} 
      className={"w-60 h-60 border-8 rounded-full p-4 mt-8 flex flex-col items-center justify-center relative duration-700 " +color}
    >
      {children}
    </div>)
}


function Tomato(){
  const pomodoro = useSelector(state=>state.pomodoro)

  const paused = <label className=" text-lg italic font-semibold absolute bottom-12 ">PAUSED</label>


  switch(pomodoro.status){
    case 'ready':
      return <TomatoBox>
                <button className="w-full h-full rounded-full text-4xl font-bold ">START</button>
            </TomatoBox>
    case 'work':
      return(<TomatoBox>
        <label className=" text-4xl font-extrabold ">
            {pomodoro.overtime?' - ':''}
            {`${pomodoro.timer.min}:${pomodoro.timer.sec}`}
          </label>
          {pomodoro.paused && paused }
      </TomatoBox>)
    case 'short':
      return (<TomatoBox>
        <label className=" text-4xl font-extrabold ">
            {pomodoro.overtime?' - ':''}
            {`${pomodoro.timer.min}:${pomodoro.timer.sec}`}
          </label>
          {pomodoro.paused && paused }
      </TomatoBox>)
    case 'long':
      return (<TomatoBox>
        <label className=" text-4xl font-extrabold ">
            {pomodoro.overtime?' - ':''}
            {`${pomodoro.timer.min}:${pomodoro.timer.sec}`}
          </label>
          {pomodoro.paused && paused }
      </TomatoBox>)
    default:
      return <TomatoBox>?</TomatoBox>
  }
}


function Cancel(){
  const status = useSelector(state=>state.pomodoro.status)
  const paused = useSelector(state=>state.pomodoro.paused)
  const dispatch = useDispatch()

  var col = ' bg-tomato hover:bg-tomato-dark'
  if(['short','long'].includes(status))
    col = ' bg-green hover:bg-green-dark'

  const cancel = <button 
    className={" m-auto block font-semibold bg-red-300 rounded-lg px-4 py-2 "+col}
    onClick={()=>dispatch(actions.cancel())}>CANCEL</button>
  
  const showCancel = ['work','short','long'].includes(status)
  
  return <div className="absolute bottom-14 w-full"
      >{showCancel && paused && cancel}</div>
}

function PomoCounter(){
  const pomodoro = useSelector(state=>state.pomodoro)

  var color = ' bg-tomato '
  if(['short','long'].includes(pomodoro.status))
    color = ' bg-green '
  
  return (
  <div className="absolute top-4 right-4 " >
    <div  className={" font-extrabold text-2xl w-12 h-12 rounded-full flex items-center justify-center duration-700"+color}
    >{pomodoro.pomodoros}</div>
  </div>)
}

function SettingsLink(){

  return(
    <div className=" absolute bottom-4 w-full" >
      <Link className=" underline font-bold px-4 py-3 bg-gray-500 bg-opacity-20 rounded-lg ml-6" to={baseURL+"/settings"} >
          SETTINGS
      </Link> 
    </div>
  )
}

function Settings(){
  const settings = useSelector(state=>state.pomodoro.settings)
  const dispatch = useDispatch()
  const history = useHistory()

  // console.log(settings)

  const change = (sett)=>{
    for(const key in sett){
      if(typeof sett[key]==='string')
        sett[key] = parseInt(sett[key])
    }
    dispatch(actions.changeSettings(sett))
  }

  
  const permission = ()=>{
    // * DIsable
    if(settings.notificationsEnabled)
      return dispatch(actions.changeSettings({ notificationsEnabled: false }))
    
    // * Enable
    if(!('Notification' in window)) return;
    Notification.requestPermission((res)=>{
      if (res === 'granted') 
        return dispatch(actions.changeSettings({ notificationsEnabled: true }))
    });
  }

  const back = ()=>{
    history.goBack()
  }
        

  return (
    <div className=" bg-gray-100 rounded-lg relative overflow-hidden mx-4 ">
      <div className=" text-2xl font-extrabold text-center bg-gray-400 py-6 " >SETTINGS</div>
      <div className=" grid grid-cols-2 px-6 py-6 grid-rows-5 "  >
        <div className=" col-span-2 text-lg font-bold py-2 underline ">INTERVALS</div>
          
          <div>WORK</div>
          <div>
            <select className="  w-3/4 p-1" value={settings.work} 
              onChange={(ev)=>change({work:ev.target.value})}>
              <option value="20">20 min</option>
              <option value="25">25 min</option>
              <option value="30">30 min</option>
              <option value="35">35 min</option>
              <option value="45">45 min</option>
            </select>
          </div>

          <div>SHORT BREAK</div>
          <div>
            <select className="  w-3/4 p-1" value={settings.short} 
              onChange={(ev)=>change({short:ev.target.value})}>
              <option value="3">3 min</option>
              <option value="5">5 min</option>
              <option value="7">7 min</option>
              <option value="10">10 min</option>
            </select>
          </div>

          <div>LONG BREAK</div>
          <div>
            <select className="  w-3/4 p-1" value={settings.long} 
              onChange={(ev)=>change({long:ev.target.value})}>
              <option value="15">15 min</option>
              <option value="20">20 min</option>
              <option value="25">25 min</option>
              <option value="30">30 min</option>
              <option value="35">35 min</option>
            </select>
          </div>

          <div className="xcol-span-2">LONG BREAK EVERY  </div>
          <div>
            <select className="  w-3/4 p-1" value={settings.set} 
              onChange={(ev)=>change({set:ev.target.value})}>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div>
            TIMER NOTIFICATIONS 
          </div>
          <button className="bg-gray-200 w-3/4 rounded-sm " 
            onClick={permission} >{settings.notificationsEnabled?'DISABLE':'ENABLE'}</button>
          

      </div>
      {/* <Link to={baseURL}> */}
        <div onClick={back} className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-extrabold" >
            X
        </div>
      {/* </Link> */}
    </div>
  )
}

function Pomodoro(){

  const dispatch = useDispatch()
  const pomodoro = useSelector(state=>state.pomodoro)
  const {status} = pomodoro
  

  useNotifications(pomodoro)


  const skip = ()=> dispatch(actions.skip())

  return (
    <>
      <div className="flex flex-col relative h-full tomato-h-max  items-center ">

        <Top />

        <Tomato />
        
        <Cancel /> 

        <PomoCounter />
        <SettingsLink />

        
        {/* <button className="" onClick={()=>dispatch(actions.skip())}>skip</button> */}
        
      </div>
    </>
  )
}


function Header(){
  const pomodoro = useSelector(state=>state.pomodoro)
  var background = 'bg-tomato'
  if(['short','long'].includes(pomodoro.status))  background = 'bg-green'
  return (<header 
    className={" duration-700 text-3xl sm:text-4xl font-heading text-center green py-8 "+background} >
    POMODORO TIMER</header>
  )
}

// timer ticker
function usePomodoroTick(){

  const dispatch = useDispatch()
  const pomodoro = useSelector(state=>state.pomodoro)

  React.useEffect(()=>{
    let delta = Date.now()-pomodoro.lastTick

    let intvl = setTimeout(()=> dispatch(actions.tick())  ,1000-delta)

    return ()=> clearTimeout(intvl)
  },[pomodoro,dispatch])

}

function App() {
  const pomodoro = useSelector(state=>state.pomodoro)
  const dispatch = useDispatch()

  // * Redux initialisations
  React.useEffect(()=>{    
    // check ticksMissed
    dispatch(actions.ticks(pomodoro.ticksMissed))
    dispatch(actions.dev())
  },[])

  // * Local storage sync
  usePomodoroLocalStorage(pomodoro)

  // * Ticker timer
  usePomodoroTick(pomodoro,dispatch)

  var background = 'bg-tomato-light'
  
  if(['short','long'].includes(pomodoro.status))
    background = 'bg-green-light'

  return (
    <Router>
      <div className={"w-screen h-screen flex flex-col duration-700 "+background} >

        <Header />
        <main className="flex-1">
          <div className=" max-w-md m-auto py-8 font-sans h-full ">
            
            <Switch>
              
              <Route exact path={baseURL}>
                <Pomodoro />
              </Route>

              <Route path={baseURL+'/settings'}>
                <Settings />
              </Route>

            </Switch>

          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;
