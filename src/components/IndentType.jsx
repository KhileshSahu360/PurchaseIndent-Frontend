import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

const IndentTypeMasterTable = () => {
  const [indentTypes, setIndentTypes] = useState([]);
  const [newIndentType, setNewIndentType] = useState('');

  // Fetch Indent Types from backend
  useEffect(() => {
    axiosInstance
      .get('/indentType/getIndentTypes')
      .then((response) => setIndentTypes(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle adding new Indent Type
  const handleAddIndentType = () => {
    if (!newIndentType) {
      alert('Please enter a valid Indent Type');
      return;
    }

    axiosInstance
      .post('/indentType/newIndentType', { type: newIndentType })
      .then((response) => {
        setIndentTypes([...indentTypes, response.data.newIndentType]);
        setNewIndentType('');
      })
      .catch((err) => alert(err.response?.data?.error || 'Error adding Indent Type'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className='font-bold mb-4'>Indent Type Master</h2>
      <table border="1" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
        <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px' }}>Serial No.</th>
            <th style={{ padding: '8px' }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {indentTypes.map((type, index) => (
            <tr key={type._id}>
              <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{type.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add New Department Form */}
      <h3 className='mt-4 font-bold'>Add New Indent Type</h3>
      <div className='mt-4 mb-4'>
        <label>
          Indent Type:
          <input
            type="text"
            name="department"
            value={newIndentType}
            onChange={(e)=>setNewIndentType(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm'
          />
        </label>
      </div>
      <button
        onClick={handleAddIndentType}
        className='rounded-lg bg-green-800'
        style={{ padding: '8px 16px', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add Indent Type
      </button>
    </div>
  );
};

export default IndentTypeMasterTable;
