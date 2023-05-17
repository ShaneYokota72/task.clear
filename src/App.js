import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet, Navigate} from "react-router-dom";
import Todo from './Components/Todo';
import Feed from './Components/Feed';
import AllRequests from './Components/AllRequests';
import Analytics from './Components/Analytics';
import Addtask from './Components/Addtask';
import './Components/CloudFirestone';
import { AuthContextProvider } from './Context/AuthContext';
import Signin from './Components/Signin';

function Home(){
  return(
    <div className='Home'>
      <Todo></Todo>
      <div>
        <Feed></Feed>
        <AllRequests></AllRequests>
      </div>
    </div>
    
  );
}

function App() {
  return (
    <div>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/signin' element={<Signin></Signin>}></Route>
            <Route path='/' element={<Home></Home>}>
              <Route path='/analytics' element={<Analytics></Analytics>}></Route>
              <Route path='/addtask' element={<Addtask></Addtask>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
      
  );
}

export default App;

