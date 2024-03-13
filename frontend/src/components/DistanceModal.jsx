import React, { useState } from 'react';
import '../index.css'; // Ensure you have Modal.css for styling

const DistanceModal = ({ open, onClose }) => {
    // State for form fields
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [lift, setLift] = useState(false);
    const [core, setCore] = useState(false);
    const [minutes, setMinutes] = useState('');
    const [miles, setMiles] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page
        const formData = { date, lift, core, minutes, miles };

        // Make the POST request
        fetch('http://localhost:8081/submitDistEntry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                // If the server responded with an error status, throw an error
                throw new Error('Server responded with an error: ' + response.status);
            }
            return response.json(); // Only parse as JSON if response is ok
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        console.log('Form data ready to be sent to the database:', formData);
        onClose(); // Close the modal upon submission
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
