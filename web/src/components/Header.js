import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is logged in and retrieve the username from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setUsername(JSON.parse(user).username);  // Assuming user info is saved as an object
    }
  }, []);

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold -ml-6">
          Hiago's Journey
        </div>
        <div className="space-x-6 hidden md:flex">
          <Link href="/" className="text-white hover:text-gray-300">Home</Link>
          <Link href="/sobre" className="text-white hover:text-gray-300">Sobre</Link>

          {/* Show username if logged in, otherwise show login/signup links */}
          {username ? (
            <span className="text-white">Hello, {username}</span>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-gray-300">Login</Link>
              <Link href="/signup" className="text-white hover:text-gray-300">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
