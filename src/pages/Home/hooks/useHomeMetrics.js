import { useEffect, useState } from 'react';
import {modelosSalvos, salvas, essaSemana} from "@/services/userService"
import {ativas} from "@/services/notiService"

function contarNaUltimaSemana(itens, campoData) {
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
    return itens.filter((item) => new Date(item[campoData]) >= umaSemanaAtras).length;
}

export default function useHomeMetrics() {
    const [metrics, setMetrics] = useState([
        { value: '--', label: 'MODELOS\nMONITORADOS' },
        { value: '--', label: 'COMPARAÇÕES\nSALVAS' },
        { value: '--', label: 'ANÁLISES\nESTA SEMANA' },
        { value: '--', label: 'ALERTAS\nATIVOS' },
    ]);
    const [loadingMetrics, setLoadingMetrics] = useState(true);

    useEffect(() => {
        async function carregarMetricas() {
            try {
                setLoadingMetrics(true);


                const modelosMonitorados = await modelosSalvos()
                const alertasAtivos = await ativas()
                const comparacoesSalvas = await salvas()
                const comparacoesEstaSemana = await essaSemana()
                setMetrics([
                    { value: String(modelosMonitorados).padStart(2, '0'), label: 'MODELOS\nMONITORADOS' },
                    { value: String(comparacoesSalvas).padStart(2, '0'), label: 'COMPARAÇÕES\nSALVAS' },
                    { value: String(comparacoesEstaSemana).padStart(2, '0'), label: 'ANÁLISES\nESTA SEMANA' },
                    { value: String(alertasAtivos).padStart(2, '0'), label: 'ALERTAS\nATIVOS' },
                ]);
            } catch (err) {
                console.error(err); // fica com '--' já setado no estado inicial
            } finally {
                setLoadingMetrics(false);
            }
        }
        carregarMetricas();
    }, []);

    return { metrics, loadingMetrics };
}