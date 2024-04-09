import React, { useState } from 'react';
import '../index.css';

const WorkoutModal = ({ open, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [lift, setLift] = useState(false);
    const [core, setCore] = useState(false);
    const [type, setType] = useState('');
    const [warmMin, setWarmMin] = useState('');
    const [warmMi, setWarmMi] = useState('');
    const [coolMin, setCoolMin] = useState('');
    const [coolMi, setCoolMi] = useState('');

    // Handle form submission by sending post request
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('date', date);
        formData.append('lift', lift);
        formData.append('core', core);
        formData.append('type', type);
        formData.append('warmMin', warmMin);
        formData.append('warmMi', warmMi);
        formData.append('coolMin', coolMin);
        formData.append('coolMi', coolMi);
        
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        fetch('http://localhost:8081/api/submit-workout', {
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
                    </div>
                        <label> Workout Type:</label>
                        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
                    <div>
                        <label> Warmup Minutes:</label>
                        <input type="number" value={warmMin} onChange={(e) => setMinutes(e.target.value)} />
                    </div>
                    <div>
                        <label> Warmup Miles:</label>
                        <input type="number" value={warmMi} onChange={(e) => setMiles(e.target.value)} step="0.01" />
                    </div>
                    <div>
                        <label> Cooldown Minutes:</label>
                        <input type="number" value={coolMin} onChange={(e) => setMinutes(e.target.value)} />
                    </div>
                    <div>
                        <label> Cooldown Miles:</label>
                        <input type="number" value={coolMi} onChange={(e) => setMiles(e.target.value)} step="0.01" />
                    </div>
                    <div>
                        <button type="button" className='modal-close' onClick={onClose}>Cancel</button>
                        <button type="submit" onClick={onClose}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkoutModal;
