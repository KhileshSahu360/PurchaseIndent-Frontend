import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

const MakeMasterTable = () => {
  const [makeTypes, setMakeTypes] = useState([]);
  const [newMakeType, setNewMakeType] = useState('');

  // Fetch Make Types from backend
  useEffect(() => {
    axiosInstance
      .get('/make/getMakes')
      .then((response) => setMakeTypes(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle adding new Make Type
  const handleAddMakeType = () => {
    if (!newMakeType) {
      alert('Please enter a valid Make Type');
      return;
    }

    axiosInstance
      .post('/make/newMake', { makeName: newMakeType })
      .then((response) => {
        setMakeTypes([...makeTypes, response.data.newMake]);
        setNewMakeType('');
      })
      .catch((err) => alert(err.response?.data?.error || 'Error adding Make Type'));
  };

  return (
      <div style={{ padding: '20px' }}>
      <h2 className='font-bold mb-4'>Make Type Master</h2>
      <table border="1" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
        <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px' }}>Serial No.</th>
            <th style={{ padding: '8px' }}>Make Name</th>
          </tr>
        </thead>
        <tbody>
          {makeTypes.map((type, index) => (
            <tr key={type._id}>
              <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{type.makeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className='mt-4 font-bold'>Add New Make</h3>
      <div className='mt-4 mb-4'>
        <label>
          Make:
          <input
            type="text"
            name="department"
            value={newMakeType}
            onChange={(e)=>setNewMakeType(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm'
          />
        </label>
      </div>
      <button
        onClick={handleAddMakeType}
        className='rounded-lg bg-green-800'
        style={{ padding: '8px 16px', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add Make
      </button>
    </div>
  );
};

export default MakeMasterTable;
