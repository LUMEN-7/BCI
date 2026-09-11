import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {direct} from '@/services/comprationService'; // Ou o seu compareService
import {exportCar} from '@/services/exportService';

// 1. Adaptador com Case Sensitivity corrigido para a Comparação
function adaptCarToComparison(dto) {
    if (!dto) return null;

    const safeExtract = (obj, suffix = '') => {
        // Buscando com as maiúsculas vindas do C#
        let val = obj?.Fontes?.[0]?.Valor;
        
        if (Array.isArray(val)) {
            val = val.join(', ');
        }
        
        return val && val !== 'Não informado' ? `${val}${suffix}` : 'Não informado';
    };

    const specs = dto.especificacoes?.[0] || {};
    const consumos = dto.consumos?.[0] || {};
    const dimensoes = dto.dimensoes?.[0] || {};
    const extras = dto.extras?.[0] || {};

    return {
        id: dto.id,
        name: `${dto.marca} ${dto.modelo} ${dto.ano}`,
        brand: dto.marca,
        image: dto.imagemUrl || 'https://via.placeholder.com/600x400?text=Sem+Foto',
        
        // ATENÇÃO: As chaves aqui (engine, power) precisam ter o mesmo nome que 
        // estão cadastradas no seu arquivo `technicalSections` em data.js
        specs: {
            model: dto.modelo,
            brand: dto.marca,
            year: dto.ano.toString(),
            driveModes: safeExtract(dto.modos),

            engine: safeExtract(specs.motor),
            power: safeExtract(specs.potencia, ' cv'),
            torque: safeExtract(specs.torque, ' kgfm'),
            transmission: safeExtract(specs.transmissao),
            drivetrain: safeExtract(specs.tracao),
            type: safeExtract(dto.categoria),
            
            cityConsumption: safeExtract(consumos.cidade, ' km/l'),
            highwayConsumption: safeExtract(consumos.estrada, ' km/l'),
            
            length: safeExtract(dimensoes.comprimento, ' m'),
            width: safeExtract(dimensoes.largura, ' m'),
            height: safeExtract(dimensoes.altura, ' m'),
            wheelbase: safeExtract(dimensoes.entreEixos, ' m'),
            
            tankCapacity: safeExtract(extras.capacidadeTanque, ' L'),
            loadCapacity: safeExtract(extras.capacidadeCarga, ' kg'),
            fuelType: safeExtract(extras.tipoCombustivel),
        },
        sections: {
            // Arrays vazios para não quebrar a UI até termos as listas no backend
            performance: [],
            security: [],
            technology: [],
            comfort: [],
        }
    };
}

export default function useDetailController() {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [expandedSection, setExpandedSection] = useState('base'); // Controla o Ficha Técnica

    const [firstCar, setFirstCar] = useState(null);
    const [secondCar, setSecondCar] = useState(null);
    const [comparisonSummary, setComparisonSummary] = useState('');
    const [mathConclusions, setMathConclusions] = useState({});

    useEffect(() => {
        async function fetchComparison() {
            const car1 = location.state?.firstCar;
            const car2 = location.state?.secondCar;

            if (!car1 || !car2) {
                navigate(-1);
                return;
            }

            try {
                setLoading(true);

                // Faz o POST para o motor de comparação direta
                const data = await direct([car1.id, car2.id]);

                // Encontra qual é o carro 1 e o carro 2 na resposta e adapta
                const adaptado1 = adaptCarToComparison(data.carrosComparados.find(c => c.id === car1.id) || data.carrosComparados[0]);
                const adaptado2 = adaptCarToComparison(data.carrosComparados.find(c => c.id === car2.id) || data.carrosComparados[1]);

                setFirstCar(adaptado1);
                setSecondCar(adaptado2);
                
                // Injeta o Parecer de IA e as conclusões numéricas
                setComparisonSummary(data.parecerIA);
                setMathConclusions(data.conclusoesMatematicas); 

            } catch (err) {
                console.error(err);
                setError('Não foi possível gerar a comparação no momento.');
            } finally {
                setLoading(false);
            }
        }

        fetchComparison();
    }, [location.state, navigate]);

    function toggleSection(sectionId) {
        setExpandedSection((current) => current === sectionId ? null : sectionId);
    }

    // Toggle de favoritos simplificado (idealmente bate na API depois)
    function toggleFavorite() {
        setFavorite((current) => !current);
    }
    
    async function handleExport(formato = 'csv', separador = ',') {
        
        if (!firstCar || !secondCar) return;
        try {
            await exportCar([
                { linhagemId: Number(firstCar.id) },
                { linhagemId: Number(secondCar.id) }
            ], formato, undefined, separador);
        } catch (error) {
            console.error(error);
            alert('Erro ao exportar a comparação.');
        }
    }

    return {
        loading,
        error,
        firstCar,
        secondCar,
        favorite,
        handleExport, // renomeado de "Export" — segue o padrão handle* dos outros
        expandedSection,
        comparisonSummary,
        mathConclusions,
        handleBack: () => navigate(-1),
        handleHome: () => navigate('/home'),
        toggleFavorite,
        toggleSection,
    };

}