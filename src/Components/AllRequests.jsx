import React, { useEffect, useState } from 'react';
import '../App.css';
import { Outlet } from 'react-router-dom';
import RequestItem from "./IndividualRequest";

import { query, collection, onSnapshot } from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function AllRequests(){
    const {user} = UserAuth();
    const [request, setrequest] = useState([]);

    /* async function getuid(){
        const usr = await user;
        // if(usr == null){
        //     //wait 1 second for user to load
        //     await new Promise(r => setTimeout(r, 1000));
        // }
        // console.log(`await in allreq usr: ${usr.uid}`)
        return usr.uid;
    } */

    useEffect(()=>{
        const uid = user?.uid/* getuid() */;
        const q = query(collection(db, 'User', String(uid), 'Requests'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            let todoarray = []
            querySnapshot.forEach((doc)=> {
                todoarray.push({...doc.data(), id:doc.id})
            });
            setrequest(todoarray);
        })
        return () => unsubscribe();
    }, [])

    // console.log(request);

    return(
        <div className='Requestparent'>
            <div className='AllRequestsDiv'>
                <div className='AllRequestsContent'>
                    <h1 className='AllRequestsTitle' >requests</h1>
                    <h2 className="AllRequestsSubtitle"> people who want to work with you </h2>
                    
                    { request && request.length > 0 ?
                        (
                            <div className="Requestcomp">
                                {request.map((items,index) => <RequestItem key={index} {...items}></RequestItem>)}
                            </div>
                        )
                        :
                        (
                            <div className='noincomingreq'>
                                <h1> No Incoming Requests... </h1>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}