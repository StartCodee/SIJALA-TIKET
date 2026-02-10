import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Sunset,
  Waves,
  Anchor,
  Palette,
  Mountain,
  Fish,
  TreePalm,
} from 'lucide-react';

const templates = [
  {
    id: 'raja-ampat-orange',
    name: 'Raja Ampat (Orange)',
    icon: Sunset,
    preview: {
      background: 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)',
    },
    borderColor: 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)',
    accent: 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)',
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    icon: Waves,
    preview: {
      background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)',
    },
    borderColor: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)',
    accent: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)',
  },
  {
    id: 'deep-sea-blue',
    name: 'Deep Sea Blue',
    icon: Anchor,
    preview: {
      background: 'linear-gradient(90deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)',
    },
    borderColor: 'linear-gradient(90deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)',
    accent: 'linear-gradient(90deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)',
  },
  {
    id: 'tropical-green',
    name: 'Tropical Green',
    icon: TreePalm,
    preview: {
      background: 'linear-gradient(90deg, #15803d 0%, #22c55e 60%, #86efac 100%)',
    },
    borderColor: 'linear-gradient(90deg, #15803d 0%, #22c55e 60%, #86efac 100%)',
    accent: 'linear-gradient(90deg, #15803d 0%, #22c55e 60%, #86efac 100%)',
  },
  {
    id: 'sunrise-pink',
    name: 'Sunrise Pink',
    icon: Fish,
    preview: {
      background: 'linear-gradient(90deg, #be185d 0%, #ec4899 55%, #f9a8d4 100%)',
    },
    borderColor: 'linear-gradient(90deg, #be185d 0%, #ec4899 55%, #f9a8d4 100%)',
    accent: 'linear-gradient(90deg, #be185d 0%, #ec4899 55%, #f9a8d4 100%)',
  },
  {
    id: 'mountain-slate',
    name: 'Mountain Slate',
    icon: Mountain,
    preview: {
      background: 'linear-gradient(90deg, #334155 0%, #475569 60%, #94a3b8 100%)',
    },
    borderColor: 'linear-gradient(90deg, #334155 0%, #475569 60%, #94a3b8 100%)',
    accent: 'linear-gradient(90deg, #334155 0%, #475569 60%, #94a3b8 100%)',
  },
];

export function TemplatesPanel({ currentDesignId, onSelectTemplate }) {
  const [mode, setMode] = useState('solid'); // solid | gradient
  const [solidColor, setSolidColor] = useState('#0ea5e9');
  const [gradFrom, setGradFrom] = useState('#0ea5e9');
  const [gradTo, setGradTo] = useState('#22d3ee');

  const gradientValue = `linear-gradient(90deg, ${gradFrom} 0%, ${gradTo} 100%)`;

  const handleApplyCustom = () => {
    const value = mode === 'solid' ? solidColor : gradientValue;

    onSelectTemplate({
      id: 'custom',
      borderColor: value,
      accent: value,
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">Template Aksen</Label>

      <div className="grid grid-cols-1 gap-2.5">
        {templates.map((t) => {
          const Icon = t.icon;
          const isActive = currentDesignId === t.id;

          return (
            <button
              key={t.id}
              onClick={() =>
                onSelectTemplate({
                  id: t.id,
                  borderColor: t.borderColor,
                  accent: t.accent,
                })
              }
              className={`template-card group flex items-center gap-3 p-3 ${
                isActive ? 'template-card-active' : ''
              }`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ background: t.preview.background }}
              >
                <Icon size={22} className="text-primary-foreground opacity-90" />
              </div>

              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🎨 CUSTOM COLOR */}
      <div className="pt-3 border-t border-border space-y-3">
        <Label className="text-xs text-muted-foreground">
          Warna Kustom
        </Label>

        {/* MODE TOGGLE */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('solid')}
            className={`flex-1 text-xs py-1.5 rounded ${
              mode === 'solid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => setMode('gradient')}
            className={`flex-1 text-xs py-1.5 rounded ${
              mode === 'gradient'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            Gradient
          </button>
        </div>

        {/* PICKER */}
        {mode === 'solid' ? (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <div
              className="flex-1 h-10 rounded border"
              style={{ background: solidColor }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={gradFrom}
              onChange={(e) => setGradFrom(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="color"
              value={gradTo}
              onChange={(e) => setGradTo(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <div
              className="flex-1 h-10 rounded border"
              style={{ background: gradientValue }}
            />
          </div>
        )}

        <button
          onClick={handleApplyCustom}
          className="w-full btn-designer-secondary text-xs justify-center"
        >
          <Palette size={14} />
          Pakai Warna Kustom
        </button>
      </div>
    </div>
  );
}
