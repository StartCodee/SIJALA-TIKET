import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RectangleHorizontal, Square, CreditCard, Ticket } from 'lucide-react';

const presetSizes = [
  {
    name: 'Standar',
    icon: CreditCard,
    width: 400,
    height: 220,
    description: '400 x 220 px'
  },
  {
    name: 'Lebar',
    icon: RectangleHorizontal,
    width: 450,
    height: 200,
    description: '450 x 200 px'
  },
  {
    name: 'Kotak',
    icon: Square,
    width: 300,
    height: 300,
    description: '300 x 300 px'
  },
  {
    name: 'Pass',
    icon: Ticket,
    width: 350,
    height: 500,
    description: '350 x 500 px'
  },
];

const borderColors = [
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gold', value: '#eab308' },
  { name: 'White', value: '#ffffff' },
];

export function LayoutPanel({ design, onChange }) {
  const isPresetActive = (width, height) =>
    design.width === width && design.height === height;

  return (
    <div className="space-y-6">
      {/* Preset Sizes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Ukuran Preset</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetSizes.map((preset) => {
            const Icon = preset.icon;
            const isActive = isPresetActive(preset.width, preset.height);

            return (
              <button
                key={preset.name}
                onClick={() => onChange({ width: preset.width, height: preset.height })}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{preset.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Ukuran Custom</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Lebar (px)</Label>
            <input
              type="number"
              value={design.width}
              onChange={(e) => onChange({ width: Number(e.target.value) })}
              min={200}
              max={600}
              className="input-designer text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tinggi (px)</Label>
            <input
              type="number"
              value={design.height}
              onChange={(e) => onChange({ height: Number(e.target.value) })}
              min={150}
              max={600}
              className="input-designer text-sm"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Radius Sudut</Label>
          <span className="text-sm text-muted-foreground">{design.borderRadius}px</span>
        </div>
        <Slider
          value={[design.borderRadius]}
          onValueChange={([value]) => onChange({ borderRadius: value })}
          min={0}
          max={32}
          step={2}
        />
      </div>

      {/* Border Width */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Ketebalan Border</Label>
          <span className="text-sm text-muted-foreground">{design.borderWidth || 0}px</span>
        </div>
        <Slider
          value={[design.borderWidth || 0]}
          onValueChange={([value]) => onChange({ borderWidth: value })}
          min={0}
          max={8}
          step={1}
        />
      </div>

      {/* Border Color */}
      {(design.borderWidth || 0) > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Warna Border</Label>
          <div className="grid grid-cols-8 gap-2">
            {borderColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ borderColor: color.value })}
                className={`color-swatch ${
                  design.borderColor === color.value ? 'color-swatch-active' : ''
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
              value={design.borderColor || '#14b8a6'}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
