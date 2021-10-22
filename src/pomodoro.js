import React from "react";
import icon from './logo192.png'

const localStorageKey = 'pomodoro-pwa-timer-storage'

function checkTicksMissed(pomodoro){
    
    // if inactive, none missed
    if(pomodoro.status==='ready')   return 0;
    if(pomodoro.paused)     return 0;

    let ticksMissed = Math.floor( (Date.now()-pomodoro.lastTick)/1000 )
    return ticksMissed;
}

function usePomodoroLocalStorage(pomodoro){
  React.useEffect(()=>{    
    if(pomodoro.status==='ready')
      window.localStorage.removeItem(localStorageKey)
    else 
      window.localStorage.setItem(localStorageKey, JSON.stringify(pomodoro) )
  },[pomodoro])
}

function checkPomodoroLocalStorage(){
    
    const storage = window.localStorage.getItem(localStorageKey)
    if(!storage)        return {};

    try {
        const json = JSON.parse(storage)
        return json;
    }
    catch(e){
        return {};
    }
}


const showNotification = (status)=>{
  var msg;
  if(status==='work')
    msg = 'Work is over, take a break! : ) '
  else if(['short','long'].includes(status))
    msg = 'Break is over, Pomodoro complete! : ) '
    
  try {
    new Notification('Pomodoro',{ 
      body: msg, 
      icon: icon,
      vibrate: [200, 100, 200],
    });
  } catch (err) {
    console.error('Notification API error: ' + err);
  }
}

function useNotifications(pomodoro){

  // notification triggered state
  const [notification,setNotification] = React.useState({ 
    timerActive: false, triggered: false,
  })

  React.useEffect(()=>{    

    if(['work','short','long'].includes(pomodoro.status) && !pomodoro.paused){  // timer mode & not paused

      if(!notification.timerActive) // active timer
        return setNotification({...notification, timerActive: true })

      if(pomodoro.overtime){    // check trigger
        if(!notification.triggered ){ 
          
          // * notifications disabled
          if(pomodoro.settings.notificationsEnabled){

            if('Notification' in window){
              
              if(Notification.permission==='granted'){
                showNotification(pomodoro.status)
              }
              else  // re-request
                Notification.requestPermission(()=>{
                  showNotification(pomodoro.status)
                });
              
              
            }
          }
          setNotification({...notification, triggered: true })
        }
      }
      else   // reset trigger
        if(notification.triggered)
          setNotification({...notification, triggered: false })
    }
    else if(notification.timerActive)
      setNotification({ triggered: false, timerActive: false })
  },[pomodoro,notification])
}


export { 
    checkTicksMissed, 
    usePomodoroLocalStorage,
    checkPomodoroLocalStorage,
    useNotifications,
}