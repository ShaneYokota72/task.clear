import '../App.css';
import React, { useState } from "react"

import { addDoc, doc, collection, getDoc, updateDoc} from "firebase/firestore";
import {db} from '../firebase';

import taskcomp_a from '../Images/Group 100.png';
import taskcomp_b from '../Images/Group 103.png';
import taskdel_a from '../Images/TaskDel_a.png';
import taskdel_b from '../Images/TaskDel_b.png';

import { UserAuth } from '../Context/AuthContext';

export default function FeedEntry(props){
    const [checkMarkSrc, setCheckMarkSrc] = useState(taskcomp_a)
    const [redXSrc, setRedXSrc] = useState(taskdel_a)
    const {user} = UserAuth();

    function handleHover() {
        setCheckMarkSrc(taskcomp_b)
    }
    function undoHover() {
        setCheckMarkSrc(taskcomp_a)
    }
    function handleHoverX() {
        setRedXSrc(taskdel_b)
    }
    function undoHoverX() {
        setRedXSrc(taskdel_a)
    }

    async function feedclicked(props){
        const docid = user.uid;
        const docRef = doc(db, 'User', docid);
        
        let originaldenied = [];
        getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.exists()) {
                    originaldenied = snapshot.data().deniedfeed;
                    originaldenied.push(props.id);
                    updateDoc(docRef, {
                        deniedfeed: originaldenied
                    });
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }

    async function addtorequested(props){
        const userDocRef = doc(db, 'User', props.username);
        const RequestRef = collection(userDocRef, 'Requests');
        await addDoc(RequestRef, {
            id: props.id,
            aname: props.aname,
            cname: props.cname,
            ddate: props.ddate,
            requester: user.displayName,
            loc: props.loc,
            t: props.t,
            requesteruid: user.uid,
            nppl: props.nppl
        })
    }

    async function feedaccepted(props){
        feedclicked(props);
        // add to db
        addtorequested(props);
    }

    async function feeddenied(props){
        feedclicked(props);
    }

    return(
        <div className="IndRequestDiv">
            <div className="IndRequestItemContent">
                <div className="IndRequestName">{props.displayname}</div>
                <div className="IndRequestSubInfo">
                    <div className="IndRequestLocation">{props.loc},</div>
                    <div className="IndRequestDate">{props.t}</div>
                </div>
                <div id="request-label-dark" className="request-label">
                    <div className="IndLabelText">{props.cname}</div>
                </div>
                <div id="request-label-light" className="request-label">
                    <div className="IndLabelText">{props.aname}</div>
                </div>
                <div className="button-contain">
                    <div className="request-button">
                        <a onClick={() => feedaccepted(props)} href="#"><img src={checkMarkSrc} onMouseOver={handleHover} onMouseLeave={undoHover}/></a>
                    </div>
                    <div className="request-button">
                        <a onClick={() => feeddenied(props)} href="#"><img src={redXSrc} onMouseOver={handleHoverX} onMouseLeave={undoHoverX}/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}