import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.STRAPI_URL}/auth/local/register`, {
      username,
      password,
    });
    alert('Usuário criado com sucesso!');
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Registrar</button>
    </form>
  );
}
