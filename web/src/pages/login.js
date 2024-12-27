import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';  // Import useRouter from Next.js

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Initialize the useRouter hook

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail(identifier)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';  // Fallback URL

    try {
      const { data } = await axios.post(`${apiUrl}/auth/local`, {
        identifier,
        password,
      });
      localStorage.setItem('jwt', data.jwt);
      toast.success('Login realizado com sucesso!');  // Success toast

      // Redirect to the index page after showing the success message
      setTimeout(() => {
        router.push('/');  // Redirect to the index page
      }, 1000);  // Delay the redirect to allow the toast to show

    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login falhou. Tente novamente.');  // Error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Login</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Email ou Usuário"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
