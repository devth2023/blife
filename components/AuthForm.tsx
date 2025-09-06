import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Logo } from './icons/Logo';

type AuthMode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <div className="flex flex-col items-center space-y-4">
          <Logo className="h-12 w-12 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Blife Healthy</h1>
          <p className="text-gray-500 text-sm">Your journey to a healthier life starts here.</p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          {mode === 'login' && <LoginForm />}
          {mode === 'register' && <RegisterForm />}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;