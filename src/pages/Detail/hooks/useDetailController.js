import { useEffect,useRef ,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {direct} from '@/services/comprationService'; // Ou o seu compareService
import { salvarComparacao } from '@/services/userService'
import {exportCar} from '@/services/exportService';
import { number } from 'framer-motion';

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
    const [salvando, setSalvando] = useState(false);
    const [expandedSection, setExpandedSection] = useState('base');

    const [firstCar, setFirstCar] = useState(null);
    const [secondCar, setSecondCar] = useState(null);
    const [comparisonSummary, setComparisonSummary] = useState('');
    const [mathConclusions, setMathConclusions] = useState({});

    const carrosIdsRef = useRef(null); // payload exato usado pra gerar essa comparação

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
                if(Number.isFinite(car1) && Number.isFinite(car2)){carrosIdsRef.current = [car1, car2]; console.log("dasdadads")}
                else carrosIdsRef.current = [car1.id, car2.id];
                console.log(carrosIdsRef.current)
                const data = await direct(carrosIdsRef.current);

                const adaptado1 = adaptCarToComparison(data.carrosComparados.find(c => c.id === car1.id) || data.carrosComparados[0]);
                const adaptado2 = adaptCarToComparison(data.carrosComparados.find(c => c.id === car2.id) || data.carrosComparados[1]);

                setFirstCar(adaptado1);
                setSecondCar(adaptado2);
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

    async function toggleFavorite() {
        if (favorite || salvando || !carrosIdsRef.current) return; // não existe endpoint de "desfavoritar" comparação ainda — one-way

        setSalvando(true);
        try {
            const requestPayload = JSON.stringify({ carrosIds: carrosIdsRef.current });
            const titulo = `${firstCar?.brand ?? ''} ${firstCar?.name ?? ''} vs ${secondCar?.brand ?? ''} ${secondCar?.name ?? ''}`.trim();

            await salvarComparacao({ titulo, tipo: 'Direta', requestPayload });
            setFavorite(true);
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar a comparação.');
        } finally {
            setSalvando(false);
        }
    }

    async function handleExport(formato, separador) {
        if (!firstCar || !secondCar) return;
        try {
            await exportCar(
                [{ linhagemId: Number(firstCar.id) }, { linhagemId: Number(secondCar.id) }],
                formato,
                undefined,
                separador
            );
        } catch (err) {
            console.error(err);
            alert('Erro ao exportar a comparação.');
        }
    }

    return {
        loading,
        error,
        firstCar,
        secondCar,
        favorite,
        salvando,
        handleExport,
        expandedSection,
        comparisonSummary,
        mathConclusions,
        handleBack: () => navigate(-1),
        handleHome: () => navigate('/home'),
        toggleFavorite,
        toggleSection,
    };
}