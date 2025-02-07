const downloadFile = (fileContent:string, fileName:string) =>{
    

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

export default downloadFile;