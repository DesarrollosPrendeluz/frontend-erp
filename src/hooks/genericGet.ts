import axios from 'axios';
import Cookies from 'js-cookie';


const genericGet = async (endpoint: string): Promise<{ body: any; status: number }> => {
    
  const token = Cookies.get("erp_token");
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    // Convertir el contenido si es base64
    try {
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return {
        body: response.data,
        status: response.status,
      };
    } catch (error: any) {
      console.error("Error during GET request:", error);
      throw error; // Lanza el error para que el consumidor de la función lo maneje
    }

}

export default genericGet;