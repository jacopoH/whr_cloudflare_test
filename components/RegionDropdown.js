import React, { useState } from 'react';

const RegionDropdown = () => {
  const [selectedOption, setSelectedOption] = useState('Select a Region');
  const [isOpen, setIsOpen] = useState(false);



  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    console.log(option)
  };

  return (
    <div className="dropdown_container">
      <p className="title">Filter by region</p>
      <div className="dropdown">
        <div className="selectedOption" onClick={toggleDropdown}>
          <span className="selectedText">{selectedOption}</span>
          <span className="arrow">{isOpen ? '▲' : '▼'}</span>
        </div>
        {isOpen && (
          <div className="options">
            {options.map((option, index) => (
              <div
                key={index}
                className="option"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// const styles = {
//   container: {
//     padding: '1rem',
//     width: '300px',
//     fontFamily: 'proxima-nova',
//   },
//   title: {
//     marginBottom: '0.5rem',
//     fontSize: '1rem',
//     color: '#555',
//   },
//   dropdown: {
//     position: 'relative',
//     borderBottom: '1px solid #ccc',
//     cursor: 'pointer',
//   },
//   selectedOption: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0.5rem 0',
//     fontSize: '1rem',
//     fontWeight: 'bold',
//   },
//   selectedText: {
//     color: '#000',
//   },
//   arrow: {
//     color: '#777',
//     fontSize: '0.9rem',
//   },
//   options: {
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     zIndex: 10,
//   },
//   option: {
//     padding: '0.5rem',
//     fontSize: '1rem',
//     color: '#000',
//     cursor: 'pointer',
//   },
// };

export default RegionDropdown;
