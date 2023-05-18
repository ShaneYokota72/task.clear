import React, { useState, useEffect } from 'react';
import '../App.css';
import Avgtimepertask from './Avgtimepertask';
import Timebreakdown from './Timebreakdown';
import {Link} from 'react-router-dom';

import { query, collection, onSnapshot } from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function Analytics(){
    const {user} = UserAuth();
    const [analytics, setanalytics] = useState(null);

    // get all the analytics from the database
    useEffect(() => {
        const q = query(collection(db, "User", user.uid, "Analytics"));
        const unsubscribe = onSnapshot(q, quarySnapshot => {
            let analyticsarray = [];
            quarySnapshot.forEach((doc) => {
                analyticsarray.push({...doc.data(), id:doc.id})
            });
            setanalytics(analyticsarray);
            // console.log(analyticsarray)
        })
        return () => unsubscribe();
    }, [])
    // console.log(analytics);

    return(
        <div className='AnalyticsDiv'>
            <div className='AnalyticsContent'>
                <h1>Analytics</h1>
                <Link to='/' className='backtohomebutton'>
                    <svg className='backtohomebutton-bi bi-x-circle' xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" /* class="bi bi-x-circle" */ viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </Link>
            </div>
            <h3 className='analyticsh3'>here's the average time you've spent studying</h3>
            <hr className='linebreak'></hr>
            <h2 className='analyticsh2'>For each assignment, your average for each task was:</h2>
            {analytics && analytics.length >0 ?
                (
                    <div style={{display: 'flex'}}>
                        {analytics.map((item, index) => (<Avgtimepertask key={index} {...item}/>))}
                    </div>
                )
                :
                (
                    <div className='nomatchfeed'>
                        <h4> No Task for analysis </h4>
                    </div>
                )
            }
            <br></br>
            <h2 className='analyticsh2'>The daily breakdown for this past week:</h2>
            <Timebreakdown></Timebreakdown>
        </div>
    );
}