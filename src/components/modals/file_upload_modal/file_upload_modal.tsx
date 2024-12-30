"use client";

import React, { useState } from "react";
import FileUpload from "@/components/UploadExcel";
import  Field from "@/types/forms/fields";


import BaseModal from "../base_modal";
interface ModalProps {
  buttonName: string; // Controla si el modal está abierto o cerrado
  actionName: string; // Contenido del modal
  field: Field[]

  
}
/**
 *
 * @param buttonName -string--- nombre del boton que despliega el modal
 * @param actionName -string--- nombre en la cabecera del modal
 * @param onFileUpload -callback--- procesado del articulo solo se ejecuta si hay archivo
 * @returns
 */
const FileUploadModel: React.FC<ModalProps> = ({
  buttonName,
  actionName,
  field
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Establece el archivo seleccionado en el estado
    }
  };



  return (
    <>
      <button
        className="my-2 py-1 mx-2 focus:outline-none text-black bg-yellow-400 hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-2   me-2 mb-2 dark:bg-yellow-400 dark:hover:bg-yellow-400 dark:focus:ring-yellow-900modal-close"
        onClick={openModal}
      >
        {buttonName}
      </button>

      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        actionName={actionName}
      >
        <FileUpload endpoint="/order/editOrders" fields={field}/>

      </BaseModal>
    </>
  );
};

export default FileUploadModel;
