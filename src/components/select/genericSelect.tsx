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

    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Estado de error
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    const token =     Cookies.get("erp_token");
    const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error


    // // Realizar la petición para obtener los datos cuando el componente se monte
    // useEffect(() => {
    //   if (orderId !== undefined && statusId !== undefined) {
    //     const fetchData = async () => {
    //       setLoading(true);
    //       setError(null);
    //       try {
    //         const response = await axios.get(`${apiUrl}/order/status`, {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         });
  
    //         if (response.status === 200) {
    //           const datum: Option[] = response.data.Results.data.map((item: any) => ({
    //             id: item.ID,
    //             name: item.Name,
    //           }));
  
    //           setOptions(datum);
    //           setSelectedValue(statusId ?? 1);
    //         }
    //       } catch (err) {
    //         setError("Error al cargar los datos");
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
  
    //     fetchData();
    //   }
    // }, [orderId, statusId, token, apiUrl]);
    


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

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