import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarAnotacao, inserirBloco } from '@/services/noteService';
import { getFavorites } from '@/services/carsService';
import { saveNote } from '@/utils/notesStorage';

function createBlock(type) {
    const base = { id: `${Date.now()}-${Math.random()}`, type };
    switch (type) {
        case 'heading':
        case 'text':
            return { ...base, content: '' };
        case 'image':
            return { ...base, src: '', alt: '' };
        case 'vehicle':
            return { ...base, vehicleId: null };
        case 'divider':
            return base;
        default:
            return { ...base, content: '' };
    }
}

const TIPO_POR_BLOCO = {
    heading: 'Titulo',
    text: 'Paragrafo',
    image: 'Imagem',
    vehicle: 'CardCarro',
    divider: 'Divisor',
};

function paraPayloadBackend(block) {
    const tipo = TIPO_POR_BLOCO[block.type];
    if (!tipo) return null;

    if ((block.type === 'heading' || block.type === 'text') && !block.content?.trim()) return null;
    if (block.type === 'vehicle' && !block.vehicleId) return null;
    if (block.type === 'image' && !block.src) return null;

    const payload = { tipo };
    if (block.type === 'heading' || block.type === 'text') payload.texto = block.content;
    if (block.type === 'image') payload.texto = block.src;
    if (block.type === 'vehicle') payload.linhagemIdReferenciado = block.vehicleId;
    return payload;
}

export default function useNoteController() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [blocks, setBlocks] = useState([createBlock('text')]);
    const [savedCars, setSavedCars] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showBlockMenu, setShowBlockMenu] = useState(false);
    const [vehiclePickerBlockId, setVehiclePickerBlockId] = useState(null);
    const [activeImageBlock, setActiveImageBlock] = useState(null);

    useEffect(() => {
        async function carregarFavoritos() {
            try {
                const resultado = await getFavorites();
                setSavedCars((resultado.favoriteCarros ?? []).map((c) => ({
                    id: c.linhagemId,
                    name: `${c.modelo} ${c.ano}`,
                    brand: c.marca,
                })));
            } catch (err) {
                console.error('Não foi possível carregar os carros favoritos.', err);
            }
        }
        carregarFavoritos();
    }, []);

    function updateBlock(id, changes) {
        setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...changes } : block)));
    }

    function removeBlock(id) {
        setBlocks((current) => current.filter((block) => block.id !== id));
    }

    function addBlock(type, index = blocks.length) {
        const newBlock = createBlock(type);
        setBlocks((current) => {
            const next = [...current];
            next.splice(index, 0, newBlock);
            return next;
        });
        setShowBlockMenu(false);
    }

    function handleImageSelect(event) {
        const file = event.target.files?.[0];
        if (!file || activeImageBlock === null || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            updateBlock(activeImageBlock, { src: reader.result, alt: file.name });
            setActiveImageBlock(null);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    function openImagePicker(blockId) {
        setActiveImageBlock(blockId);
        setTimeout(() => fileInputRef.current?.click(), 0);
    }

    async function handleSave(event) {
        if (event) event.preventDefault();
        const cleanTitle = title.trim();
        if (!cleanTitle) return;

        setSaving(true);
        setError('');
        try {
            // Constrói conteúdo Markdown correspondente a partir dos blocos
            let fullContent = '';
            blocks.forEach((block) => {
                if (block.type === 'heading' && block.content) {
                    fullContent += `\n# ${block.content}\n`;
                } else if (block.type === 'text' && block.content) {
                    fullContent += `\n${block.content}\n`;
                } else if (block.type === 'divider') {
                    fullContent += `\n---\n`;
                } else if (block.type === 'image' && block.src) {
                    fullContent += `\n![${block.alt || 'Imagem'}](${block.src})\n`;
                } else if (block.type === 'vehicle' && block.vehicleId) {
                    const car = getVehicle(block.vehicleId);
                    if (car) {
                        fullContent += `\n\n> 🚗 **[${car.name}](/information/${car.id})**\n> ${car.brand || ''}\n\n`;
                    }
                }
            });

            // Salva no armazenamento local (localStorage) para persistência imediata e sincronização
            const savedCarsList = blocks
                .filter((b) => b.type === 'vehicle' && b.vehicleId)
                .map((b) => getVehicle(b.vehicleId))
                .filter(Boolean);

            const imagesList = blocks
                .filter((b) => b.type === 'image' && b.src)
                .map((b, i) => ({ id: `img-${Date.now()}-${i}`, name: b.alt || 'Foto', url: b.src }));

            saveNote({
                title: cleanTitle,
                content: fullContent.trim(),
                savedCars: savedCarsList,
                images: imagesList,
            });

            // Tenta persistir no backend se disponível
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const anotacao = await criarAnotacao({ titulo: cleanTitle, subtitulo: tag.trim() || null });
                    for (const block of blocks) {
                        const payload = paraPayloadBackend(block);
                        if (!payload) continue;
                        await inserirBloco(anotacao.id, payload);
                    }
                } catch (apiErr) {
                    console.warn('Backend indisponível ao salvar na API, persistido localmente:', apiErr);
                }
            }
            
            navigate('/notes');
        } catch (err) {
            setError(err.message || 'Não foi possível salvar a anotação.');
        } finally {
            setSaving(false);
        }
    }

    function handleBack() {
        navigate('/notes');
    }

    function getVehicle(vehicleId) {
        return savedCars.find((car) => car.id === vehicleId);
    }

    const currentVehicleIdForModal = vehiclePickerBlockId
        ? blocks.find((b) => b.id === vehiclePickerBlockId)?.vehicleId || null
        : null;

    function handleSelectVehicleForBlock(vehicleId) {
        updateBlock(vehiclePickerBlockId, { vehicleId });
        setVehiclePickerBlockId(null);
    }

    return {
        fileInputRef,
        title, setTitle,
        tag, setTag,
        blocks,
        showBlockMenu, setShowBlockMenu,
        vehiclePickerBlockId, setVehiclePickerBlockId,
        savedCars,
        currentVehicleIdForModal,
        saving, error,
        updateBlock, removeBlock, addBlock,
        handleImageSelect, openImagePicker,
        handleSave, handleBack,
        getVehicle, handleSelectVehicleForBlock,
    };
}