import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Homepage } from "./components/Homepage";
import { SoloLadder } from "./components/SoloLadder";
import { GemHuntRecords } from "./components/GemHuntRecords";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { PageNotFound } from "./components/PageNotFound";
import {useState } from 'react';



export const BASE_ROUTE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string>('')
  return (
    <BrowserRouter>
    <Navbar/>
    <div className="absolute -z-10 w-screen h-screen bg-cover bg-[url('/public/MIU_1.jpg')]" />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/ladder" element={<SoloLadder/>} />
        <Route path="/gem-hunt-records" element={<GemHuntRecords/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/404" element={<PageNotFound/>} />
        <Route path="*" element={<Navigate to="/404"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;