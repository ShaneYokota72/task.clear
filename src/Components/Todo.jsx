import React from 'react';
import { useState, useEffect} from 'react';
import '../App.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Task from './Task';
import { UserAuth } from '../Context/AuthContext';
import logo from '../Images/Component 1.png';
import addtask_a from '../Images/add-task-a.png';
import addtask_b from '../Images/add-task-b.png';

import { query, collection, onSnapshot} from "firebase/firestore";
import {db} from '../firebase';

export default function Todo(){
    const {user, logOut} = UserAuth();
    const [addbutton, setaddbutton] = useState(addtask_a);
    const [userdata, setuserdata] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(user == null){
            return;
        }
        const assignments = query(collection(db, 'User', user.uid, 'Assignments'));
        const allassignments = onSnapshot(assignments, querySnapshot => {
            let todoarray = []
            querySnapshot.forEach((doc)=> {
                todoarray.push({...doc.data(), id:doc.id})
            });
            setuserdata(todoarray);
        })
        return () => allassignments();
    }, []);
    
    const handleMouseOver = () => {
        setaddbutton(addtask_b);
    };
    
    const handleMouseLeave = () => {
        setaddbutton(addtask_a);
    };

    const handleSignOut = async () => {
        try{
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user == null){
            navigate('/signin');
        }
    }, [user]);

    return(
        <div className='TodoDiv'>
            <div className='TodoContent'>
                <div className="heading">
                    <div className='headingleft'>
                        <img id="logo-image" src={logo} className='logoLT'/>
                        <h1 className='greetingheader'>Welcome back, <b>{user?.displayName.split(' ')[0]}</b></h1>   
                    </div>
                    <button className='logoutbutton' onClick={handleSignOut}>logout</button>
                </div>

                <div className='Todosub'>
                    <div>
                        <h1 className='nomargintext' style={{color: "#213547"}}>To-do</h1>
                        <h4 className='nomargintext'>here are your tasks for today</h4>
                    </div>
                    <div className='todorighttop'>
                        <button className='analytics'><Link style={{color:'black'}} to="/analytics">analytics</Link></button>
                        <Link className='backtohomebutton' to="/addtask">
                            <div className="request-button">
                                <img id="taskImage" src={addbutton} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
                            </div>
                            
                        </Link>
                    </div>
                </div>
                
                <hr className='linebreak'></hr>
                {userdata && userdata.length > 0 ? 
                    (
                        <div className='tasklist'>
                            {userdata.map((item, index) => (<Task key={index} userdata={userdata} {...item} />))}
                        </div>
                    ) : (
                        <div className='empty-message'>
                            <img id="logo-image" src={logo}/>
                            <h3 style={{color: "#213547"}} >No tasks available</h3>
                        </div>
                    )
                }
                <Outlet></Outlet>
            </div>
        </div>
    );
}