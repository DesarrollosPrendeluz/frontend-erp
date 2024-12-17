import React from "react";
import ItemLocationStockStoreItem from "@/types/stores/itemLocationStocks/ItemLocationStocks";
import { Flex, Tag } from '@chakra-ui/react';
import Locations from "@/types/stores/locations/Locations"

interface SelectProps {
  data: Locations[];
  selectValue: string | number;
  label : string;
  setSelectValue: (value: string) => void;
}

const CustomLocationsSelect: React.FC<SelectProps> = ({ data, selectValue, setSelectValue, label }) => {
  return (
    <Flex marginY={"10px"}>
        <Tag>{label}</Tag>
        <select

            value={selectValue}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>setSelectValue(event.target.value)}
        >
      {data.map((option) => (
        <option 
            key={option.ID} 
            value={option.ID}
        >
          {option.Code}
        </option>

      ))}
    </select>


    </Flex>
  );
};

export default CustomLocationsSelect;
