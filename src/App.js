import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Data State
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('gymWorkouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  // 2. Form State (ADDED: weight)
  const [formData, setFormData] = useState({
    date: '',
    exercise: '',
    weight: '', // <--- NEW FIELD
    sets: '',
    reps: ''
  });

  // 3. Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // 4. Persist to Local Storage
  useEffect(() => {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // UPDATE LOGIC
      const updatedWorkouts = workouts.map((workout) => 
        workout.id === currentId ? { ...formData, id: currentId } : workout
      );
      setWorkouts(updatedWorkouts);
      
      setIsEditing(false);
      setCurrentId(null);
    } else {
      // ADD LOGIC
      const newWorkout = {
        id: Date.now(),
        ...formData
      };
      setWorkouts([newWorkout, ...workouts]);
    }

    // Clear form (ADDED: weight)
    setFormData({ date: '', exercise: '', weight: '', sets: '', reps: '' });
  };

  // 6. Handle Edit Click
  const handleEdit = (workout) => {
    setIsEditing(true);
    setCurrentId(workout.id);
    // Populate form (ADDED: weight)
    setFormData({
      date: workout.date,
      exercise: workout.exercise,
      weight: workout.weight, // <--- Load weight when editing
      sets: workout.sets,
      reps: workout.reps
    });
  };

  const handleDelete = (id) => {
    const filteredWorkouts = workouts.filter((workout) => workout.id !== id);
    setWorkouts(filteredWorkouts);
  };

  return (
    <div className="app-container">
      <h1>🏋️ Gym Progress Tracker</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="workout-form">
        <div className="input-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        
        <div className="input-group">
          <label>Exercise</label>
          <input type="text" name="exercise" placeholder="Bench Press" value={formData.exercise} onChange={handleChange} required />
        </div>

        {/* --- NEW WEIGHT INPUT --- */}
        <div className="input-group">
          <label>Weight (kg)</label>
          <input 
            type="number" 
            name="weight" 
            placeholder="0" 
            value={formData.weight} 
            onChange={handleChange} 
            required 
            inputMode="decimal" // Makes mobile number pad appear
          />
        </div>
        {/* ------------------------ */}

        <div className="input-group">
          <label>Sets</label>
          <input type="number" name="sets" placeholder="0" value={formData.sets} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Reps</label>
          <input type="number" name="reps" placeholder="0" value={formData.reps} onChange={handleChange} required />
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isEditing ? 'btn-update' : 'btn-add'}`}
        >
          {isEditing ? 'Update' : 'Add Log'}
        </button>
      </form>

      {/* Table */}
      <div className="table-container">
        {workouts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
                <th>Weight</th> {/* <--- NEW COLUMN */}
                <th>Sets</th>
                <th>Reps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.date}</td>
                  <td>{workout.exercise}</td>
                  <td>{workout.weight} kg</td> {/* <--- NEW DATA */}
                  <td>{workout.sets}</td>
                  <td>{workout.reps}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(workout)} 
                      className="action-btn edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(workout.id)} 
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No workouts logged yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;