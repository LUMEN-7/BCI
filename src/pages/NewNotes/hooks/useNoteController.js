import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarAnotacao, inserirBloco } from '@/services/noteService';
import { getFavorites } from '@/services/carsService';

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
            const anotacao = await criarAnotacao({ titulo: cleanTitle, subtitulo: tag.trim() || null });
            // sequencial de propósito — cada insert entra no fim da lista, então a ordem
            // do array precisa virar ordem de chamada; Promise.all embaralharia isso
            for (const block of blocks) {
                const payload = paraPayloadBackend(block);
                if (!payload) continue;
                await inserirBloco(anotacao.id, payload);
                console.log(anotacao)
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