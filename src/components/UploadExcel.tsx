import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Box, Spinner, Flex } from '@chakra-ui/react';
import { request } from 'http';
import Cookies from 'js-cookie'
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
        console.log("ha imprimir")
        console.log(response.data)
        const fileName = response.data.Results.FileName; // Nombre del archivo
        const fileContent = response.data.Results.File; // Contenido del archivo (en base64 o texto)

        // Convertir el contenido si es base64
        const binaryContent = atob(fileContent); // Decodificar base64 a binario
        const byteNumbers = new Uint8Array(binaryContent.length);
        for (let i = 0; i < binaryContent.length; i++) {
          byteNumbers[i] = binaryContent.charCodeAt(i);
        }

        const blob = new Blob([byteNumbers], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        // Crear y simular clic en el enlace
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Asignar el nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revocar la URL para liberar memoria
        window.URL.revokeObjectURL(url);

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
    </Flex >
  );
};

export default FileUpload;

