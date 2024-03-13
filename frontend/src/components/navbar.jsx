import React from 'react';
import "../index.css"; 
import DistModal from './DistanceModal.jsx';
import { useState } from 'react';

function NavBar() {
  const[openDistanceModal, setOpenDistanceModal] = useState(false);


  return (
    <div className="navbar">
      <nav className="navigation">
        <a href="/calendar" className="link">Calendar</a>
        <a href="/stats" className="link">Stats</a>
        <a href="/levels" className="link">Level Sheet</a>
        <button className="modal-button">Log a Workout</button>
        <button onClick={()=>setOpenDistanceModal(true)} className="modal-button">Log a Distance Run</button>
        <a href="/sign-out" className="link">Sign Out</a>
        <DistModal open={openDistanceModal} onClose={()=>setOpenDistanceModal(false)} />
      </nav>
    </div>
  )
}

export default NavBar;
