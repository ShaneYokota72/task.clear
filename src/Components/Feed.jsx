import React, { useEffect, useState } from 'react';
import '../App.css';
import FeedEntry from './FeedEntry';

import { query, collection, onSnapshot, doc, getDoc, where} from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function Feed(){
    const {user} = UserAuth();
    const[colabtask, setcolabtask] = useState([]);
    
    useEffect(()=>{
        async function filterdata(){
            let classesincluded = [];
            let dontinclude = [];
            const uid = user?.uid;
            const docRef = doc(db, 'User', String(uid));
            const docSnap = await getDoc(docRef);
            let q = null;
            let path = false;
            // get user's allclass and deniedfeed
            if (docSnap.exists()) {
                classesincluded = docSnap.data().allclass;
                classesincluded.push("DummyClass");
                dontinclude = docSnap.data().deniedfeed;
                dontinclude.push("DummyTask");
                q = query(collection(db, "TaskColab"), where("cname", "in", classesincluded), where("username", "!=", String(uid)));
                path = true;
            } else {
                q = query(collection(db, "TaskColab"), where("username", "!=", String(uid)));
            }

            /* const q = query(collection(db, "TaskColab"));
            const unsubscribe = onSnapshot(q, querySnapshot => {
                let todoarray = []
                querySnapshot.forEach((doc)=> {
                    todoarray.push({...doc.data(), id:doc.id})
                });
                // filter to only get the class the user take
                const filteredData = todoarray.filter(item => classesincluded.includes(item.cname));
                // filter out so that already denied feed wont show
                const filteredData2 = filteredData.filter(item => !dontinclude.includes(item.id));
                // filter out so that the user wont see his own task
                const filteredData3 = filteredData2.filter(item => item.username != user.uid);
                // set the colab tasks after all the filteration
                setcolabtask(filteredData3);
            }) */

            // const q = query(collection(db, "TaskColab"), where("cname", "in", classesincluded), where("id", "not-in", dontinclude), where("username", "!=", String(uid)));
            
            const unsubscribe = onSnapshot(q, querySnapshot => {
                let todoarray = [];
                querySnapshot.forEach((doc) => {
                    todoarray.push({ ...doc.data(), id: doc.id });
                });
                console.log("taskcolab all", path, todoarray);
                // filter out so that already denied feed wont show
                if(path){
                    const filteredarr = todoarray.filter(item => !dontinclude.includes(item.id));
                    setcolabtask(filteredarr);
                } else {
                    setcolabtask(todoarray);
                }
            });
            return () => unsubscribe();
        }
        filterdata();
    }, []);


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