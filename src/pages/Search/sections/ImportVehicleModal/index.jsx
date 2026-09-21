import {
  IoCarSportOutline,
  IoCloseOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoAddOutline,
  IoSaveOutline,
} from 'react-icons/io5';
import { useState } from 'react';

import useImportVehicleModal, {
  FIELD_GROUPS,
  FEATURE_GROUPS,
  normalizeFeatureItems,
} from '../../hooks/useImportVehicleModal';

import './style.css';

function FeatureListField({ field, label, value, onChange }) {
  const [draft, setDraft] = useState('');
  const items = normalizeFeatureItems(value);

  function addItem(event) {
    event.preventDefault();
    const item = draft.trim();
    if (!item) return;
    onChange([...items, item]);
    setDraft('');
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="import-feature-list-field">
      <span>{label}</span>
      <div className="import-feature-list">
        {items.length === 0 && <small>Nenhum item adicionado</small>}
        {items.map((item, index) => (
          <div className="import-feature-list-item" key={`${item}-${index}`}>
            <span>{item}</span>
            <button type="button" onClick={() => removeItem(index)} aria-label={`Remover ${item}`}>
              <IoCloseOutline />
            </button>
          </div>
        ))}
      </div>
      <div className="import-feature-add-row">
        <input
          value={draft}
          placeholder="Adicionar item"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && addItem(event)}
        />
        <button type="button" onClick={addItem} aria-label={`Adicionar item em ${field}`}>
          <IoAddOutline />
        </button>
      </div>
    </div>
  );
}

export default function ImportVehicleModal({ isOpen, onClose, initialVehicle, onSaved }) {
  const controller = useImportVehicleModal({ isOpen, initialVehicle, onSaved, onClose });

  if (!isOpen) return null;

  return (
    <div className="import-vehicle-backdrop" onClick={onClose}>
      <div className="import-vehicle-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header className="import-vehicle-header">
          <div>
            <span className="section-eyebrow">CADASTRO DE VEÍCULO</span>
            <h2>{controller.step === 'choice' ? 'Como deseja cadastrar?' : initialVehicle ? 'Editar veículo' : 'Revisar ficha do veículo'}</h2>
          </div>
          <button type="button" className="import-vehicle-close" onClick={onClose} aria-label="Fechar">
            <IoCloseOutline />
          </button>
        </header>

        {controller.step === 'choice' ? (
          <div className="import-vehicle-choice">
            <button type="button" className="import-choice-card" onClick={() => controller.fileInputRef.current?.click()}>
              <IoCloudUploadOutline />
              <strong>Importar automaticamente do arquivo</strong>
              <span>Leia um CSV ou JSON e preencha a ficha com os dados encontrados.</span>
            </button>
            <button type="button" className="import-choice-card" onClick={() => controller.setStep('form')}>
              <IoDocumentTextOutline />
              <strong>Preencher ficha manualmente</strong>
              <span>Comece com uma ficha vazia e informe os dados do veículo.</span>
            </button>
            <input ref={controller.fileInputRef} type="file" accept=".csv,.json,application/json,text/csv" hidden onChange={controller.handleFile} />
          </div>
        ) : (
          <form className="import-vehicle-form" onSubmit={controller.handleSave}>
            <div className="import-vehicle-photo-field">
              <div className="import-vehicle-photo-preview">
                {controller.vehicle.image ? <img src={controller.vehicle.image} alt="Prévia do veículo" /> : <IoCarSportOutline />}
              </div>
              <div>
                <strong>Foto do modelo</strong>
                <span>{controller.fileName || 'Adicione uma imagem para identificar o veículo.'}</span>
                <label className="import-photo-button">
                  <IoCloudUploadOutline />
                  <span>Enviar foto</span>
                  <input type="file" accept="image/*" hidden onChange={controller.handlePhoto} />
                </label>
              </div>
            </div>

            {FIELD_GROUPS.map((group) => (
              <section className="import-vehicle-field-section" key={group.title}>
                <div className="import-vehicle-section-heading">
                  <span>Ficha técnica</span>
                  <h3>{group.title}</h3>
                </div>
                <div className="import-vehicle-fields">
                  {group.fields.map(([field, label, placeholder]) => (
                    <label key={field}>
                      <span>{label}</span>
                      <input value={controller.vehicle[field]} placeholder={placeholder} onChange={(event) => controller.updateField(field, event.target.value)} />
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <div className="import-vehicle-feature-fields">
              {FEATURE_GROUPS.map(([field, label]) => (
                <FeatureListField
                  key={field}
                  field={field}
                  label={label}
                  value={controller.vehicle[field]}
                  onChange={(value) => controller.updateField(field, value)}
                />
              ))}
            </div>

            {controller.warning && <p className="import-vehicle-warning" role="status">{controller.warning}</p>}
            {controller.error && <p className="import-vehicle-error" role="alert">{controller.error}</p>}

            <footer className="import-vehicle-footer">
              <button type="button" className="import-cancel-button" onClick={onClose} disabled={controller.saving}>Cancelar</button>
              <button type="submit" className="import-save-button" disabled={controller.saving}>
                <IoSaveOutline />
                <span>{controller.saving ? 'Salvando...' : 'Salvar veículo'}</span>
              </button>
            </footer>
          </form>
        )}

        {controller.step === 'choice' && controller.error && <p className="import-vehicle-error" role="alert">{controller.error}</p>}
      </div>
    </div>
  );
}