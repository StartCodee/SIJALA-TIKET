import { QrCode, Fish, X } from 'lucide-react';
import { useEffect } from 'react';

const looksLikeImageSrc = (value) => {
  if (!value) return false;
  return (
    value.startsWith('data:image') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/') ||
    value.startsWith('./')
  );
};

export function TicketPreview({
  design,
  scale = 1,
  onElementSelect,
  onElementDoubleClick,
  selectedElementId,
  editingElementId,
  draftText,
  onDraftTextChange,
  onCommitText,
  onCancelText,
  onDeleteElement,
}) {

    useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;

      e.preventDefault();

      // ESC PERTAMA → keluar dari edit (textarea)
      if (editingElementId) {
        onCancelText?.();
        return;
      }

      // ESC KEDUA → keluar dari select (border + X hilang)
      if (selectedElementId) {
        onElementSelect?.(null);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingElementId, selectedElementId, onCancelText, onElementSelect]);


  const renderDeleteButton = (element, isSelected) => {
    if (!isSelected || !onDeleteElement) return null;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteElement(element.id);
        }}
        title="Sembunyikan"
        className="absolute grid place-items-center rounded-full bg-foreground/90 text-background"
        style={{
          top: -8 * scale,
          right: -8 * scale,
          width: 20 * scale,
          height: 20 * scale,
          zIndex: 2147483647, // PALING ATAS
          pointerEvents: 'auto',
        }}
      >
        <X size={12 * scale} />
      </button>
    );
  };


  const renderElement = (element) => {
    if (!element.visible) return null;

    const baseStyle = {
      position: 'absolute',
      left: element.x * scale,
      top: element.y * scale,
      width: element.width * scale,
      height: element.height * scale,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      opacity: element.opacity ?? 1,
      cursor: onElementSelect ? 'pointer' : 'default',
      zIndex: element.zIndex ?? 10,
    };

    const isSelected = selectedElementId === element.id;
    const isEditing = editingElementId === element.id;

    const selectedStyle = isSelected
      ? { outline: `2px solid hsl(199, 89%, 48%)`, outlineOffset: '2px', borderRadius: 2 }
      : {};

    if ((element.type === 'text' || element.type === 'badge') && isEditing) {
      return (
        <textarea
          key={element.id}
          autoFocus
          value={draftText}
          onChange={(e) => onDraftTextChange?.(e.target.value)}
          onBlur={() => onCommitText?.()}
          onKeyDown={(e) => {
            console.log(e.key);
            if (e.key === 'Escape') { e.preventDefault(); onCancelText?.(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); onCommitText?.(); }
          }}
          style={{
            ...baseStyle,
            fontSize: (element.fontSize || 14) * scale,
            fontWeight: element.fontWeight || 'normal',
            color: element.color || '#111827',
            textAlign: element.align || 'left',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: element.lineHeight ?? 1.2,
            letterSpacing: typeof element.letterSpacing === 'number' ? `${element.letterSpacing}em` : undefined,
            textShadow: element.textShadow,
            resize: 'none',
            padding: 0,
            margin: 0,
            border: 'none',
            outline: `2px dashed hsl(199, 89%, 48%)`,
            outlineOffset: '2px',
            background: 'transparent',
            zIndex: 9998,
            caretColor: element.color || '#111827',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              fontSize: (element.fontSize || 14) * scale,
              fontWeight: element.fontWeight || 'normal',
              color: element.color || '#111827',
              textAlign: element.align || 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: element.lineHeight ?? 1.2,
              letterSpacing: typeof element.letterSpacing === 'number' ? `${element.letterSpacing}em` : undefined,
              textShadow: element.textShadow,
            }}
            onClick={() => onElementSelect?.(element)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementDoubleClick?.(element);
            }}
          >
            {renderDeleteButton(element, isSelected)}
            {element.content}
          </div>
        );

      case 'image':
      case 'logo': {
        const isLogo = element.type === 'logo';
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              overflow: 'hidden',
              borderRadius: (element.borderRadius ?? 0) * scale,
              display: isLogo ? 'flex' : undefined,
              alignItems: isLogo ? 'center' : undefined,
              justifyContent: isLogo ? 'center' : undefined,
              background: isLogo ? 'rgba(255,255,255,0.35)' : undefined,
            }}
            onClick={() => onElementSelect?.(element)}
          >
            {renderDeleteButton(element, isSelected)}
            {looksLikeImageSrc(element.content) ? (
              <img
                src={element.content}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: element.imageFit || (isLogo ? 'contain' : 'cover'),
                  display: 'block',
                }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            {isLogo && !looksLikeImageSrc(element.content) && (
              <Fish size={Math.min(element.width, element.height) * scale * 0.7} />
            )}
          </div>
        );
      }

      case 'qr':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 6 * scale,
              padding: 6 * scale,
              overflow: 'hidden',
            }}
            onClick={() => onElementSelect?.(element)}
          >
            {renderDeleteButton(element, isSelected)}
            {looksLikeImageSrc(element.content) ? (
              <img
                src={element.content}
                alt="QR"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
                draggable={false}
              />
            ) : (
              <QrCode
                size={Math.min(element.width, element.height) * scale * 0.8}
                className="text-foreground"
              />
            )}
          </div>
        );

      case 'badge':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${element.color || '#ea580c'}20`,
              border: `1px solid ${element.color || '#ea580c'}`,
              borderRadius: 6 * scale,
              fontSize: (element.fontSize || 10) * scale,
              fontWeight: element.fontWeight || 'semibold',
              color: element.color || '#ea580c',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            onClick={() => onElementSelect?.(element)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onElementDoubleClick?.(element);
            }}
          >
            {renderDeleteButton(element, isSelected)}
            {element.content}
          </div>
        );

      case 'divider':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              background: element.color || 'rgba(0,0,0,0.1)',
              opacity: element.opacity ?? 1,
            }}
            onClick={() => onElementSelect?.(element)}
          >
            {renderDeleteButton(element, isSelected)}
          </div>
        );

      default:
        return null;
    }
  };

  const getBackgroundStyle = () => {
    const { background } = design;
    switch (background.type) {
      case 'solid':
        return { backgroundColor: background.value };
      case 'gradient':
        return { background: background.value };
      case 'image':
        return {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'pattern':
        return { backgroundColor: '#ffffff', backgroundImage: background.value };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  const isGradientBorder =
    typeof design.borderColor === 'string' &&
    (design.borderColor.includes('linear-gradient') ||
      design.borderColor.includes('radial-gradient') ||
      design.borderColor.includes('conic-gradient'));

  const borderWidth = (design.borderWidth || 0) * scale;
  const borderStyle = design.borderWidth
    ? isGradientBorder
      ? {
          border: `${borderWidth}px solid transparent`,
          borderImageSource: design.borderColor,
          borderImageSlice: 1,
        }
      : {
          border: `${borderWidth}px solid ${design.borderColor || '#e2e8f0'}`,
        }
    : {};

  return (
    <div
      className="ticket-preview-wrapper inline-block"
      onClick={() => onElementSelect?.(null)}
    >
      <div
        className="ticket-preview relative overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: design.width * scale,
          height: design.height * scale,
          borderRadius: design.borderRadius * scale,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          ...borderStyle,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            ...getBackgroundStyle(),
            opacity: design.background.opacity ?? 1,
            zIndex: 0,
          }}
        />
        {design.background.overlay && (
          <div
            className="absolute inset-0"
            style={{
              background: design.background.overlay,
              zIndex: 1,
            }}
          />
        )}
        {design.elements.map(renderElement)}
      </div>
    </div>
  );
}
