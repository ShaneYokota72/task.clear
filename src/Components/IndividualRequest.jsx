import '../App.css';
import React from "react"
import { useState } from "react"
import emailjs from '@emailjs/browser';

import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {db} from '../firebase';

import { UserAuth } from '../Context/AuthContext';

import taskcomp_a from '../Images/Group 100.png';
import taskcomp_b from '../Images/Group 103.png';
import taskdel_a from '../Images/TaskDel_a.png';
import taskdel_b from '../Images/TaskDel_b.png';

export default function RequestItem(props){
    // console.log("props for request", props);
    const {user} = UserAuth();
    const [checkMarkSrc, setCheckMarkSrc] = useState(taskcomp_a)
    const [redXSrc, setRedXSrc] = useState(taskdel_a)

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

    async function requestdel(props){
        await deleteDoc(doc(db, 'User', user.uid, 'Requests', props.id));
    }

    const sendEmail = (templateobj) => {    
        emailjs.send(process.env.REACT_APP_emailjs_service, REACT_APP_emailjs_template, templateobj, REACT_APP_emailjs_publickey);
    };

    async function acceptrequest(props){
        // delete the data from the DB
        requestdel(props);
        let requester_email = "";
        let requester_name = "";
        const docRef = doc(db, 'User', props.requesteruid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            requester_email = docSnap.data().useremail;
            requester_name = docSnap.data().name;
        }
        
        const temp_accept_email = user.email;
        const temp_accept_name = user.displayName;
        const temp_cname = props.cname;
        const temp_aname = props.aname
        const temp_loc = props.loc
        const temp_t = props.t

        var templateParams = {
            request_email: requester_email,
            request_name: requester_name,
            accept_email: temp_accept_email,
            accept_name:temp_accept_name,
            cname: temp_cname,
            aname: temp_aname,
            loc: temp_loc,
            t: temp_t
        };
        
        // notify the acception via email
        sendEmail(templateParams);

        // console.log(`Email to ${requester_email}. Accepted request for ${props.cname} on task ${props.aname} at ${props.loc} on ${props.t}`);
    }

    return(
        <div className="IndRequestDiv"/* className="Requestcard" */>
            <div className="IndRequestItemContent"/* className="Requestitem" */>
                <div className="IndRequestName">{props.requester}</div>
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
                        <a onClick={() => acceptrequest(props)} href="#"><img src={checkMarkSrc} onMouseOver={handleHover} onMouseLeave={undoHover}/></a>
                    </div>
                    <div className="request-button">
                        <a onClick={() => requestdel(props)} href="#"><img src={redXSrc} onMouseOver={handleHoverX} onMouseLeave={undoHoverX}/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}