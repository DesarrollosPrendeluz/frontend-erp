import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'


// Definir el tipo de las opciones
interface SelectOption {
    orderId: number|undefined;
    status: string|undefined;
    statusId: number|undefined;
    father: boolean;
}

interface Option{
    id : number;
    name: string;
}
interface Options{
    data : Option[];
}


  
  const Select: React.FC<SelectOption> = ({orderId, status, statusId, father}) => {

    const [options, setOptions] = useState<Option[]>([]); // Estado para almacenar las opciones  const [selectedValue, setSelectedValue] = useState<string>(""); // Estado para la selección
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Estado de error
    const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    const token =     Cookies.get("erp_token");

    // Realizar la petición para obtener los datos cuando el componente se monte
    useEffect(() => {
      if (orderId !== undefined && statusId !== undefined) {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await axios.get(`${apiUrl}/order/status`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (response.status === 200) {
              const datum: Option[] = response.data.Results.data.map((item: any) => ({
                id: item.ID,
                name: item.Name,
              }));
  
              setOptions(datum);
              setSelectedValue(statusId ?? 1);
            }
          } catch (err) {
            setError("Error al cargar los datos");
          } finally {
            setLoading(false);
          }
        };
  
        fetchData();
      }
    }, [orderId, statusId, token, apiUrl]);
    


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let endpoint = father ? "/fatherOrder" :"/order";

      
        const response =  axios.patch(`${apiUrl}${endpoint}`, 
            {
            data: [
              {
                id: orderId,
                status: parseInt(value, 10)
              }
            ],
          }, 
          {
            headers: {
                'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`  // Envía el token en los headers
            }
          }
        ).then(function (response) {
          })
          .catch(function (error) {
            console.error(error);
          })
          .finally(function () {
            // always executed
          });  
      

    setSelectedValue(parseInt(value, 10)); 
  };

  return (
    <div>
      
      <select
        id="framework-select"
        value={selectedValue}
        onChange={handleChange}
        defaultValue={statusId}
      >
        {options.map((option) => (

          <option key={option.id} value={option.id}>
          {option.name}
          </option>
            
        ))}


      </select>
    </div>
  );
};



export default Select;