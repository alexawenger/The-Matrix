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
    const [reps, setReps] = useState([{ time: '', distance: '', rest: '' }]);

    // Function to handle changes in rep inputs
    const handleRepChange = (index, field, value) => {
        const newReps = reps.map((rep, repIndex) => {
            if (index === repIndex) {
                return { ...rep, [field]: value };
            }
            return rep;
        });
        setReps(newReps);
    };

    // Function to add another rep entry
    const addRep = () => {
        setReps([...reps, { time: '', distance: '', rest: '' }]);
    };

    // Function to remove a rep entry
    const removeRep = (index) => {
        const newReps = reps.filter((_, repIndex) => index !== repIndex);
        setReps(newReps);
    };

    // Handle form submission by sending post request
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            date, lift, core, type, warmMin, warmMi, coolMin, coolMi, reps
        };
        
        try {
            const response = await fetch('http://localhost:8081/submit-workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                        {reps.map((rep, index) => (
                        <div key={index} className="rep-group"> Rep {index + 1}: 
                            <input
                                type="number"
                                value={rep.time}
                                onChange={(e) => handleRepChange(index, 'time', e.target.value)}
                                placeholder="Time (seconds)"
                            />
                            <input
                                type="number"
                                value={rep.distance}
                                onChange={(e) => handleRepChange(index, 'distance', e.target.value)}
                                placeholder="Distance (meters)"
                            />
                            <input
                                type="number"
                                value={rep.rest}
                                onChange={(e) => handleRepChange(index, 'rest', e.target.value)}
                                placeholder="Rest (seconds)"
                            />
                            {index > 0 && (
                                <button type="button" className='modal-close' onClick={() => removeRep(index)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <div>
                        <button type="button" className='modal-close' onClick={addRep}>Add Rep</button>
                        <button type="button" className='modal-close' onClick={onClose}>Cancel</button>
                        <button type="submit" className='modal-close'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkoutModal;
