import React, { useEffect, useState } from 'react';
import '../App.css';
import FeedEntry from './FeedEntry';

import { query, collection, onSnapshot, doc, getDoc, where, DocumentReference} from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function Feed(){
    const {user} = UserAuth();
    const[colabtask, setcolabtask] = useState([]);
    
    useEffect(()=>{
        let classesincluded = [];
        let dontinclude = [];
        const uid = user?.uid;
        const docRef = doc(db, 'User', String(uid));
        // const docSnap = await getDoc(docRef);
        let q = null;
        let path = false;
        getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.exists()){
                    classesincluded = snapshot.data().allclass;
                    classesincluded.push("DummyClass");
                    // console.log("classesincluded", classesincluded);
                    dontinclude = snapshot.data().deniedfeed;
                    dontinclude.push("DummyTask");
                    // console.log("dontinclude", dontinclude);
                    q = query(collection(db, "TaskColab"), where("cname", "in", classesincluded), where("username", "!=", String(uid)));
                    path = true;
                } else {
                    q = query(collection(db, "TaskColab"), where("username", "!=", String(uid)));
                }

                const unsubscribe = onSnapshot(q, querySnapshot => {
                    let todoarray = [];
                    querySnapshot.forEach((doc) => {
                        todoarray.push({ ...doc.data(), id: doc.id });
                    });
                    // console.log("taskcolab all", path, todoarray);
                    // filter out so that already denied feed wont show
                    if(path){
                        const filteredarr = todoarray.filter(item => !dontinclude.includes(item.id));
                        setcolabtask(filteredarr);
                    } else {
                        setcolabtask(todoarray);
                    }
                });
                return () => unsubscribe();
            })
    });

    return(
        <div className='FeedDiv'>
            <div className='FeedContent'>
            <h1 className='FeedTitle' >feed</h1>
            <h2 className="FeedSubtitle"> find some people to study with. </h2>
            {colabtask && colabtask.length > 0 ? 
                (
                    <div className="FeedGrid">
                        {colabtask.map((item, index) => <FeedEntry key={index} {...item}/>)}
                    </div>
                )
                :
                (
                    <div className='nomatchfeed'>
                        <h1 style={{color: "#213547"}}> No matching tasks found </h1>
                    </div>
                )
                
            }
                
            </div>
        </div>
    );
}