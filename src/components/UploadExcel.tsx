import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Box, Spinner } from '@chakra-ui/react';
import { request } from 'http';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

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

    try {
      setIsUploading(true);
      setUploadError(null); // Resetea el error antes de la subida

      // Realiza la solicitud POST a la API
      const token = document.cookie.split("=")[1]
      const response = await axios.post('http://localhost:8080/order/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setIsUploading(false);
      setUploadSuccess(true);
      console.log('Respuesta de la API:', response.data);
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
    <Box maxW="500px" mx="auto" mt={8}>
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        mb={4}
      />

      <Button onClick={handleUpload} isDisabled={!file} colorScheme="blue">
        {isUploading ? <Spinner size="sm" /> : 'Subir Archivo'}
      </Button>

      {uploadError && <p style={{ color: 'red', marginTop: '10px' }}>{uploadError}</p>}
      {uploadSuccess && <p style={{ color: 'green', marginTop: '10px' }}>Archivo subido con éxito.</p>}
    </Box>
  );
};

export default FileUpload;

