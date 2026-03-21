
import API_Criacao_Grupo_Pago from '../APIs/APIsServicoGrupos/API.Criacao.Grupo.Pago';
// import { fileService } from '../ServiçoDeArquivos/fileService';

// Interfaces
interface MediaGalleryItem {
    url: string;
    type: string;
}

interface VipMediaItem {
    file?: File;
    url?: string;
    type: string;
}

interface CreatePaidGroupPayload {
    groupName: string;
    description: string;
    selectedCoverFile?: File;
    vipMediaItems: VipMediaItem[];
    vipDoorText: string;
    vipButtonText: string;
    numericPrice: number;
    currency: string;
    accessType: string;
    accessConfig: any;
    selectedProviderId: string;
    pixelId?: string;
    pixelToken?: string;
}

interface ApiPayload {
    groupName: string;
    description: string;
    finalCoverUrl: string;
    vipDoorText: string;
    vipButtonText: string;
    numericPrice: number;
    currency: string;
    accessType: string;
    accessConfig: any;
    selectedProviderId: string;
    pixelId?: string;
    pixelToken?: string;
    finalMediaGallery: MediaGalleryItem[];
}

type ProgressCallback = (progress: number, uploaded: number, total: number, error?: boolean) => void;

class ServiçoCriaçãoGrupoPago {
    async criar(payload: CreatePaidGroupPayload, onProgress: ProgressCallback): Promise<any> {
        const {
            groupName, description, selectedCoverFile, vipMediaItems,
            vipDoorText, vipButtonText, numericPrice, currency, accessType,
            accessConfig, selectedProviderId, pixelId, pixelToken
        } = payload;

        let filesToUpload: File[] = [];

        try {
            filesToUpload = vipMediaItems
                .map(item => item.file)
                .filter((file): file is File => Boolean(file));

            if (selectedCoverFile) {
                filesToUpload.unshift(selectedCoverFile);
            }

            onProgress(0, 0, filesToUpload.length);

            let filesUploadedCount = 0;
            let finalCoverUrl = '';
            const finalMediaGallery: MediaGalleryItem[] = [];

            if (selectedCoverFile) {
                // finalCoverUrl = await fileService.upload(selectedCoverFile, `group-covers/${Date.now()}_${selectedCoverFile.name}`);
                console.warn("fileService.upload removido. A imagem de capa não será enviada.");
                filesUploadedCount++;
                onProgress((filesUploadedCount / filesToUpload.length) * 100, filesUploadedCount, filesToUpload.length);
            }

            const vipItemsWithFiles = vipMediaItems.filter(item => item.file);
            for (const item of vipItemsWithFiles) {
                if(item.file) {
                    // const uploadedUrl = await fileService.upload(item.file, `vip-door-media/${Date.now()}_${item.file.name}`);
                    console.warn("fileService.upload removido. O arquivo de mídia VIP não será enviado.");
                    // finalMediaGallery.push({ url: uploadedUrl, type: item.type });
                    filesUploadedCount++;
                    onProgress((filesUploadedCount / filesToUpload.length) * 100, filesUploadedCount, filesToUpload.length);
                }
            }

            vipMediaItems.forEach(item => {
                if (!item.file && item.url) {
                    finalMediaGallery.push({ url: item.url, type: item.type });
                }
            });

            const apiPayload: ApiPayload = {
                groupName, description, finalCoverUrl, vipDoorText, vipButtonText,
                numericPrice, currency, accessType, accessConfig, selectedProviderId,
                pixelId, pixelToken, finalMediaGallery,
            };

            const { data } = await API_Criacao_Grupo_Pago.criar(apiPayload);

            return data;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha ao criar o grupo VIP.';
            onProgress(100, filesToUpload.length, filesToUpload.length, true);
            throw new Error(errorMessage);
        }
    }
}

export default new ServiçoCriaçãoGrupoPago();
