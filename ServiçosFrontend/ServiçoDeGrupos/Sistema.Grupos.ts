
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupos.ts

/**
 * @file Agregador de serviços relacionados a grupos.
 * 
 * Este arquivo importa todos os serviços modulares de grupo (cargos, membros, convites, etc.)
 * e os exporta como um único objeto `groupSystem`. Isso mantém uma API consistente
 * para o resto da aplicação, permitindo que a lógica interna seja dividida em arquivos menores
 * e mais fáceis de gerenciar, sem quebrar o código que consome esses serviços.
 */

import * as roleService from './Servico.Sistema.Cargos';
import * as inviteService from './Servico.Sistema.Convites';
import * as memberService from './Servico.Sistema.Membros';
import * as generalService from './Servico.Sistema.Geral';
import * as auditAdjustService from './Servico.Sistema.Auditoria.Ajuste';
import * as auditReportService from './Servico.Sistema.Auditoria.Denuncias';
import * as auditEntryExitService from './Servico.Sistema.Auditoria.Entrada.Saida';
import * as auditMessageService from './Servico.Sistema.Auditoria.Mensagens';
import * as hubModeService from './Servico.Sistema.Modo.Hub'; // <-- ADICIONADO

/**
 * Objeto de serviço unificado que combina todos os submódulos de grupo.
 * Mantém uma interface consistente para o resto da aplicação.
 */
export const groupSystem = {
    // Funções do serviço de cargos
    ...roleService,

    // Funções do serviço de convites
    ...inviteService,

    // Funções do serviço de membros
    ...memberService,

    // Funções do serviço de configurações gerais e estatísticas
    ...generalService,

    // Funções do serviço de auditoria de ajustes
    ...auditAdjustService,

    // Funções do serviço de auditoria de denúncias
    ...auditReportService,

    // Funções do serviço de auditoria de entrada e saída
    ...auditEntryExitService,

    // Funções do serviço de auditoria de mensagens
    ...auditMessageService,

    // Funções do serviço de modo hub
    ...hubModeService, // <-- ADICIONADO

};
