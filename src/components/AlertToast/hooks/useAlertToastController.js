import { useEffect, useRef, useState } from 'react';
import { listarNotificacoes } from '@/services/notiService';

const POLL_INTERVAL = 20000;
const TOAST_DURATION = 3800;

export function useAlertToastController() {
    const [toast, setToast] = useState(null);
    const knownIdsRef = useRef(null); // null = ainda não carregou a base inicial
    const queueRef = useRef([]);
    const toastTimeoutRef = useRef(null);
    const isShowingRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const showNext = () => {
            const next = queueRef.current.shift();
            if (!next) {
                isShowingRef.current = false;
                setToast(null);
                return;
            }
            isShowingRef.current = true;
            setToast(next);
            toastTimeoutRef.current = setTimeout(showNext, TOAST_DURATION);
        };

        const checkForNewAlerts = async () => {
            try {
                const notificacoes = await listarNotificacoes();
                if (!isMounted || !Array.isArray(notificacoes)) return;

                const idsAtuais = new Set(notificacoes.map((n) => n.id));

                if (knownIdsRef.current === null) {
                    // primeira checagem: apenas define a base, sem notificar
                    knownIdsRef.current = idsAtuais;
                    return;
                }

                const novasNotificacoes = notificacoes.filter((n) => !knownIdsRef.current.has(n.id));
                knownIdsRef.current = idsAtuais;

                if (novasNotificacoes.length > 0) {
                    novasNotificacoes.forEach((n) => {
                        queueRef.current.push({
                            message: n.titulo || 'Novo alerta recebido',
                            type: n.tipo?.toLowerCase() === 'attention' ? 'error' : 'success',
                        });
                    });
                    if (!isShowingRef.current) showNext();
                }
            } catch {
                // falha silenciosa: não deve interromper a navegação do usuário
            }
        };

        checkForNewAlerts();
        const intervalId = setInterval(checkForNewAlerts, POLL_INTERVAL);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    return { toast };
}
