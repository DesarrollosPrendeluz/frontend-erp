import React, { useState, useEffect } from 'react';
import genericGet from "@/hooks/genericGet";

interface Option {
  value: string;
  label: string;
}
interface Location {
    ID: string;
    Name: string;
    Code:string;
  }
  interface BasicModalProps {
    setSelected: (value: string) => void;

  }

const MultiSelect: React.FC<BasicModalProps> = ({setSelected}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<Location[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);


  const fetchOptions = async () => {
    let data = await genericGet("/store_location?page=-1&page_size=-1")
    setOptions(data.body.Results.data)
    console.log(data.body)
  };

  useEffect(() => {
    fetchOptions();
  }, []);
  //console.log(options)

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleOptionClick = (value: string) => {
    const result = selectedOptions.includes(value)? selectedOptions.filter(opt => opt !== value) : [...selectedOptions, value];
    setSelectedOptions(result);
    console.log(result);
    if (result.length > 0){  
        setSelected(result.join(','))
        

    }else{ setSelected("")}


  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        style={{
          width: '100%',
          padding: '10px',
          textAlign: 'left',
          cursor: 'pointer',
          border: '1px solid #ccc',
        }}
      >
        {selectedOptions.length > 0
          ? `Ubicaciones seleccionadas: ${selectedOptions.join(', ')}`
          : 'Todas las ubicaciones'}
      </button>

      {isDropdownVisible && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 1001,
          }}
        >
          {options.map(option => (
            <li
              key={option.ID}
              onClick={() => handleOptionClick(option.ID)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedOptions.includes(option.ID)
                  ? '#f0f0f0'
                  : '#fff',
              }}
            >
              {option.Code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;




