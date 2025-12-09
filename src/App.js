import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Data State
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('gymWorkouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  // 2. Form State
  const [formData, setFormData] = useState({
    date: '',
    exercise: '',
    sets: '',
    reps: ''
  });

  // 3. Edit Mode State (New!)
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // 4. Persist to Local Storage
  useEffect(() => {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Handle Submit (Updated for Edit logic)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // UPDATE LOGIC: Find the item by ID and replace it
      const updatedWorkouts = workouts.map((workout) => 
        workout.id === currentId ? { ...formData, id: currentId } : workout
      );
      setWorkouts(updatedWorkouts);
      
      // Reset Edit Mode
      setIsEditing(false);
      setCurrentId(null);
    } else {
      // ADD LOGIC: Create new
      const newWorkout = {
        id: Date.now(),
        ...formData
      };
      setWorkouts([newWorkout, ...workouts]);
    }

    // Clear form
    setFormData({ date: '', exercise: '', sets: '', reps: '' });
  };

  // 6. Handle Edit Click (New!)
  const handleEdit = (workout) => {
    setIsEditing(true);
    setCurrentId(workout.id);
    // Populate the form fields with the data we want to edit
    setFormData({
      date: workout.date,
      exercise: workout.exercise,
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

        <div className="input-group">
          <label>Sets</label>
          <input type="number" name="sets" placeholder="0" value={formData.sets} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Reps</label>
          <input type="number" name="reps" placeholder="0" value={formData.reps} onChange={handleChange} required />
        </div>

        {/* Button changes color/text based on mode */}
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
                  <td>{workout.sets}</td>
                  <td>{workout.reps}</td>
                  <td>
                    {/* New Edit Button */}
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