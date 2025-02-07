import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Console } from 'console';

interface SearchBarProps {
  searchValue: string; // El valor del string desde el padre
  setSearchValue: (value: string) => void; // Función para actualizar el string en el padre
  searchParams: string[]; // Lista de parámetros que se deben buscar
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, setSearchValue, searchParams }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search()

    }
  };
  const search = () => {
    let query = ""
    searchParams.forEach(element => {
      query = query + "&" + element + "=" + inputValue

    });
    query.trim() == "" ? setSearchValue("") : setSearchValue(query)
    setInputValue("")

  }

  return (
    <InputGroup margin="auto" mt="2px">
      <Input
        placeholder={`Buscar por ${searchParams.join(", ")}`} // Muestra los parámetros en el placeholder
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleSearch} // Actualiza el string en el padre
        focusBorderColor="teal.400"
        borderColor="gray.300"
      />
      <InputRightElement>
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={search} // Ejecuta la función handleSearch
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
