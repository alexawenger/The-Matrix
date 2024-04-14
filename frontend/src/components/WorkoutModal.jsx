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
    const handleSubmit = async (e) => {
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
        try {
            const response = await fetch('http://localhost:8081/api/submit-workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: json,
            });
            const data = await response.json();
            console.log(data);
            onClose(); // Close the modal only after successful submission
        } catch (error) {
            console.error('Error:', error);
        }
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
                    <div className='input-group'>
                        <label> Warmup Minutes:</label>
                        <input type="number" value={warmMin} onChange={(e) => setWarmMin(e.target.value)} />
                        <label> Warmup Miles:</label>
                        <input type="number" value={warmMi} onChange={(e) => setWarmMi(e.target.value)} step="0.01" />
                    </div>
                    <div className='input-group'>
                        <label> Cooldown Minutes:</label>
                        <input type="number" value={coolMin} onChange={(e) => setCoolMin(e.target.value)} />
                        <label> Cooldown Miles:</label>
                        <input type="number" value={coolMi} onChange={(e) => setCoolMi(e.target.value)} step="0.01" />
                    </div>
                    <div>
                        <button type="button" className='modal-close' onClick={onClose}>Cancel</button>
                        <button type="submit" className='modal-close' onClick={onClose}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkoutModal;
