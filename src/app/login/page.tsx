"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>(""); // Estado para almacenar el mensaje de error
  const router = useRouter(); // Usar el hook useRouter

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene la recarga de la página

    // Realiza la solicitud POST al backend usando axios
    try {
      const response = await axios.post(apiUrl + "/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token: string = response.data.token;
        const id: string = response.data.id;
        document.cookie = `erp_token=${token}`;
        document.cookie = `user=${id}`;
        setErrorMessage("");
        router.push("/dashboard");

        // Aquí puedes manejar lo que sucede después de un login exitoso
        // Por ejemplo, guardar un token de autenticación, redirigir, etc.
      } else {
        console.error("Error al iniciar sesión");
        // Maneja el error de login, muestra un mensaje, etc.
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage("No se ha podido acceder revise sus crendeciales");

      // Maneja errores de red, muestra un mensaje, etc.
    }
  };
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between">
      <section className="bg-gray-50 dark:bg-gray-900 rounded-lg min-h-screen w-full ">
        <div className="flex flex-col items-center justify-center px-6 py-8 bg-gray-50 rounded-lg">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            Prendeluz ERP
          </a>
          <div className="w-full bg-gray-50 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                className={`text-lg font-bold leading-tight tracking-tight md:text-2xl 
              ${errorMessage ? "text-red-500" : "text-gray-900"} 
              dark:${errorMessage ? "text-red-400" : "text-white"}`}
              >
                {errorMessage ? errorMessage : "Accede con tus credenciales"}
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Correo
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white hover:text-black bg-black hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-yellow-400 dark:focus:ring-black"
                >
                  Acceder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
