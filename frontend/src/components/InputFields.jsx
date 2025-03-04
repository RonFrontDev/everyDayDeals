import React from 'react';

const InputFields = ({
  radius,
  setRadius,
  inputValue,
  setInputValue,
  addProduct,
}) => {
  return (
    <>
      <div className='input-group'>
        <label>Search Radius (km):</label>
        <input
          type='number'
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className='input-field'
        />
      </div>
      <div className='input-group'>
        <label>Add a Product:</label>
        <input
          type='text'
          placeholder='Type and press Enter...'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addProduct(e.target.value)}
          className='input-field'
        />
      </div>
    </>
  );
};

export default InputFields;
