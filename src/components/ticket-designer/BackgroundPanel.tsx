import { TicketBackground } from '@/types/ticket';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Image, Palette, Grid3X3 } from 'lucide-react';

interface BackgroundPanelProps {
  background: TicketBackground;
  onChange: (background: TicketBackground) => void;
}

const solidColors = [
  { name: 'Ocean Deep', value: '#0d4f4f' },
  { name: 'Navy', value: '#0f172a' },
  { name: 'Forest', value: '#14532d' },
  { name: 'Midnight', value: '#1e1b4b' },
  { name: 'Charcoal', value: '#1f2937' },
  { name: 'Slate', value: '#334155' },
];

const gradients = [
  { 
    name: 'Ocean', 
    value: 'linear-gradient(135deg, #0d4f4f 0%, #1a7a7a 50%, #0d9488 100%)' 
  },
  { 
    name: 'Sunset Coral', 
    value: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)' 
  },
  { 
    name: 'Deep Sea', 
    value: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)' 
  },
  { 
    name: 'Forest', 
    value: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)' 
  },
  { 
    name: 'Twilight', 
    value: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)' 
  },
  { 
    name: 'Aurora', 
    value: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)' 
  },
];

const patterns = [
  {
    name: 'Waves',
    value: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%2314b8a6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    name: 'Dots',
    value: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2314b8a6' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    name: 'Triangles',
    value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.1'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
];

export function BackgroundPanel({ background, onChange }: BackgroundPanelProps) {
  const backgroundTypes = [
    { type: 'solid' as const, icon: Paintbrush, label: 'Solid' },
    { type: 'gradient' as const, icon: Palette, label: 'Gradient' },
    { type: 'pattern' as const, icon: Grid3X3, label: 'Pattern' },
    { type: 'image' as const, icon: Image, label: 'Image' },
  ];

  return (
    <div className="space-y-6">
      {/* Background Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Tipe Background</Label>
        <div className="grid grid-cols-4 gap-2">
          {backgroundTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onChange({ ...background, type })}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                background.type === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Colors */}
      {background.type === 'solid' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Pilih Warna</Label>
          <div className="grid grid-cols-6 gap-2">
            {solidColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ ...background, value: color.value })}
                className={`color-swatch ${
                  background.value === color.value ? 'color-swatch-active' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Custom:</Label>
            <input
              type="color"
              value={background.value.startsWith('#') ? background.value : '#0d4f4f'}
              onChange={(e) => onChange({ ...background, value: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer border-0"
            />
          </div>
        </div>
      )}

      {/* Gradients */}
      {background.type === 'gradient' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Pilih Gradient</Label>
          <div className="grid grid-cols-3 gap-2">
            {gradients.map((gradient) => (
              <button
                key={gradient.name}
                onClick={() => onChange({ ...background, value: gradient.value })}
                className={`h-12 rounded-lg transition-all ${
                  background.value === gradient.value
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:scale-105'
                }`}
                style={{ background: gradient.value }}
                title={gradient.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {background.type === 'pattern' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Pilih Pattern</Label>
          <div className="grid grid-cols-3 gap-2">
            {patterns.map((pattern) => (
              <button
                key={pattern.name}
                onClick={() => onChange({ ...background, value: pattern.value })}
                className={`h-12 rounded-lg bg-ocean-deep transition-all ${
                  background.value === pattern.value
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundImage: pattern.value }}
                title={pattern.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image URL */}
      {background.type === 'image' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">URL Gambar</Label>
          <input
            type="text"
            value={background.value}
            onChange={(e) => onChange({ ...background, value: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="input-designer"
          />
          <p className="text-xs text-muted-foreground">
            Masukkan URL gambar untuk background tiket
          </p>
        </div>
      )}

      {/* Opacity Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Opacity</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(background.opacity * 100)}%
          </span>
        </div>
        <Slider
          value={[background.opacity * 100]}
          onValueChange={([value]) => onChange({ ...background, opacity: value / 100 })}
          min={20}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  );
}
