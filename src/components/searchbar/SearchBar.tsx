import React from 'react';
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchBarProps {
  searchValue: string; // El valor del string desde el padre
  setSearchValue: (value: string) => void; // Función para actualizar el string en el padre
  searchParams: string[]; // Lista de parámetros que se deben buscar
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, setSearchValue, searchParams }) => {
  const handleSearch = (value:string) => {
    console.log("Buscando:", searchValue);
    console.log("Parámetros de búsqueda:", searchParams);
    let query = ""
    searchParams.forEach(element => {
        query = query +"&"+element+"="+value
        
    });

    setSearchValue(query)
    // Aquí puedes añadir lógica adicional si es necesario
  };

  return (
    <InputGroup   margin="auto" mt="2px">
      <Input
        placeholder={`Buscar por ${searchParams.join(", ")}`} // Muestra los parámetros en el placeholder
        //value={searchValue}
        onChange={(e) => handleSearch(e.target.value)} // Actualiza el string en el padre
        focusBorderColor="teal.400"
        borderColor="gray.300"
      />
      <InputRightElement>
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          //onClick={(e) => setSearchValue(e.target.value)} // Ejecuta la función handleSearch
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
