"use client";

import React, { useState } from 'react';
import BaseModal from '../base_modal';
interface ModalProps {
  buttonName: string; // Controla si el modal está abierto o cerrado
  actionName: string; // Contenido del modal
  onFileUpload: (file: File) => void;//callback para el proceso del archivo
}
/**
 * 
 * @param buttonName -string--- nombre del boton que despliega el modal 
 * @param actionName -string--- nombre en la cabecera del modal
 * @param onFileUpload -callback--- procesado del articulo solo se ejecuta si hay archivo
 * @returns 
 */
const FileUploadModel: React.FC<ModalProps> = ({ buttonName, actionName, onFileUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Establece el archivo seleccionado en el estado
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onFileUpload(file); // Llama al callback del padre con el archivo cargado
    }
  };

  return (
    <>
      <button
        className="my-2 py-1 mx-2 focus:outline-none text-black bg-yellow-400 hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-2   me-2 mb-2 dark:bg-yellow-400 dark:hover:bg-yellow-400 dark:focus:ring-yellow-900modal-close"
        onClick={openModal}>
        {buttonName}</button>

      <BaseModal isOpen={isModalOpen} onClose={closeModal} actionName={actionName}>
        <div className="flex items-center justify-center w-full">
          <label className="p-[50px] m-2.5 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-500 dark:bg-gray-500 hover:bg-gray-100 dark:border-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-400">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Pulse para subir archivo</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Excel, csv o similiares </p>
            </div>
            <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        <div className='flex justify-end'>
          <button type="button"
            onClick={handleUploadClick}
            className="my-2 py-1 mx-2 focus:outline-none text-black bg-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-2   me-2 mb-2 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-900modal-close" >
            Subir archivo
          </button>
        </div>
      </BaseModal>
    </>


  );
};

export default FileUploadModel;
