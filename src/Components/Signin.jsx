import React, { useEffect } from  'react'
import {GoogleButton} from 'react-google-button'
import { UserAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, query, collection, onSnapshot} from 'firebase/firestore';
import { db } from '../firebase';

import signinimg from '../Images/SigninLeft.png';

import '../App.css'

export default function Signin(){
    const {googleSignIn, user} = UserAuth();
    const navigate = useNavigate();
    const handlegoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);   
        }
    }

    // console.log(import.meta.env.VITE_fb_apiKey);
    
    
    useEffect(() => {
        
        if(user != null){
            // console.log("user", user);
            // make a document in the user database
            let todoarray = []
            const q = query(collection(db, "TaskColab"));
            onSnapshot(q, querySnapshot => {
                querySnapshot.forEach((doc)=> {
                    todoarray.push({...doc.data(), id:doc.id})
                });
            })
            // console.log("taskcolab all", todoarray);

            const name = user.displayName;
            const docid = user.uid;
            const docRef = doc(db, 'User', docid);
            getDoc(docRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const existingData = snapshot.data();
                        // setDoc(docRef, {
                        //     ...existingData,
                        //     name: name,
                        // })
                        updateDoc(docRef, {
                            name: name,
                            useremail: user.email,
                        })
                        const originaldenied = existingData.deniedfeed;
                        let alltaskcolab = [];
                        for(let i = 0; i < todoarray.length; i++){
                            alltaskcolab.push(todoarray[i].id);
                        }
                        let filtereddenied = originaldenied.filter((item) => alltaskcolab.includes(item));
                        filtereddenied.push('placeholder');
                        // update the denied list for faster runtime every feed search
                        updateDoc(docRef, {
                            deniedfeed: filtereddenied
                        });
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
            navigate('/');
        }
    }, [user]);

    return(
        <div className='signinpage'>
            <div className='signincomp'>
                <div className='signin-left'>
                    <img src={signinimg} alt='logo' className='signinLimg'/>
                </div>
                <div className='signin-right'>
                    <h1>Sign in Page</h1>
                    <GoogleButton onClick={handlegoogleSignIn}/>
                </div>
            </div>
            
        </div>
    );
}