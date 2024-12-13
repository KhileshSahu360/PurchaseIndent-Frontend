import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

const DepartmentMasterTable = () => {
  const [departments, setDepartments] = useState(); // Initialize with an empty array
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    debugger
    const getDepartments = async() => {
      try {
        const response = await axiosInstance.get('/department/getDepartments')
        if(response.status === 200){
          setDepartments(response.data)
        }
      } catch (error) {
        alert('error while getting items')
        console.log(error)
      }
    }
    getDepartments();
  }, []);

  // Handle form input changes

  // Handle form submission
  const handleAddDepartment = () => {
    debugger
    if (!newDepartment) {
      alert('Please enter a department name');
      return;
    }

    axiosInstance
      .post('/department/newDepartment', { department : newDepartment }) // Replace with your actual API endpoint
      .then((response) => {
        setDepartments([...departments, response.data.newDepartment]); // Add the new department to the table
        setNewDepartment(''); // Reset form
      })
      .catch((err) => console.log(err.response?.data?.error || 'Error adding department'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className='font-bold mb-4'>Department Master</h2>

      {/* Data Table */}
      <table
        border="1"
        style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px' }}>Serial No.</th>
            <th style={{ padding: '8px' }}>Department Name</th>
          </tr>
        </thead>
        <tbody>
          {departments?.map((department, index) => (
            <tr key={department._id}>
              <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{department.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Department Form */}
      <h3 className='mt-4 font-bold'>Add New Department</h3>
      <div className='mt-4 mb-4'>
        <label>
          Department Name:
          <input
            type="text"
            name="department"
             onChange={(e)=>setNewDepartment(e.target.value)}
             value={newDepartment}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm px-[6px]'
          />
        </label>
      </div>
      <button
        onClick={handleAddDepartment}
        className='rounded-lg bg-green-800'
        style={{ padding: '8px 16px', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add Department
      </button>
    </div>
  );
};

export default DepartmentMasterTable;
