
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { checkPomodoroLocalStorage, checkTicksMissed, } from './pomodoro';


const initial = {
    status: 'ready',
    paused: false,
    overtime: false,
    settings: {
        work: 35,    short: 5,   
        long: 15,  set: 4,
        notificationsEnabled: true,
    },
    timer: {
        begin: 0, period: 0, min:0, sec: 0,
    },
    pomodoros: 0,
    history: [],
}

function getInitialState(){
    let stored = checkPomodoroLocalStorage()
    stored = clearHist(stored)
    let missed = checkTicksMissed(stored)
    // console.log( ' init  ', stored)
    return { ...initial, ...stored, ticksMissed: missed  }
}

function timeString(){
    return Math.floor( Date.now()/1000 )
}

function countTick(state){
    state.lastTick = Date.now()
    if(!state.overtime){ // countdown
        state.timer.sec --;
        if(state.timer.sec<0){
            state.timer.sec = 59
            state.timer.min--
            if(state.timer.min<=0){
                state.overtime = true
                state.timer.min = 0
                state.timer.sec = 0
            }
        }
    }
    if(state.overtime){ // overtime
        state.timer.sec++
        if(state.timer.sec>59){
            state.timer.sec = 0
            state.timer.min++
        }
    }
    return state;
}

function clearHist(state){
    // clear old & update count
    let now = timeString()
    if(state.history){
        state.history = state.history.filter(t=> (now-t)<(4*3600) )
    }
    else    state.history = []
    state.pomodoros = state.history.length
    return state;
}

const pomodoroSlice = createSlice({
    name: 'pomodoro',
    initialState: getInitialState(),
    reducers: {

        cancel: state => {
            state.status = 'ready'
            state.paused = false
            state.overtime = false
        },

        work: state => {
            state.status = 'work'
            state.overtime = false
            state.lastTick = Date.now()
            state.timer = {
                period: state.settings.work,
                min:    state.settings.work,
                sec: 0,
            }
        },

        break: state => {
            if((state.pomodoros+1)%state.settings.set===0){
                state.timer.min = state.settings.long
                state.status = 'long'
            }
            else{
                state.timer.min = state.settings.short
                state.status = 'short'
            }
            state.timer.sec = 0
            state.overtime = false
        },

        tick: state => {
            if(!state.paused && (state.status)!=='ready' ){
                state = countTick(state)
            }
        },

        ticks: (state,action)=>{
            for(let x=0;x<action.payload;x++){
                state = countTick(state)
            }
        },

        skip: state => {
            state.timer.min = 0
            state.timer.sec = 3
        },

        pause: state =>{
            state.paused = !state.paused
        },

        complete: state => {
            state.status = 'ready'
            state.history.push(timeString())
            state.pomodoros = state.history.length
            // state = clearHist(state)
        },

        changeSettings: (state,action) => {
            state.settings = { ...state.settings, ...action.payload }
        },

        dev: state=> {
        },
    },
})

const store = configureStore({  
    reducer: {
        pomodoro: pomodoroSlice.reducer,
    },
})
export default store

const pomodoro = pomodoroSlice.reducer
const actions = pomodoroSlice.actions


export { pomodoro, actions }
