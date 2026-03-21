
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState(SistemaAutenticacaoSupremo.getState());

    const [dadosPerfil, setDadosPerfil] = useState<Partial<Usuario>>({
        nome: '',
        apelido: '',
        bio: '',
        privado: false,
    });

    const [previaImagem, setPreviaImagem] = useState<string | null>(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [errors, setErrors] = useState<{ nome?: string, apelido?: string, formulario?: string }>({});
    const [cortarAberto, setCortarAberto] = useState(false);
    const [imagemOriginal, setImagemOriginal] = useState<string>('');

    useEffect(() => {
        const unsubscribe = SistemaAutenticacaoSupremo.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const { user, loading } = authState;
        
        if (!loading) { // Wait for auth state to be confirmed
            if (!user) {
                navigate('/');
            } else if (user.perfilCompleto) {
                navigate('/feed');
            }
        }
    }, [navigate, authState]);

    const updateField = useCallback((key: keyof Usuario, value: string | boolean) => {
        let valorFinal = value;
        if (key === 'apelido' && typeof value === 'string') {
            const valorLimpo = value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
            valorFinal = valorLimpo;
            setErrors(prev => ({ ...prev, apelido: undefined }));
        }
        
        setDadosPerfil(prev => ({ ...prev, [key]: valorFinal }));
    }, []);

    const aoMudarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagemOriginal(ev.target?.result as string);
                setCortarAberto(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const aoSalvarImagemCortada = (base64Cortada: string) => {
        setPreviaImagem(base64Cortada);
        fetch(base64Cortada)
          .then(res => res.blob())
          .then(blob => {
              const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
              setArquivoSelecionado(file);
          });
    };

    const aoSubmeter = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!dadosPerfil.apelido?.trim()) {
            setErrors({ apelido: 'Apelido é obrigatório.' });
            return;
        }

        setCarregando(true);

        const dadosParaApi: Partial<Usuario> = {
            nome: dadosPerfil.nome || '',
            apelido: dadosPerfil.apelido || '',
            bio: dadosPerfil.bio || '',
            urlFoto: '', 
            site: '', 
            privado: dadosPerfil.privado,
        };

        try {
            // if (arquivoSelecionado) {
            //     dadosParaApi.urlFoto = await fileService.uploadFile(arquivoSelecionado);
            // }

            await SistemaAutenticacaoSupremo.completeProfile(dadosParaApi);
            
            // Redireciona para o feed após o sucesso
            navigate('/feed');

        } catch (err: any) {
            console.error("Falha ao completar o perfil no hook 'useCompleteProfile':", err);
            
            if (err.message && err.message.includes('APELIDO_TAKEN')) {
                setErrors({ apelido: 'Este apelido já está em uso.' });
            } else {
                setErrors({ formulario: err.message || 'Ocorreu um erro ao finalizar o perfil. Tente novamente.' });
            }
        } finally {
            setCarregando(false);
        }
    };
    
    const aoSair = () => {
        SistemaAutenticacaoSupremo.logout();
        navigate('/');
    };

    return {
        dadosFormulario: dadosPerfil,
        perfilPrivado: dadosPerfil.privado,
        previaImagem,
        carregando,
        erroApelido: errors.apelido,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(e.target.name as keyof Usuario, e.target.value),
        aoMudarImagem,
        aoSalvarImagemCortada,
        aoMudarPrivacidade: (marcado: boolean) => updateField('privado', marcado),
        aoSubmeter,
        aoSair
    };
};
