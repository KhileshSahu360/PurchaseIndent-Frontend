import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

const ItemMasterTable = () => {
  const [items, setItems] = useState();
  const [newItem, setNewItem] = useState({ name: '', itemCode: '', uom: '' });

  // Fetch items from the backend
  useEffect(() => {
    const getItems = async() => {
      try {
        const response = await axiosInstance.get('/item/getItems')
        if(response.status === 200){
          setItems(response.data)
        }
      } catch (error) {
        alert('error while getting items')
        console.log(error)
      }
    }
    getItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle form submission
  const handleAddItem = () => {
    debugger
    if (!newItem.name || !newItem.itemCode || !newItem.uom) {
      alert('Please fill out all fields');
      return;
    }

    axiosInstance
      .post('/item/newItem', {item : newItem})
      .then((response) => {
        setItems([...items, response.data.newItem]); // Add the new item to the table
        setNewItem({ name: '', itemCode: '', uom: '' }); // Reset form
      })
      .catch((err) => alert(err.response?.data?.error || 'Error adding item'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className='font-bold mb-4'>Item Master</h2>

      {/* Data Table */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px' }}>Serial No.</th>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Item Code</th>
            <th style={{ padding: '8px' }}>UOM</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <tr key={item._id}>
              <td style={{ textAlign: 'center', padding: '8px' }}>{index + 1}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{item.itemCode}</td>
              <td style={{ textAlign: 'center', padding: '8px' }}>{item.uom}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Item Form */}
      <h3 className='mt-4 font-bold'>Add New Item</h3>
      <div className='mt-4 mb-4'>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm px-[6px]'
          />
        </label>
        <label>
          Item Code:
          <input
            type="text"
            name="itemCode"
            value={newItem.itemCode}
            onChange={handleInputChange}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm px-[6px]'
          />
        </label>
        <label>
          UOM:
          <input
            type="text"
            name="uom"
            value={newItem.uom}
            onChange={handleInputChange}
            style={{ marginLeft: '10px', marginRight: '20px', border: '1px solid black' }}
            className='rounded-sm px-[6px]'
          />
        </label>
      </div>
      <button onClick={handleAddItem} className='rounded-lg bg-green-800' style={{ padding: '8px 16px', color: 'white', border: 'none', cursor: 'pointer' }}>
        Add Item
      </button>
    </div>
  );
};

export default ItemMasterTable;
