
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GoogleIcon } from './icons/GoogleIcon';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';
import { UserRole } from '../types';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const { login } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password, role });
    login(email, role);
    navigate('/dashboard');
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</label>
          <Input 
            id="login-email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            aria-required="true"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</label>
            <a href="#/forgot-password" className="text-sm text-emerald-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <Input 
            id="login-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            aria-required="true"
          />
        </div>

        <div className="space-y-1">
            <label htmlFor="role-select" className="text-sm font-medium text-gray-700">Login as (Demo)</label>
            <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
            </select>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
};

export default LoginForm;