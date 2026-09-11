import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Topbar from './sections/topbar';
import NoteHeader from './sections/NoteHeader';
import BlockRenderer from './sections/BlockRender';
import AddBlock from './sections/AddBlock';
import VehicleModal from './sections/VehicleModal';
import useNoteController from './hooks/useNoteController';

import './style.css';

export default function NewNote() {
    const controller = useNoteController();

    return (
        <main className="new-note-page">
            <section className="new-note-container">
                <Topbar
                    blocksCount={controller.blocks.length}
                    onBack={controller.handleBack}
                    onSave={controller.handleSave}
                />

                <form className="new-note-editor" onSubmit={controller.handleSave}>
                    <NoteHeader
                        title={controller.title}
                        setTitle={controller.setTitle}
                        tag={controller.tag}
                        setTag={controller.setTag}
                    />

                    <div className="editor-divider" />

                    <div className="blocks-container">
                        {controller.blocks.map((block, index) => (
                            <BlockRenderer
                                key={block.id}
                                block={block}
                                index={index}
                                vehicle={controller.getVehicle(block.vehicleId)}
                                onUpdate={controller.updateBlock}
                                onRemove={controller.removeBlock}
                                onAddAfter={(idx, type) => controller.addBlock(type, idx + 1)}
                                onOpenImagePicker={controller.openImagePicker}
                                onOpenVehiclePicker={(blockId) => controller.setVehiclePickerBlockId(blockId)}
                            />
                        ))}
                    </div>

                    <AddBlock
                        showMenu={controller.showBlockMenu}
                        onToggleMenu={() => controller.setShowBlockMenu((curr) => !curr)}
                        onAddBlock={(type) => controller.addBlock(type)}
                    />
                </form>
            </section>

            <input
                ref={controller.fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={controller.handleImageSelect}
            />

            <VehicleModal
                isOpen={Boolean(controller.vehiclePickerBlockId)}
                onClose={() => controller.setVehiclePickerBlockId(null)}
                savedCars={controller.savedCars}
                currentVehicleId={controller.currentVehicleIdForModal}
                onSelectVehicle={controller.handleSelectVehicleForBlock}
            />
        </main>
    );
}