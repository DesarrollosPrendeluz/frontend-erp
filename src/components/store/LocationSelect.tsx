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
    <Flex>
        <Tag>{label}</Tag>
        <select
            value={selectValue}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>setSelectValue(event.target.value)}
        >
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
