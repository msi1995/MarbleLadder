import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Homepage } from "./components/Homepage";
import { PlayerLadderData, SoloLadder } from "./components/SoloLadder";
import { GemHuntRecords } from "./components/GemHuntRecords";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { PageNotFound } from "./components/PageNotFound";
import {useEffect, useState, createContext } from 'react';
import { PlayerInfo } from "./components/PlayerInfo";
import { getLadderData } from "./utils/utils";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
export const BASE_ROUTE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
export const LadderData = createContext<PlayerLadderData[]>([]);

function App() {
  const [ladderData, setLadderData] = useState<PlayerLadderData[]>([]);
  useEffect(() => {
    getLadderData(setLadderData);
  }, []);

  return (
    <BrowserRouter>
    <Navbar/>
    <div className="fixed -z-10 w-screen h-screen bg-cover bg-fixed bg-[url('/public/MIU_1.jpg')] overflow-y-hidden" />
    <LadderData.Provider value={ladderData}>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/ladder" element={<SoloLadder/>} />
        <Route path="/gem-hunt-records" element={<GemHuntRecords/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/player/:name" element={<PlayerInfo/>}/>
        <Route path="/404" element={<PageNotFound/>} />
        <Route path="*" element={<Navigate to="/404"/>}/>
      </Routes>
      </LadderData.Provider>
    </BrowserRouter>
  );
}

export default App;