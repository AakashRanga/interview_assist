import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { CopyIcon, LockIcon } from 'lucide-react';
const CREDENTIALS = [
{
  role: 'Candidate',
  email: 'candidate@inteviu.com',
  password: 'candidate123',
  redirect: '/candidate'
},
{
  role: 'Panel Member',
  email: 'panel@inteviu.com',
  password: 'panel123',
  redirect: '/panel'
},
{
  role: 'Admin',
  email: 'admin@inteviu.com',
  password: 'admin123',
  redirect: '/admin'
}];

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    const match = CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );
    if (match) {
      toast.success(`Welcome, ${match.role}!`);
      setTimeout(() => navigate(match.redirect), 400);
    } else {
      toast.error('Invalid credentials');
    }
  };
  const fillCreds = (cred: (typeof CREDENTIALS)[number]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    toast.info(`Filled ${cred.role} credentials`);
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
      <AnimatedBackground />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="w-full max-w-sm relative z-10">
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-glass-lg p-7">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-3">
              <LockIcon className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-secondary mb-1">
              Welcome Back
            </h1>
            <p className="text-xs text-secondary/60">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-secondary/70">
                <input type="checkbox" className="mr-1.5 rounded" />
                Remember me
              </label>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors">
                
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Sign In
            </Button>
          </form>

          {/* Static demo credentials */}
          <div className="mt-6 pt-5 border-t border-white/60">
            <div className="text-[10px] font-semibold text-secondary/60 uppercase tracking-wider mb-2.5">
              Demo Credentials
            </div>
            <div className="space-y-1.5">
              {CREDENTIALS.map((cred) =>
              <button
                key={cred.role}
                type="button"
                onClick={() => fillCreds(cred)}
                className="w-full flex items-center justify-between p-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-left group">
                
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-secondary">
                      {cred.role}
                    </div>
                    <div className="text-[10px] text-secondary/60 font-mono truncate">
                      {cred.email}
                    </div>
                  </div>
                  <CopyIcon className="w-3 h-3 text-secondary/40 group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>);

}