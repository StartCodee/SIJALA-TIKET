import { QrCode, Fish } from 'lucide-react';

export function TicketPreview({
  design,
  scale = 1,
  onElementSelect,
  selectedElementId,
}) {
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
    };

    const isSelected = selectedElementId === element.id;
    const selectedStyle = isSelected ? {
      outline: '2px solid hsl(var(--primary))',
      outlineOffset: '2px',
    } : {};

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
              color: element.color || '#ffffff',
              textAlign: element.align || 'left',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1.2,
            }}
            onClick={() => onElementSelect?.(element)}
          >
            {element.content}
          </div>
        );

      case 'logo':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              ...selectedStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--ocean-mid)) 100%)',
              borderRadius: '12px',
            }}
            onClick={() => onElementSelect?.(element)}
          >
            <Fish
              size={30 * scale}
              className="text-primary-foreground"
            />
          </div>
        );

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
              borderRadius: 8 * scale,
              padding: 8 * scale,
            }}
            onClick={() => onElementSelect?.(element)}
          >
            <QrCode
              size={Math.min(element.width, element.height) * scale * 0.8}
              className="text-gray-900"
            />
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
              backgroundColor: `${element.color}20` || 'rgba(20, 184, 166, 0.2)',
              border: `1px solid ${element.color || '#14b8a6'}`,
              borderRadius: 6 * scale,
              fontSize: (element.fontSize || 10) * scale,
              fontWeight: element.fontWeight || 'semibold',
              color: element.color || '#14b8a6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            onClick={() => onElementSelect?.(element)}
          >
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
              backgroundColor: element.color || '#14b8a6',
              opacity: element.opacity ?? 0.3,
            }}
            onClick={() => onElementSelect?.(element)}
          />
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
        return {
          backgroundColor: '#0d4f4f',
          backgroundImage: background.value,
        };
      default:
        return { backgroundColor: '#0d4f4f' };
    }
  };

  return (
    <div
      className="ticket-preview relative overflow-hidden transition-all duration-300"
      style={{
        width: design.width * scale,
        height: design.height * scale,
        borderRadius: design.borderRadius * scale,
        border: design.borderWidth
          ? `${design.borderWidth * scale}px solid ${design.borderColor || '#14b8a6'}`
          : undefined,
        ...getBackgroundStyle(),
        opacity: design.background.opacity,
      }}
    >
      {/* Background overlay for images */}
      {design.background.overlay && (
        <div
          className="absolute inset-0"
          style={{ background: design.background.overlay }}
        />
      )}

      {/* Elements */}
      {design.elements.map(renderElement)}

      {/* Decorative wave pattern */}
      <svg
        className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none"
        style={{ height: 60 * scale }}
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 V60 H0 Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
