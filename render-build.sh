#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Iniciando o processo de build da Render..."

# 1. Instala todas as dependências
echo "Instalando dependências com npm install..."
npm install

# 2. Executa as migrações do banco de dados
echo "Executando migrações do banco de dados com npm run migrate..."
npm run migrate

# 3. Gera o build do frontend para produção
echo "Gerando o build do frontend com npm run build..."
npm run build

echo "Processo de build da Render concluído com sucesso."
