import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${process.env.STRAPI_URL}/auth/local`, {
      identifier,
      password,
    });
    localStorage.setItem('jwt', data.jwt);
    alert('Login realizado com sucesso!');
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Email ou Usuário"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
