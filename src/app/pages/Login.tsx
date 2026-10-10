import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Receipt, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login - em produção seria validado
    navigate('/dashboard');
  };

  const handleCreateAccount = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Imagem de Fundo com Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1758600588290-1da3710565f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB1c2luZyUyMHNtYXJ0cGhvbmUlMjBibHVlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzQwNTQwODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Overlay Gradiente Azul */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/95 via-[#2D9CDB]/90 to-[#1a6fa3]/95" />
      
      {/* Pattern decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2D9CDB] to-[#1a6fa3] rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Receipt className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#2D9CDB] to-[#1a6fa3] bg-clip-text text-transparent">
              Bem-vindo ao ContaFácil
            </h1>
            <p className="text-gray-600">Gerencie suas contas com facilidade</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-xl border-gray-200 focus:border-[#2D9CDB] text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-xl border-gray-200 focus:border-[#2D9CDB] text-base"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2D9CDB] to-[#1a6fa3] hover:from-[#2D9CDB]/90 hover:to-[#1a6fa3]/90 text-base shadow-lg shadow-[#2D9CDB]/30 group"
            >
              Entrar
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Link criar conta */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-2">Ainda não tem uma conta?</p>
            <button
              onClick={handleCreateAccount}
              className="text-base font-medium text-[#2D9CDB] hover:text-[#1a6fa3] hover:underline transition-colors"
            >
              Criar conta gratuitamente
            </button>
          </div>
        </div>

        {/* Mensagem adicional */}
        <p className="text-center mt-6 text-white/90 text-sm">
          🔒 Seus dados estão seguros conosco
        </p>
      </div>
    </div>
  );
}