import React, { useEffect, useState } from 'react';
import '../App.css';
import RequestItem from "./IndividualRequest";

import { query, collection, onSnapshot } from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function AllRequests(){
    const {user} = UserAuth();
    const [request, setrequest] = useState([]);

    // get all the requests from the database
    useEffect(()=>{
        const uid = user?.uid;
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
                                <h1 style={{color: "#213547"}}> No Incoming Requests... </h1>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}