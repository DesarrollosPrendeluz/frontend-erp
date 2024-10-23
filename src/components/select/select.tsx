import React, { useState, useEffect } from "react";
import axios from "axios";


// Definir el tipo de las opciones
interface SelectOption {
    orderId: number|undefined;
    status: string|undefined;
    statusId: number|undefined;
}

interface Option{
    id : number;
    name: string;
}
interface Options{
    data : Option[];
}


  
  const Select: React.FC<SelectOption> = ({orderId, status, statusId}) => {

    const [options, setOptions] = useState<Option[]>([]); // Estado para almacenar las opciones  const [selectedValue, setSelectedValue] = useState<string>(""); // Estado para la selección
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Estado de error
    const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    const token = document.cookie.split("=")[1];



    // Realizar la petición para obtener los datos cuando el componente se monte
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await axios.get(`${apiUrl}/order/status`, {
              headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en los headers
              },
            });

            let res = response.data.Results.data

            if(response.status == 200){
                const datum: Option[] = res.map((item: any) => ({
                    id: item.ID,    // Cambia 'id' según el campo de la respuesta
                    name: item.Name // Cambia 'name' según el campo de la respuesta
                  }));
          
                  // Guardar las opciones en el estado
                setOptions(datum);
                //FIXME:asi funciona pero da error en el ide 
                setSelectedValue(statusId)
            }

          } catch (err) {
            setError("Error al cargar los datos");
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [token, apiUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log("id");
    console.log(orderId)

      
        const response =  axios.patch(`${apiUrl}/order`, 
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
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          });  
      

    setSelectedValue(parseInt(value, 10)); 
  };

  return (
    <div>
      <label htmlFor="framework-select">Status:</label>
      <select
        id="framework-select"
        value={selectedValue}
        onChange={handleChange}
      >
        {options.map((option) => (
            option.id === statusId ? (
                <option key={option.id} value={option.id} selected>
                {option.name}
                </option>
            ) : (
                <option key={option.id} value={option.id}>
                {option.name}
                </option>
            )
        ))}


      </select>
    </div>
  );
};



export default Select;