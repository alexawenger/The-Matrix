import React from 'react';
import "../index.css"; 
import DistModal from './DistanceModal.jsx';
import { useState } from 'react';

function NavBar() {
  const [isDistModalOpen, setDistModalOpen] = useState(false);
  const openDistModal = () => setDistModalOpen(true);
  const closeDistModal = () => setDistModalOpen(false);
  return (
    <div className="navbar">
      <nav className="navigation">
        <a href="/calendar" className="link">Calendar</a>
        <a href="/stats" className="link">Stats</a>
        <a href="/levels" className="link">Level Sheet</a>
        <a href="/#" className="link">Log a Workout</a>
        <a href="/#" className="link" onClick={openDistModal}>Log a Distance Run</a>
        <a href="/sign-out" className="link">Sign Out</a>
      </nav>
      <DistModal isDistModalOpen={isDistModalOpen} closeDistModal={closeDistModal} />
    </div>
  )
}

export default NavBar;
