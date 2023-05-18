import React from 'react';
import { useState, useEffect} from 'react';
import '../App.css';

import { deleteDoc, doc, getDoc, getDocs, updateDoc, query, collection, setDoc } from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';
import taskcomp_a from '../Images/Group 100.png';
import taskcomp_b from '../Images/Group 103.png';
import taskdel_a from '../Images/TaskDel_a.png';
import taskdel_b from '../Images/TaskDel_b.png';

export default function Task(props){
    const {user} = UserAuth();
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [a_time, seta_time] = useState(0);
    useEffect(() => {
        setTime(props.timespent);
    }, [props])
    // debug statement
    // console.log(`${props.aname} with id of ${props.id} with time of ${props.timespent} is being created`);
      
    const [bcont, setbcont] = useState("Start");
    const [taskcomp, settaskcomp] = useState(taskcomp_a);
    const [taskdel, settaskdel] = useState(taskdel_a);

    const handleHover = () => {
        settaskcomp(taskcomp_b)
    }
    const undoHover = () => {
        settaskcomp(taskcomp_a)
    }
    const handleHoverX = () => {
        settaskdel(taskdel_b)
    }
    const undoHoverX = () => {
        settaskdel(taskdel_a)
    }

    useEffect(() => {
        let interval;
        if(isActive && !isPaused){
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    function formatTime(time) {
        const date = new Date(time * 1000);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    function handleStart(){
        seta_time(time);
        const docRef = doc(db, 'User', user.uid, 'Assignments', props.id);
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    updateDoc(docRef, {
                        timespent: time
                    });
                }
            })
        if(!isActive && isPaused){
            setbcont("Resume");
            setIsPaused(false);
            setIsActive(true);
        }
    }
    
    async function add_daily_time(time_to_add){
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const daily_breakdown_Ref = doc(db, 'User', user.uid, 'DailyBreakdown', formattedDate)
        getDoc(daily_breakdown_Ref)
            .then((snapshot) => {
                if(snapshot.exists()){
                    let originaltime = snapshot.data().dailytime;
                    originaltime = originaltime + time_to_add;
                    updateDoc(daily_breakdown_Ref, {
                        dailytime: originaltime
                    })
                } else {
                    setDoc(daily_breakdown_Ref, {
                        dailytime: time_to_add
                    })
                }
            })
    }

    function handlePause(){
        add_daily_time((time - a_time))
        const docRef = doc(db, 'User', user.uid, 'Assignments', props.id);
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    updateDoc(docRef, {
                        timespent: time
                    });
                }
            })
        if(isActive){
            setbcont("Resume");
            setIsPaused(true);
            setIsActive(false);
        }
    }

    // after completing/deleting the assignment update the allclass list appropriately
    async function updateallclass(props){
        const assignments = query(collection(db, 'User', user.uid, 'Assignments'));
        let allcurrent_tasks = []
        const querySnapshot = await getDocs(assignments);
        querySnapshot.forEach((doc) => {
            if (!allcurrent_tasks.includes(doc.data().cname)) {
                allcurrent_tasks.push(doc.data().cname);
            }
        });

        if(!allcurrent_tasks.includes(props.cname)){
            //delete this class from the allclass list
            let userallclass = [];
            const userDocRef = doc(db, 'User', user.uid);
            const docSnap = await getDoc(userDocRef);
            if(docSnap.exists()){
                userallclass = docSnap.data().allclass;
            }
            userallclass = userallclass.filter(item => item != props.cname);

            updateDoc(userDocRef, {
                allclass: userallclass //allclass del props.cname
            })
        }
    }

    async function addtoanalysis(props){
        const docRef = doc(db, 'User', user.uid, 'Analytics', props.cname);
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let originalavgtime = snapshot.data().avgtime;
                    originalavgtime.push(props.timespent);
                    updateDoc(docRef, {
                        avgtime : originalavgtime
                    })
                } else {
                    setDoc(docRef, {
                        avgtime : [props.timespent]
                    });
                }
            })
    }

    async function deletetask(props){
        await deleteDoc(doc(db, 'User', user.uid, 'Assignments', props.id));
        await deleteDoc(doc(db, 'TaskColab', props.id));
        setIsActive(false);
        setIsPaused(true);
        setbcont("Start");
        updateallclass(props);
    }

    const taskcompleted = async (props) => {
        await deletetask(props);
        // in addition, save to the analysis db
        await addtoanalysis(props);
    }

    return(
        <div className='TaskDiv'>
            <div className='TaskInfo'>
                <h1>{props.cname}</h1>
                <h5>Assignment</h5>
                <h3>{props.aname}</h3>
                <h5>Due date</h5>
                <h3>{props.ddate}</h3>
            </div>
            <div className='Timer'>
                <h1 style={{color: "#213547"}}>{formatTime(time)/* time */}</h1>
                <div className='timerbutton'>
                    <button onClick={() => handleStart()} className="start-resume-button">{bcont}</button>
                    <button onClick={() => handlePause()} className="pause-button"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
                    <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                    </svg></button>
                </div>
                <div className='task-complete'>
                    <button className="task-complete-button">
                        <center onClick={() => taskcompleted(props)}><a href="#"><img src={taskcomp} onMouseOver={handleHover} onMouseLeave={undoHover}/></a></center>
                    </button>
                    <button className="task-complete-button">
                        <center onClick={() => deletetask(props)}><a href="#"><img src={taskdel} onMouseOver={handleHoverX} onMouseLeave={undoHoverX}/></a></center>    
                    </button>
                </div>
            </div>
        </div>
    );
}