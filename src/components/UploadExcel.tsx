import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Box, Spinner, Flex } from '@chakra-ui/react';
import { request } from 'http';
import Cookies from 'js-cookie'
import downloadFile from "@/hooks/downloadFile";
import genericGet from "@/hooks/genericGet";

import  Field from "@/types/forms/fields";

const FileUpload: React.FC <{ endpoint: string, fields : Field[], report: boolean }> = ({ endpoint, fields }) =>{
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  // Manejador de cambios cuando se selecciona un archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(false); // Resetea el estado
      setUploadError(null);    // Resetea el estado de error
    }
  };
  const handleDownload = async () => {
    let result = await genericGet(endpoint+"/frame")
    if(result.status == 202 || result.status == 201 || result.status == 200){
      downloadFile(result.body.Results.file, result.body.Results.fileName)

    }

    
  }
  // Manejador de la subida del archivo
  const handleUpload = async () => {
    if (!file) {
      setUploadError('Por favor, selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Añade el archivo a los datos del formulario
    fields.map((field) => {
      formData.append(field.key, field.value);
    });

    try {
      setIsUploading(true);
      setUploadError(null); // Resetea el error antes de la subida
      // Realiza la solicitud POST a la API
      const token =     Cookies.get("erp_token");
      const response = await axios.post(`${apiUrl}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      if(response.status == 202 || response.status == 201 || response.status == 200){
        downloadFile(response.data.Results.File, response.data.Results.FileName)

      }

      setIsUploading(false);
      setUploadSuccess(true);
    } catch (error) {
      setIsUploading(false);
      
      if(axios.isAxiosError(error) && error.response){
        if(error.response.request.status == 401){
          setUploadError('Error al subir el archivo. El usuario carece de los permisos necesarios.');
        }else{
          setUploadError('Error al subir el archivo. Inténtalo de nuevo.');
        }
        console.error('Error al subir el archivo:', error);

      }

    }
  };

  return (
    <Flex direction="column" maxW="500px" mx="auto" mt={8} marginBottom={"10px"}>
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        mb={6}
      />

      <Button onClick={handleUpload} isDisabled={!file} colorScheme="blue">
        {isUploading ? <Spinner size="sm" /> : 'Subir Archivo'}
      </Button>

      {uploadError && <p style={{ color: 'red', marginTop: '10px' }}>{uploadError}</p>}
      {uploadSuccess && <p style={{ color: 'green', marginTop: '10px' }}>Archivo subido con éxito.</p>}

      <Button marginTop={"5px"} backgroundColor={"#FACC15"} onClick={handleDownload}>
        {isUploading ? <Spinner size="sm" /> : 'Descargar Formato'}
      </Button>
    </Flex >
  );
};

export default FileUpload;

