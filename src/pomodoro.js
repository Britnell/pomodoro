import React from "react";

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


export { 
    checkTicksMissed, 
    usePomodoroLocalStorage,
    checkPomodoroLocalStorage,
}