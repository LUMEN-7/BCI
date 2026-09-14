import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {obterCarro} from '@/services/carsService'; // Ajuste o caminho do seu apiFetch
import {removeFavorite, addFavorites} from '@/services/userService';
import {exportCar} from '@/services/exportService';
import { analisarVeiculo } from '@/services/aiService';
import { appendRecentViewedCar } from '@/utils/recentViewedCars';

// Adaptador: Transforma o JSON complexo do C# no formato exigido pelo Technical e Specs
function adaptCarToDetail(dto) {
    if (!dto) return null;

    const rawFontes = dto.fontes || dto.Fontes || dto.sources || dto.Sources || [];
    const fontesList = Array.isArray(rawFontes) ? rawFontes : [];

    // Função auxiliar ajustada para extrair valor e fonte (sempre retornando o link/URL da fonte)
    const safeExtract = (obj, suffix = '') => {
        if (!obj) return { value: 'Não informado', source: null };

        const fontesArray = obj?.Fontes || obj?.fontes;
        const firstFonte = Array.isArray(fontesArray)
            ? fontesArray[0]
            : (typeof fontesArray === 'object' && fontesArray !== null ? fontesArray : null);

        let val = firstFonte?.Valor ?? firstFonte?.valor ?? obj?.Valor ?? obj?.valor ?? (typeof obj === 'string' || typeof obj === 'number' ? obj : null);
        
        // Pega a fonte que vem do backend (ex: 'carrosnaweb.com.br', 'webmotors.com.br' ou ID)
        const rawSource = 
            firstFonte?.Fonte ?? 
            firstFonte?.fonte ?? 
            firstFonte?.Url ?? 
            firstFonte?.url ?? 
            firstFonte?.Link ?? 
            firstFonte?.link ?? 
            firstFonte?.Site ?? 
            firstFonte?.site ?? 
            firstFonte?.Nome ?? 
            firstFonte?.nome ?? 
            obj?.Fonte ?? 
            obj?.fonte ?? 
            obj?.source ?? 
            null;

        // Se o valor for um array (como no caso dos Modos de Condução), junta tudo em uma string
        if (Array.isArray(val)) {
            val = val.join(', ');
        }

        // Tenta achar o link/URL da fonte cruzando com o catálogo de fontes do próprio carro (evita IDs numéricos)
        let sourceValue = rawSource ? String(rawSource).trim() : null;
        if (sourceValue && fontesList.length > 0) {
            const fonteEncontrada = fontesList.find(f => 
                String(f.id ?? f.Id ?? '') === sourceValue ||
                String(f.url ?? f.Url ?? '') === sourceValue ||
                String(f.link ?? f.Link ?? '') === sourceValue ||
                String(f.site ?? f.Site ?? '') === sourceValue ||
                String(f.nome ?? f.Nome ?? '') === sourceValue
            );
            if (fonteEncontrada) {
                // Sempre prioriza o link / URL da fonte
                sourceValue = 
                    fonteEncontrada.url || 
                    fonteEncontrada.Url || 
                    fonteEncontrada.link || 
                    fonteEncontrada.Link || 
                    fonteEncontrada.site || 
                    fonteEncontrada.Site || 
                    fonteEncontrada.nome || 
                    fonteEncontrada.Nome || 
                    sourceValue; 
            }
        }
        
        return {
            value: val !== null && val !== undefined && val !== 'Não informado' ? `${val}${suffix}` : 'Não informado',
            source: sourceValue // Retorna o link (ex: 'carrosnaweb.com.br')
        };
    };

    const specs = dto.especificacoes?.[0] || dto.Especificacoes?.[0] || {};
    const consumos = dto.consumos?.[0] || dto.Consumos?.[0] || {};
    const dimensoes = dto.dimensoes?.[0] || dto.Dimensoes?.[0] || {};
    const extras = dto.extras?.[0] || dto.Extras?.[0] || {};
    const pneus = dto.pneus?.[0] || dto.Pneus?.[0] || {};

    return {
        id: dto.id || dto.Id || dto.linhagemId || dto.LinhagemId,
        name: `${dto.modelo || dto.Modelo || ''} ${dto.ano || dto.Ano || ''}`.trim(),
        brand: dto.marca || dto.Marca,
        image: dto.imagemUrl || dto.ImagemUrl || 'https://via.placeholder.com/600x400?text=Sem+Foto',
        description: dto.descricao || dto.Descricao || 'Dados técnicos detalhados extraídos da base da API Forde.',
        lastUpdated: 'Hoje',
        updatedAgo: 'Base atualizada',
        sources: fontesList,
        fontes: fontesList,
        
        specs: {
            model: { value: dto.modelo || dto.Modelo },
            brand: { value: dto.marca || dto.Marca },
            year: { value: (dto.ano || dto.Ano || '').toString() },
            
            engine: safeExtract(specs.transmissao || specs.Transmissao),
            power: safeExtract(specs.potencia || specs.Potencia, ' cv'),
            type: safeExtract(dto.categoria || dto.Categoria),
            consumption: safeExtract(consumos.cidade || consumos.Cidade, ' km/l'),
            
            torque: safeExtract(specs.torque || specs.Torque, ' kgfm'),
            powerRpm: safeExtract(specs.potenciaRpm || specs.PotenciaRpm, ' rpm'),
            torqueRpm: safeExtract(specs.torqueRpm || specs.TorqueRpm, ' rpm'),
            transmission: safeExtract(specs.transmissao || specs.Transmissao),
            drivetrain: safeExtract(specs.tracao || specs.Tracao),
            
            cityConsumption: safeExtract(consumos.cidade || consumos.Cidade, ' km/l'),
            highwayConsumption: safeExtract(consumos.estrada || consumos.Estrada, ' km/l'),
            
            length: safeExtract(dimensoes.comprimento || dimensoes.Comprimento, ' m'),
            width: safeExtract(dimensoes.largura || dimensoes.Largura, ' m'),
            height: safeExtract(dimensoes.altura || dimensoes.Altura, ' m'),
            wheelbase: safeExtract(dimensoes.entreEixos || dimensoes.EntreEixos, ' m'),
            
            tireType: safeExtract(pneus.tipo || pneus.Tipo),
            rim: safeExtract(pneus.aro || pneus.Aro, '"'),
            tireWidth: safeExtract(pneus.largura || pneus.Largura, ' mm'),
            tireProfile: safeExtract(pneus.perfil || pneus.Perfil, '%'),
            
            tankCapacity: safeExtract(extras.capacidadeTanque || extras.CapacidadeTanque, ' L'),
            fuelType: safeExtract(extras.tipoCombustivel || extras.TipoCombustivel),
            loadCapacity: safeExtract(extras.capacidadeCarga || extras.CapacidadeCarga, ' kg'),
            towingCapacity: safeExtract(extras.capacidadeReboque || extras.CapacidadeReboque, ' kg'),
            
            driveModes: safeExtract(dto.modos || dto.Modos),
        },
        sections: {
            performance: [],
            security: [],
            technology: [],
            comfort: [],
        },
        analysis: {
            strengths: [],
            weaknesses: [],
            bestUse: '',
            competitors: []
        }
    };
}

export default function useCarDetailController() {
    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID da URL (ex: /carro/5)
    
    // Estados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [car, setCar] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [favorites, setFavorites] = useState([]); // Você pode inicializar true se vier do state
    
    // Controles de UI da Ficha Técnica
    const [openSection, setOpenSection] = useState('base');
    const [showSources, setShowSources] = useState(false);

    useEffect(() => {
        let isCurrentRequest = true;

        async function fetchCarDetails() {
            if (!id) return;
            try {
                setLoading(true);
                // Busca o carro pelo ID no backend
                const dto = await obterCarro(id);
                if (!isCurrentRequest) return;
                const adapted = adaptCarToDetail(dto);
                setCar(adapted);
                if (adapted) {
                    appendRecentViewedCar(adapted);
                    setAnalysisLoading(true);
                    setAnalysisError('');
                    try {
                        const analysis = await analisarVeiculo({
                            nome: adapted.name,
                            marca: adapted.brand,
                            ano: adapted.specs.year.value,
                            dados: dto,
                        });
                        if (!isCurrentRequest) return;
                        setCar((currentCar) => currentCar
                            ? { ...currentCar, analysis }
                            : currentCar);
                    } catch (analysisErr) {
                        if (!isCurrentRequest) return;
                        console.error(analysisErr);
                        setAnalysisError(analysisErr.message || 'Não foi possível gerar a análise da IA.');
                    } finally {
                        if (isCurrentRequest) setAnalysisLoading(false);
                    }
                }
                
                // Opcional: Você pode fazer um GET em /UsuarioHistorico/modelos 
                // aqui para verificar se esse carro já está favoritado
            } catch (err) {
                if (!isCurrentRequest) return;
                console.error(err);
                setError('Não foi possível carregar os detalhes do veículo.');
            } finally {
                if (isCurrentRequest) setLoading(false);
            }
        }
        fetchCarDetails();

        return () => {
            isCurrentRequest = false;
        };
    }, [id]);


    async function toggleFavorite() {
        const strId = String(id);
        const jaFavoritado = favorites.includes(strId);
        try {
            if (jaFavoritado) {
                await removeFavorite(id);
                setFavorites((prev) => prev.filter((f) => f !== strId));
            } else {
                await addFavorites(id);
                setFavorites((prev) => [...prev, strId]);
            }
            return { success: true, acao: jaFavoritado ? 'removido' : 'adicionado' };
        } catch (err) {
            // setError(err.message || 'Não foi possível atualizar os favoritos.');
            console.log(err)
            return { success: false };
        }
    }
    

    async function handleExport(formato = 'csv', separador = ',') {
        try {
            await exportCar([{ linhagemId: Number(id) }], formato, undefined, separador);
        } catch (error) {
            console.error(error);
            alert('Erro ao exportar dados do veículo.');
        }
    }

    return {
        loading,
        error,
        car,
        analysisLoading,
        analysisError,
        favorites,
        openSection,
        showSources,
        handleBack: () => navigate(-1),
        handleHome: () => navigate('/home'),
        handleCompare: () => navigate('/compare'),
        toggleFavorite,
        toggleSection: (sectionId) => setOpenSection(curr => curr === sectionId ? null : sectionId),
        toggleSources: () => setShowSources(curr => !curr),
        handleExport, // <- faltava
    };
}
