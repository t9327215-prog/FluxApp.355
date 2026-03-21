
import React from 'react';
import { AuthLayout } from '../Componentes/ComponentesDeAuth/AuthLayout';
import { Input } from '../Componentes/ComponenteDeInterfaceDeUsuario/Input';
import { Button } from '../Componentes/ComponenteDeInterfaceDeUsuario/Button';
import { HookRedefinirSenha } from '../hooks/Hook.Redefinir.Senha';

export const ResetPassword: React.FC = () => {
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    loading,
    handleSubmit,
    isValid
  } = HookRedefinirSenha();

  return (
    <AuthLayout title="Redefinir Senha" subtitle="Crie uma nova senha">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Nova Senha" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
        
        <Input 
          label="Confirmar Senha" 
          type="password" 
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repita a nova senha"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <Button type="submit" disabled={!isValid} isLoading={loading}>
          Salvar nova senha
        </Button>
      </form>
    </AuthLayout>
  );
};
