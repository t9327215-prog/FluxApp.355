
import API_Criacao_Grupo_Privado from '../APIs/APIsServicoGrupos/API.Criacao.Grupo.Privado';
// import { fileService } from '../ServiçoDeArquivos/fileService';

// Interfaces
interface GroupData {
    name: string;
    description: string;
    coverImageBlob?: Blob;
}

interface Payload {
    name: string;
    description: string;
    coverImage: string;
}

class ServiçoCriaçãoGrupoPrivado {
    async criar(groupData: GroupData): Promise<any> {
        try {
            let coverImageUrl = '';
            if (groupData.coverImageBlob) {
                // coverImageUrl = await fileService.upload(groupData.coverImageBlob, `group-covers/${Date.now()}.png`);
                console.warn("fileService.upload removido. A imagem de capa não será enviada.");
            }

            const payload: Payload = {
                name: groupData.name,
                description: groupData.description,
                coverImage: coverImageUrl,
            };

            const { data } = await API_Criacao_Grupo_Privado.criar(payload);

            return data;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha ao criar o grupo privado.';
            throw new Error(errorMessage);
        }
    }
}

export default new ServiçoCriaçãoGrupoPrivado();
