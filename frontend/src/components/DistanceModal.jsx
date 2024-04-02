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
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('date', date);
        formData.append('lift', lift);
        formData.append('core', core);
        formData.append('minutes', minutes);
        formData.append('miles', miles);
        
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        fetch('http://localhost:8081/api/submit-run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json,
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };

    if (!open) return null;

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Date:</label>
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
                    <div>
                        <label>Minutes:</label>
                        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                    </div>
                    <div>
                        <label>Miles:</label>
                        <input type="number" value={miles} onChange={(e) => setMiles(e.target.value)} step="0.01" />
                    </div>
                    <div>
                        <button type="button" className='modal-close' onClick={onClose}>Cancel</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DistanceModal;
