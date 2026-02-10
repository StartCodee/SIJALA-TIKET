import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Image, Palette, Grid3X3, SquareDashed, Droplets, Waves } from 'lucide-react';
import { defaultTicketDesign } from '@/types/ticket';

const solidColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Blue', value: '#e2f5ff' },
  { name: 'Slate', value: '#f1f5f9' },
  { name: 'Charcoal', value: '#111827' },
];

const gradients = [
  { name: 'Orange (Ticket)', value: 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0d4f4f 0%, #1a7a7a 50%, #0d9488 100%)' },
  { name: 'Deep Sea', value: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)' },
  { name: 'Twilight', value: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)' },
];

const patterns = [
  { name: 'Waves', value: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ea580c' fill-opacity='0.10' fill-rule='evenodd'/%3E%3C/svg%3E")` },
];

const borderSolids = [
  { name: 'Neutral', value: '#e2e8f0' },
  { name: 'Slate', value: '#334155' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Orange', value: '#ea580c' },
];

const borderGradients = [
  { name: 'Orange', value: 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)' },
  { name: 'Ocean Teal', value: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)' },
  { name: 'Deep Sea Blue', value: 'linear-gradient(90deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)' },
];


export function BackgroundPanel({ design, onChange }) {
  const background = design.background;

  const backgroundTypes = [
    { type: 'solid', icon: Paintbrush, label: 'Solid' },
    { type: 'gradient', icon: Palette, label: 'Gradient' },
    { type: 'pattern', icon: Grid3X3, label: 'Pattern' },
    { type: 'image', icon: Image, label: 'Gambar' },
  ];

  const updateBackground = (nextBg) => onChange({ background: nextBg });

  const isBorderGradient = typeof design.borderColor === 'string' &&
    (design.borderColor.includes('linear-gradient') || design.borderColor.includes('radial-gradient') || design.borderColor.includes('conic-gradient'));

  return (
    <div className="space-y-6">
      {/* Border Section */}
      <div className="panel-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SquareDashed size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold">Garis / Border</Label>
          </div>
          <div
            className="w-14 h-5 rounded border border-border"
            style={{
              background: isBorderGradient ? (design.borderColor || '#e2e8f0') : undefined,
              backgroundColor: !isBorderGradient ? (design.borderColor || '#e2e8f0') : undefined,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tebal</Label>
            <Slider value={[design.borderWidth ?? 2]} onValueChange={([v]) => onChange({ borderWidth: v })} min={0} max={10} step={1} />
            <p className="text-xs text-muted-foreground text-center">{design.borderWidth ?? 2}px</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Mode</Label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-center gap-1.5 transition-all ${!isBorderGradient ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => onChange({ borderColor: '#e2e8f0', borderWidth: design.borderWidth ?? 2 })}
              >
                <Droplets size={12} /> Solid
              </button>
              <button
                type="button"
                className={`px-2 py-1.5 text-xs rounded-md flex items-center justify-center gap-1.5 transition-all ${isBorderGradient ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => onChange({ borderColor: borderGradients[0].value, borderWidth: design.borderWidth ?? 2 })}
              >
                <Waves size={12} /> Gradient
              </button>
            </div>
          </div>
        </div>

        {!isBorderGradient ? (
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {borderSolids.map((c) => (
                <button key={c.value} onClick={() => onChange({ borderColor: c.value })} type="button" title={c.name}
                  className={`color-swatch ${design.borderColor === c.value ? 'color-swatch-active' : ''}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={typeof design.borderColor === 'string' && design.borderColor.startsWith('#') ? design.borderColor : '#e2e8f0'} onChange={(e) => onChange({ borderColor: e.target.value })} className="w-8 h-7 rounded cursor-pointer border-0" />
              <input type="text" value={typeof design.borderColor === 'string' ? design.borderColor : ''} onChange={(e) => onChange({ borderColor: e.target.value })} placeholder="#e2e8f0" className="input-designer text-xs flex-1" />
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-3 gap-1.5">
              {borderGradients.map((g) => (
                <button key={g.name} onClick={() => onChange({ borderColor: g.value })} type="button" title={g.name}
                  className={`h-8 rounded-md transition-all ${design.borderColor === g.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-[1.02]'}`}
                  style={{ background: g.value }}
                />
              ))}
            </div>
            <input type="text" value={design.borderColor || ''} onChange={(e) => onChange({ borderColor: e.target.value })} placeholder="linear-gradient(...)" className="input-designer text-xs" />
          </div>
        )}
      </div>

      {/* Background Type */}
      <div className="panel-section">
        <Label className="text-sm font-semibold">Background</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {backgroundTypes.map(({ type, icon: Icon, label }) => (
            <button key={type} onClick={() => updateBackground({ ...background, type })} type="button"
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-all text-xs ${background.type === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {background.type === 'solid' && (
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {solidColors.map((color) => (
                <button key={color.value} onClick={() => updateBackground({ ...background, value: color.value })} type="button" title={color.name}
                  className={`color-swatch ${background.value === color.value ? 'color-swatch-active' : ''}`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Custom:</Label>
              <input type="color" value={background.value.startsWith('#') ? background.value : '#ffffff'} onChange={(e) => updateBackground({ ...background, value: e.target.value })} className="w-8 h-7 rounded cursor-pointer border-0" />
            </div>
          </div>
        )}

        {background.type === 'gradient' && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {gradients.map((g) => (
                <button key={g.name} onClick={() => updateBackground({ ...background, value: g.value })} type="button" title={g.name}
                  className={`h-10 rounded-lg transition-all ${background.value === g.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-[1.02]'}`}
                  style={{ background: g.value }}
                />
              ))}
            </div>
            <input type="text" value={background.value} onChange={(e) => updateBackground({ ...background, value: e.target.value })} placeholder="linear-gradient(...)" className="input-designer text-xs" />
          </div>
        )}

        {background.type === 'pattern' && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {patterns.map((p) => (
                <button key={p.name} onClick={() => updateBackground({ ...background, value: p.value })} type="button" title={p.name}
                  className={`h-10 rounded-lg transition-all ${background.value === p.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-[1.02]'}`}
                  style={{ backgroundColor: '#ffffff', backgroundImage: p.value }}
                />
              ))}
            </div>
          </div>
        )}

        {background.type === 'image' && (
          <div className="space-y-2 pt-1">
            <input type="text" value={background.value} onChange={(e) => updateBackground({ ...background, value: e.target.value })} placeholder="https://example.com/image.jpg" className="input-designer text-xs" />
            <p className="text-[11px] text-muted-foreground">URL gambar untuk background tiket.</p>
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs text-muted-foreground">Overlay (opsional)</Label>
              <input type="text" value={background.overlay || ''} onChange={(e) => updateBackground({ ...background, overlay: e.target.value })} placeholder="rgba(255,255,255,0.6)" className="input-designer text-xs" />
            </div>
          </div>
        )}
      </div>

      {/* Opacity */}
      <div className="panel-section">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Opacity Background</Label>
          <span className="text-xs text-muted-foreground font-medium">{Math.round((background.opacity ?? 1) * 100)}%</span>
        </div>
        <Slider value={[(background.opacity ?? 1) * 100]} onValueChange={([v]) => updateBackground({ ...background, opacity: v / 100 })} min={20} max={100} step={5} />
      </div>
    </div>
  );
}
