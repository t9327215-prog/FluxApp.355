
import { run as runMigrations } from '../../scripts/executar-migracoes.js';
import { db, auditorDoPostgreSQL } from './Sistema.Banco.Dados.js';

export async function initializeDatabase() {
    try {
        await runMigrations();
        console.info({
            camada: 'Backend',
            componente: 'Banco de Dados',
            arquivo: 'init.js',
            mensagem: 'Migrações do banco de dados aplicadas com sucesso.'
        });

        await db.init();
        console.info({
            camada: 'Backend',
            componente: 'Banco de Dados',
            arquivo: 'init.js',
            mensagem: 'Sistema de banco de dados inicializado com sucesso.'
        });

        setTimeout(() => {
            auditorDoPostgreSQL.inspectDatabases(console);
        }, 5000);

    } catch (error) {
        console.error({
            camada: 'Backend',
            componente: 'Core',
            arquivo: 'init.js',
            mensagem: `Falha crítica durante a inicialização do banco de dados: ${error.message}`,
            error
        });
        process.exit(1);
    }
}
