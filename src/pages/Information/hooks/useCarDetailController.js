import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {obterCarro, removeFavorite, addFavorites} from '@/services/carsService'; // Ajuste o caminho do seu apiFetch
import {exportCar} from '@/services/exportService';

// Adaptador: Transforma o JSON complexo do C# no formato exigido pelo Technical e Specs
// Adaptador: Transforma o JSON complexo do C# no formato exigido pelo Technical e Specs
function adaptCarToDetail(dto) {
    if (!dto) return null;

    // Função auxiliar ajustada para o formato exato do Console.log (Case Sensitive)
    const safeExtract = (obj, suffix = '') => {
        // CUIDADO: Usando as maiúsculas exatas vindas do C# (Fontes, Valor, Fonte)
        let val = obj?.Fontes?.[0]?.Valor;
        const sourceUrl = obj?.Fontes?.[0]?.Fonte; // Ex: 'webmotors.com.br'

        // Se o valor for um array (como no caso dos Modos de Condução), junta tudo em uma string
        if (Array.isArray(val)) {
            val = val.join(', ');
        }

        // Tenta achar o ID numérico da fonte cruzando com o catálogo de fontes do próprio carro
        let sourceId = null;
        if (sourceUrl && dto.fontes) {
            const fonteEncontrada = dto.fontes.find(f => f.url === sourceUrl || f.nome === sourceUrl);
            if (fonteEncontrada) {
                sourceId = fonteEncontrada.id; 
            } else {
                sourceId = sourceUrl; // Fallback caso não ache
            }
        }
        
        return {
            value: val && val !== 'Não informado' ? `${val}${suffix}` : 'Não informado',
            source: sourceId // Passa o ID correto para o componente SourceTag funcionar
        };
    };

    const specs = dto.especificacoes?.[0] || {};
    const consumos = dto.consumos?.[0] || {};
    const dimensoes = dto.dimensoes?.[0] || {};
    const extras = dto.extras?.[0] || {};
    const pneus = dto.pneus?.[0] || {};

    return {
        id: dto.id,
        name: `${dto.modelo} ${dto.ano}`,
        brand: dto.marca,
        image: dto.imagemUrl || 'https://via.placeholder.com/600x400?text=Sem+Foto',
        description: 'Dados técnicos detalhados extraídos da base da API Forde.',
        lastUpdated: 'Hoje',
        updatedAgo: 'Base atualizada',
        
        specs: {
            model: { value: dto.modelo },
            brand: { value: dto.marca },
            year: { value: dto.ano.toString() },
            
            engine: safeExtract(specs.motor),
            power: safeExtract(specs.potencia, ' cv'),
            type: safeExtract(dto.categoria),
            consumption: safeExtract(consumos.cidade, ' km/l'),
            
            torque: safeExtract(specs.torque, ' kgfm'),
            powerRpm: safeExtract(specs.potenciaRpm, ' rpm'),
            torqueRpm: safeExtract(specs.torqueRpm, ' rpm'),
            transmission: safeExtract(specs.transmissao),
            drivetrain: safeExtract(specs.tracao),
            
            cityConsumption: safeExtract(consumos.cidade, ' km/l'),
            highwayConsumption: safeExtract(consumos.estrada, ' km/l'),
            
            length: safeExtract(dimensoes.comprimento, ' m'),
            width: safeExtract(dimensoes.largura, ' m'),
            height: safeExtract(dimensoes.altura, ' m'),
            wheelbase: safeExtract(dimensoes.entreEixos, ' m'),
            
            tireType: safeExtract(pneus.tipo),
            rim: safeExtract(pneus.aro, '"'),
            tireWidth: safeExtract(pneus.largura, ' mm'),
            tireProfile: safeExtract(pneus.perfil, '%'),
            
            tankCapacity: safeExtract(extras.capacidadeTanque, ' L'),
            fuelType: safeExtract(extras.tipoCombustivel),
            loadCapacity: safeExtract(extras.capacidadeCarga, ' kg'),
            towingCapacity: safeExtract(extras.capacidadeReboque, ' kg'),
            
            driveModes: safeExtract(dto.modos),
        },
        sections: {
            performance: [],
            security: [],
            technology: [],
            comfort: [],
        },
        analysis: {
            strengths: ['Análise de IA individual em desenvolvimento.'],
            weaknesses: ['-'],
            bestUse: 'Consulte os dados técnicos numéricos acima.',
            competitors: ['-']
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
    const [favorite, setFavorite] = useState(false); // Você pode inicializar true se vier do state
    
    // Controles de UI da Ficha Técnica
    const [openSection, setOpenSection] = useState('base');
    const [showSources, setShowSources] = useState(false);

    useEffect(() => {
        async function fetchCarDetails() {
            if (!id) return;
            try {
                setLoading(true);
                // Busca o carro pelo ID no backend
                const dto = await obterCarro(id);
                console.log(dto)
                setCar(adaptCarToDetail(dto));
                
                // Opcional: Você pode fazer um GET em /UsuarioHistorico/modelos 
                // aqui para verificar se esse carro já está favoritado
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar os detalhes do veículo.');
            } finally {
                setLoading(false);
            }
        }
        fetchCarDetails();
    }, [id]);

    async function toggleFavorite() {
        // Lógica otimista (muda a UI na hora para parecer rápido)
        const newStatus = !favorite;
        setFavorite(newStatus);
        
        try {
            if (newStatus) {
                await addFavorites(id);
            } else {
                await removeFavorite(id);
            }
        } catch (error) {
            // Se der erro na API, reverte a UI
            setFavorite(!newStatus);
            alert("Erro ao favoritar o veículo.");
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
        favorite,
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
