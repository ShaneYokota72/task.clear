import React, { useEffect, useState } from 'react';
import '../App.css';
import { Outlet, useFetcher } from 'react-router-dom';
import RequestItem from './IndividualRequest';
import FeedEntry from './FeedEntry';

import { query, collection, onSnapshot, doc, getDoc} from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

export default function Feed(){
    const {user} = UserAuth();
    const[colabtask, setcolabtask] = useState([]);
    
    useEffect(()=>{
        async function filterdata(){
            let classesincluded = [];
            let dontinclude = [];
            const docRef = doc(db, 'User', user?.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                classesincluded = docSnap.data().allclass;
                dontinclude = docSnap.data().deniedfeed;
            } else {
                console.log("No such document!");
            }

            const q = query(collection(db, "TaskColab"));
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
            })
            return () => unsubscribe();
        }
        filterdata();
    })
    // console.log("colabtask");
    // console.log(colabtask);


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
                        <h1> No matching tasks found </h1>
                    </div>
                )
                
            }
                
            </div>
        </div>
    );
}