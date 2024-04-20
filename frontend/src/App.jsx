// This is the main component of the frontend. It is the parent component of all the other components.

import React, { useState, useEffect } from 'react'
import NavBar from './components/navbar.jsx'
import Header from './components/header.jsx'

function App() {
  return (
    <div>
      <Header />
      <NavBar />
    </div>
  )
}

export default App