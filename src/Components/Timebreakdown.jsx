import React from 'react';
import { useEffect, useState} from 'react';
import '../App.css';

import { UserAuth } from '../Context/AuthContext';

import { onSnapshot, collection, query} from "firebase/firestore";
import {db} from '../firebase';

export default function Timebreakdown(){
    const {user} = UserAuth();
    const [past7days_studytime, Setpast7days_studytime] = useState([])
    const today = new Date();
    const past7Days = [];

    function formatTime(time) {
        const date = new Date(time * 1000);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}hr ${minutes}min ${seconds}sec`;
    }

    // Get the timestamps for the past 7 days
    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        past7Days.push(day.toISOString().split('T')[0]);
    } 
    
    useEffect(() => {
        async function past7studyhours(){
            const q = query(collection(db, "User", user.uid, 'DailyBreakdown'));
            const unsubscribe = onSnapshot(q, querySnapshot => {
                let todoarray = []
                querySnapshot.forEach((doc) => {
                    let temp = doc.data();
                    todoarray.push([doc.id, temp['dailytime']]);
                });

                let max = -1; // Start with a very low initial value
                for (let i = 0; i < todoarray.length; i++) {
                    const value = todoarray[i][1];
                    if (value > max) {
                        max = value; 
                    }
                }

                const result = past7Days.map((date, index) => {
                    const match = todoarray.find(item => item[0] === date);
                    const value = match ? match[1] : 0;
                    const linebreak = document.getElementById(`avgtimelinebreak${index}`);
                    let length = value*70/max;
                    linebreak.style.width = `${length}%`;  
                    return value;                 
                });

                Setpast7days_studytime(result);
            })
            return () => unsubscribe();
        }
        past7studyhours();
    }, []);

    return(
        <div className='timespent'>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[0]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak0'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[0])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[1]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak1'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[1])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[2]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak2'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[2])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[3]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak3'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[3])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[4]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak4'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[4])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[5]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak5'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[5])}</h5>
            </div>
            <div className='studytimeperday'>
                <h4 className='timespentonday'>{past7Days[6]}</h4>
                <hr className='timespentonday' id='avgtimelinebreak6'></hr>
                <h5 className='timespentonday'>&nbsp;{formatTime(past7days_studytime[6])}</h5>
            </div>
        </div>
    );
}