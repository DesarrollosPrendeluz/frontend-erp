"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/modals/base_modal";
import genericGet from "@/hooks/genericGet";
import GenericSelect from "@/components/select/genericSelect";
import axios from 'axios';
import Cookies from 'js-cookie';

import {
    Button,
    Input
  } from "@chakra-ui/react";
import { create } from "domain";


const GenerateLocation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    const [store, setStore] = useState<any[]>([]);
    const [storeId, setStoreId] = useState<string>("1");
    const [input, setInput] = useState<string>("");
    const [input2, setInput2] = useState<string>("");
    const [textConf, settextConf] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value); // Actualiza el estado con el valor del input
      };
      const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput2(event.target.value); // Actualiza el estado con el valor del input
      };

  const obtainStores = async () => {
    let result = await genericGet("/store")
    if(result.status == 202 || result.status == 201 || result.status == 200){
        console.log(result.body.Results.data)
        setStore(result.body.Results.data);
    }
  }
  useEffect(() => {
    obtainStores()
}, []);
const create = async () => {
    if (isProcessing) return; // Evitar múltiples clics
if(input != "" && input2 != "" && storeId != "" && storeId != "0" ){
  setIsProcessing(true); // Bloquear el botón
  const token = Cookies.get("erp_token");
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  let bodyData = {data:[
      {
          name: input,
          code: input2,
          storeid: parseInt(storeId) 
      },
  ]}

  axios.post(
      `${apiUrl}/store_location`,
      bodyData,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((response) => {
      if (response.status == 201 || response.status == 200  || response.status == 202){ 
        settextConf("Ubicación creada con éxito")
      }else{
          settextConf("Error al crear la ubicación")
      }
     
    }).catch((error) => {
      settextConf("Error al crear la ubicación")
      
    }).finally(() => {
      closeModal()
      setIsProcessing(false);
    });

}else{
  settextConf("Faltan datos por completar")
  setIsProcessing(false);

}



}


  return (
    <>
      <Button backgroundColor={"#FACC15"} onClick={openModal}>
        Crear ubicaciones
      </Button>

      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        actionName={"Crear ubicaciones"}
      >
        <div className="flex justify-start w-full">
            <p className="ml-4 text-start">{textConf}</p>
        </div>
        <div className="flex justify-around w-full">
            <GenericSelect SelectName="Name" SelectValue="ID" data={store} setData={setStoreId}  />
            <Input width={"30%"} placeholder="Nombre de la ubicación" mb={3} value={input} onChange={handleInputChange} />
            <Input width={"30%"} placeholder="Código de la ubicación" mb={3} value={input2} onChange={handleInputChange2} />
        </div>
        
        <div className="flex items-center justify-center w-full">

         
        <Button disabled={isProcessing} marginBottom={"10px"} backgroundColor={"#FACC15"} onClick={create} >
            Crear ubicación
          </Button>
        </div>
      </BaseModal>
    </>
  );
};

export default GenerateLocation;
