
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt with:', { fullName, email, password });
    // In a real app, this would call a registration service
    // For now, we log them in as a default 'CUSTOMER'
    login(email, 'CUSTOMER');
    navigate('/registration-success');
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="register-fullname" className="text-sm font-medium text-gray-700">Full Name</label>
          <Input 
            id="register-fullname" 
            type="text" 
            placeholder="John Doe" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="register-email" className="text-sm font-medium text-gray-700">Email</label>
          <Input 
            id="register-email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="register-password" className="text-sm font-medium text-gray-700">Password</label>
          <Input 
            id="register-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
      <p className="mt-4 px-8 text-center text-xs text-gray-500">
        By clicking continue, you agree to our{' '}
        <a href="#/terms" className="underline underline-offset-4 hover:text-emerald-700">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#/privacy" className="underline underline-offset-4 hover:text-emerald-700">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default RegisterForm;