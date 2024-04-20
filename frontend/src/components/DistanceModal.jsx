// This file is used to add distance runs to the entries and distanceruns tables
// it allows user input using a form and stores the entered data in the database

import React, { useState } from 'react';
import '../index.css'; // Ensure you have Modal.css for styling

const DistanceModal = ({ open, onClose }) => {
    // State for form fields
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [lift, setLift] = useState(false);
    const [core, setCore] = useState(false);
    const [minutes, setMinutes] = useState('');
    const [miles, setMiles] = useState('');

    // Handle form submission by sending post request
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            date, lift, core, minutes, miles
        };

        try{
            const response = await fetch('http://localhost:8081/submit-run',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            onClose();
        }
        catch (error) {
          console.error(error);
        }
    };

    if (!open) return null;

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Date: </label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" checked={lift} onChange={(e) => setLift(e.target.checked)} />
                            Lift
                        </label>
                        <label>
                            <input type="checkbox" checked={core} onChange={(e) => setCore(e.target.checked)} />
                            Core
                        </label>
                    </div>
                    <div className='input-group'>
                        <label>Minutes: </label>
                        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label>Miles: </label>
                        <input type="number" value={miles} onChange={(e) => setMiles(e.target.value)} step="0.01" />
                    </div>
                    <div>
                        <button type="button" className='modal-close' onClick={onClose}>Cancel</button>
                        <button type="submit" className='modal-close'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DistanceModal;
