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



export const BASE_ROUTE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <div className="-z-10 absolute w-full h-full bg-cover border-solid border-0 border-red-600 bg-fixed bg-[url('/public/MIU_1.jpg')]" />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/sign-in" element={<SignIn/>} />
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