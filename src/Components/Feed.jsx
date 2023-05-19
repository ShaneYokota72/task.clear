import React, { useEffect, useState } from 'react';
import '../App.css';
import FeedEntry from './FeedEntry';

import { query, collection, onSnapshot, doc, getDocs, where} from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function Feed(){
    const {user} = UserAuth();
    const[colabtask, setcolabtask] = useState([]);
    const [classesincluded_arr, setclassesincluded_arr] = useState(["palceholder"]);
    const [dontinclude_arr, setdontinclude_arr] = useState(["placeholder"]);

    useEffect(()=>{
        let classesincluded = [];
        let dontinclude = [];
        const uid = user?.uid;
        const docRef = doc(db, 'User', String(uid));

        const unsubscribe = onSnapshot(docRef, (doc) => {
            classesincluded = doc.data().allclass;
            classesincluded.push("DummyClass");
            setclassesincluded_arr(classesincluded);
            // console.log("classesincluded", classesincluded);
            dontinclude = doc.data().deniedfeed;
            dontinclude.push("DummyTask");
            setdontinclude_arr(dontinclude);
            // console.log("dontinclude", dontinclude);
        });
        return () => unsubscribe();
    }, [])

    useEffect(()=>{
        const q = query(collection(db, "TaskColab"), where("cname", "in", classesincluded_arr), where("username", "!=", String(user?.uid)));

        getDocs(q)
            .then((snapshot) => {
                let allfeed = [];
                snapshot.forEach((doc) => {
                    allfeed.push({ ...doc.data(), id: doc.id });
                })
                const filteredarr = allfeed.filter(item => !dontinclude_arr.includes(item.id));
                setcolabtask(filteredarr);
            })
    }, [classesincluded_arr, dontinclude_arr]);

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