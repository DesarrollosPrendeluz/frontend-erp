import React from "react";
import ItemLocationStockStoreItem from "@/types/stores/itemLocationStocks/ItemLocationStocks";
import { Flex, Tag } from '@chakra-ui/react';


interface SelectProps {
  data: ItemLocationStockStoreItem[];
  selectValue: string | number;
  label : string;
  setSelectValue: (value: string) => void;
}

const CustomSelect: React.FC<SelectProps> = ({ data, selectValue, setSelectValue, label }) => {
  return (
    <Flex marginY={"10px"}>
        <Tag>{label}</Tag>
        <select
            defaultValue={"0"}
            value={selectValue}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>setSelectValue(event.target.value)}
        >
        <option key={Math.random()} value="0">
          Valor no seleccionado
        </option>
      {data.map((option) => (
        <option 
            key={option.StoreLocationID} 
            value={option.StoreLocationID}
        >
          {option.StoreLocations.Code}
        </option>

      ))}
    </select>


    </Flex>
  );
};

export default CustomSelect;
