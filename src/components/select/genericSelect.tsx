import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'


// Definir el tipo de las opciones
interface Data {
    SelectValue: string;
    SelectName: string;
    data: any[];
    setData: (value: string) => void;
}



  
  const GenericSelect: React.FC<Data> = ({SelectValue, SelectName, data, setData}) => {


    const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error



    


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setData(value);
    setSelectedValue(parseInt(value, 10)); 
  };

  return (
    <div>
      
      <select
        id="framework-select"
        value={selectedValue}
        onChange={handleChange}
        defaultValue={0}
      >
        {data.map((datum) => (

          <option key={datum[SelectValue]} value={datum[SelectValue]}>
          {datum[SelectName]}
          </option>
            
        ))}


      </select>
    </div>
  );
};



export default GenericSelect;