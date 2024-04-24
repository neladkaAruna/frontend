import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'http://localhost:3000/students'; // Replace with your API URL

const App = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    reg_no: '',
    mark1: '',
    mark2: '',
    mark3: ''
  });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(apiUrl);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updatingId) {
        // Update student
        await axios.put(`${apiUrl}/${updatingId}`, formData);
        setUpdatingId(null); // Reset updatingId after update
      } else {
        // Add new student
        await axios.post(apiUrl, formData);
      }
      setFormData({
        name: '',
        reg_no: '',
        mark1: '',
        mark2: '',
        mark3: ''
      });
      fetchStudents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleUpdate = async (id) => {
    // Set formData with student's information
    const studentToUpdate = students.find(student => student.id === id);
    setFormData(studentToUpdate);
    setUpdatingId(id);
  };

  return (
    <div>
      <h1>Student Management System</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleInputChange} />
        <input type="text" name="reg_no" value={formData.reg_no} placeholder="Registration Number" onChange={handleInputChange} />
        <input type="text" name="mark1" value={formData.mark1} placeholder="Mark 1" onChange={handleInputChange} />
        <input type="text" name="mark2" value={formData.mark2} placeholder="Mark 2" onChange={handleInputChange} />
        <input type="text" name="mark3" value={formData.mark3} placeholder="Mark 3" onChange={handleInputChange} />
        <button type="submit">{updatingId ? 'Update Student' : 'Add Student'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Registration Number</th>
            <th>Mark 1</th>
            <th>Mark 2</th>
            <th>Mark 3</th>
            <th>Total Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.reg_no}</td>
              <td>{student.mark1}</td>
              <td>{student.mark2}</td>
              <td>{student.mark3}</td>
              <td>{parseInt(student.mark1) + parseInt(student.mark2) + parseInt(student.mark3)}</td>
              <td>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
                <button onClick={() => handleUpdate(student.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
