import {
  IoCarSportOutline,
  IoCheckbox,
  IoOpenOutline,
  IoSquareOutline,
} from 'react-icons/io5';

export default function MarkdownRenderer({ content, onToggleChecklist, onNavigateCar, onImageClick }) {
  if (!content || !content.trim()) {
    return (
      <div className="markdown-empty-state">
        <p>Nenhum conteúdo para visualizar.</p>
        <small>Use a aba de edição e as ferramentas da barra para formatar seu texto.</small>
      </div>
    );
  }

  // Helper para renderizar texto inline com bold, italic, underline e links
  const renderInlineText = (text) => {
    if (!text) return null;

    // Detecta se é link de veículo [Nome](/information/ID)
    const carLinkMatch = text.match(/\[(.*?)\]\(\/information\/(.*?)\)/);
    if (carLinkMatch) {
      const [full, carName, carId] = carLinkMatch;
      const parts = text.split(full);
      return (
        <>
          {renderInlineText(parts[0])}
          <button
            type="button"
            className="md-car-inline-link"
            onClick={() => onNavigateCar?.(carId)}
            title="Ver ficha técnica do veículo"
          >
            <IoCarSportOutline />
            <span>{carName}</span>
            <IoOpenOutline />
          </button>
          {renderInlineText(parts[1])}
        </>
      );
    }

    // Detecta se é imagem inline ![alt](url)
    const inlineImageMatch = text.match(/!\[([^\]]*)\]\((.+?)\)/);
    if (inlineImageMatch) {
      const [full, alt, src] = inlineImageMatch;
      const parts = text.split(full);
      return (
        <>
          {renderInlineText(parts[0])}
          <span
            className="md-image-container md-image-clickable"
            onClick={(e) => {
              e.stopPropagation();
              onImageClick?.({ url: src, name: alt || 'Imagem' });
            }}
            title="Clique para expandir"
          >
            <img src={src} alt={alt || 'Imagem da anotação'} loading="lazy" />
            {alt && alt !== 'Imagem' && alt !== 'Foto' && <span className="md-image-caption">{alt}</span>}
          </span>
          {renderInlineText(parts[1])}
        </>
      );
    }

    // Regras simples de parse inline: Bold (**text**), Italic (*text*), Underline (<u>text</u>)
    let elements = [text];

    // Bold **text**
    elements = elements.flatMap((segment) => {
      if (typeof segment !== 'string') return segment;
      const parts = segment.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    });

    // Italic *text*
    elements = elements.flatMap((segment) => {
      if (typeof segment !== 'string') return segment;
      const parts = segment.split(/(\*.*?\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
          return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
    });

    // Underline <u>text</u>
    elements = elements.flatMap((segment) => {
      if (typeof segment !== 'string') return segment;
      const parts = segment.split(/(<u>.*?<\/u>)/gi);
      return parts.map((part, idx) => {
        if (part.toLowerCase().startsWith('<u>') && part.toLowerCase().endsWith('</u>')) {
          return <u key={idx}>{part.slice(3, -4)}</u>;
        }
        return part;
      });
    });

    return elements;
  };

  // Divide o conteúdo em blocos (inclusive blocos de veículos :::car[...] { ... })
  const blocks = [];
  const rawContent = content || '';
  const carBlockRegex = /:::car\[(.*?)\]\{\s*([\s\S]*?)\s*\}/g;

  let lastIndex = 0;
  let match;

  while ((match = carBlockRegex.exec(rawContent)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'markdown',
        text: rawContent.substring(lastIndex, match.index),
      });
    }

    const carName = match[1];
    const propsRaw = match[2];
    const carData = { name: carName };

    propsRaw.split('\n').forEach((line) => {
      const kv = line.match(/^\s*([a-zA-Z0-9_-]+)\s*:\s*["']?(.*?)["']?,?\s*$/);
      if (kv) {
        carData[kv[1]] = kv[2];
      }
    });

    blocks.push({
      type: 'carCard',
      car: carData,
    });

    lastIndex = carBlockRegex.lastIndex;
  }

  if (lastIndex < rawContent.length) {
    blocks.push({
      type: 'markdown',
      text: rawContent.substring(lastIndex),
    });
  }

  return (
    <div className="markdown-rendered-view">
      {blocks.map((block, blockIdx) => {
        if (block.type === 'carCard') {
          const car = block.car;
          return (
            <div
              key={blockIdx}
              className="md-vehicle-card"
              onClick={() => car.id && onNavigateCar?.(car.id)}
            >
              <div className="md-vehicle-card-image">
                {car.image ? (
                  <img src={car.image} alt={car.name} />
                ) : (
                  <IoCarSportOutline />
                )}
              </div>
              <div className="md-vehicle-card-info">
                <span className="md-vehicle-card-brand">{car.brand || 'FORD'}</span>
                <h4>{car.name}</h4>
                <div className="md-vehicle-card-specs">
                  {car.engine && <span>{car.engine}</span>}
                  {car.power && <span>{car.power}</span>}
                  {car.type && <span>{car.type}</span>}
                </div>
              </div>
              <button
                type="button"
                className="md-vehicle-card-action"
                onClick={(e) => {
                  e.stopPropagation();
                  if (car.id) onNavigateCar?.(car.id);
                }}
                title="Ver veículo"
              >
                <span>Ver ficha</span>
                <IoOpenOutline />
              </button>
            </div>
          );
        }

        const lines = block.text.split('\n');

        return lines.map((line, lineIndex) => {
          const trimmed = line.trim();
          const uniqueKey = `${blockIdx}-${lineIndex}`;

          // Linha vazia
          if (!trimmed) {
            return <div key={uniqueKey} className="md-spacer" />;
          }

          // Título H1 (# )
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={uniqueKey} className="md-h1">
                {renderInlineText(trimmed.slice(2))}
              </h1>
            );
          }

          // Título H2 (## )
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={uniqueKey} className="md-h2">
                {renderInlineText(trimmed.slice(3))}
              </h2>
            );
          }

          // Título H3 (### )
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={uniqueKey} className="md-h3">
                {renderInlineText(trimmed.slice(4))}
              </h3>
            );
          }

          // Checklist: - [ ] ou - [x]
          const checklistMatch = trimmed.match(/^-\s*\[([ xX])\]\s*(.*)$/);
          if (checklistMatch) {
            const isChecked = checklistMatch[1].toLowerCase() === 'x';
            const itemText = checklistMatch[2];

            return (
              <div
                key={uniqueKey}
                className={`md-checklist-item ${isChecked ? 'is-checked' : ''}`}
                onClick={() => onToggleChecklist?.(lineIndex, !isChecked)}
                role="button"
                tabIndex={0}
              >
                <span className="md-checklist-box">
                  {isChecked ? <IoCheckbox /> : <IoSquareOutline />}
                </span>
                <span className="md-checklist-text">
                  {renderInlineText(itemText)}
                </span>
              </div>
            );
          }

          // Lista simples (- ou *)
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={uniqueKey} className="md-bullet-item">
                <span className="md-bullet-dot" />
                <span>{renderInlineText(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Lista numerada (1. 2. etc)
          const numberMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
          if (numberMatch) {
            return (
              <div key={uniqueKey} className="md-number-item">
                <span className="md-number-prefix">{numberMatch[1]}.</span>
                <span>{renderInlineText(numberMatch[2])}</span>
              </div>
            );
          }

          // Imagem ![alt](url)
          const imageMatch = trimmed.match(/^!\[([^\]]*)\]\((.+)\)$/);
          if (imageMatch) {
            const [, alt, src] = imageMatch;
            return (
              <div
                key={uniqueKey}
                className="md-image-container md-image-clickable"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick?.({ url: src, name: alt || 'Imagem' });
                }}
                title="Clique para expandir"
              >
                <img src={src} alt={alt || 'Imagem da anotação'} loading="lazy" />
                {alt && alt !== 'Imagem' && alt !== 'Foto' && <span className="md-image-caption">{alt}</span>}
              </div>
            );
          }

          // Blockquote (> )
          if (trimmed.startsWith('> ')) {
            const quoteText = trimmed.slice(2);
            return (
              <blockquote key={uniqueKey} className="md-blockquote">
                {renderInlineText(quoteText)}
              </blockquote>
            );
          }

          // Parágrafo padrão
          return (
            <p key={uniqueKey} className="md-paragraph">
              {renderInlineText(line)}
            </p>
          );
        });
      })}
    </div>
  );
}
