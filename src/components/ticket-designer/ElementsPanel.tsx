import { TicketElement } from '@/types/ticket';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Type, 
  Image, 
  QrCode, 
  Circle,
  Minus,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical,
  LucideIcon
} from 'lucide-react';

interface ElementsPanelProps {
  elements: TicketElement[];
  selectedElementId?: string;
  onSelectElement: (element: TicketElement) => void;
  onUpdateElement: (element: TicketElement) => void;
  onToggleVisibility: (elementId: string) => void;
}

const elementIcons: Record<TicketElement['type'], LucideIcon> = {
  text: Type,
  image: Image,
  qr: QrCode,
  logo: Circle,
  divider: Minus,
  badge: Circle,
};

const fontWeights = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
];

export function ElementsPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onToggleVisibility,
}: ElementsPanelProps) {
  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <div className="space-y-6">
      {/* Elements List */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Elemen Tiket</Label>
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
          {elements.map((element) => {
            const Icon = elementIcons[element.type];
            const isSelected = selectedElementId === element.id;
            
            return (
              <div
                key={element.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                }`}
                onClick={() => onSelectElement(element)}
              >
                <GripVertical size={14} className="text-muted-foreground" />
                <Icon size={14} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`flex-1 text-sm truncate ${!element.visible ? 'text-muted-foreground line-through' : ''}`}>
                  {element.content || element.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(element.id);
                  }}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  {element.visible ? (
                    <Eye size={14} className="text-muted-foreground" />
                  ) : (
                    <EyeOff size={14} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Element Properties */}
      {selectedElement && (
        <div className="space-y-4 pt-4 border-t border-border">
          <Label className="text-sm font-medium text-foreground">
            Properti: {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
          </Label>

          {/* Content */}
          {(selectedElement.type === 'text' || selectedElement.type === 'badge') && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Teks</Label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => onUpdateElement({ ...selectedElement, content: e.target.value })}
                className="input-designer text-sm"
              />
            </div>
          )}

          {/* Position */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Posisi X</Label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => onUpdateElement({ ...selectedElement, x: Number(e.target.value) })}
                className="input-designer text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Posisi Y</Label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => onUpdateElement({ ...selectedElement, y: Number(e.target.value) })}
                className="input-designer text-sm"
              />
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Lebar</Label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => onUpdateElement({ ...selectedElement, width: Number(e.target.value) })}
                className="input-designer text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tinggi</Label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => onUpdateElement({ ...selectedElement, height: Number(e.target.value) })}
                className="input-designer text-sm"
              />
            </div>
          </div>

          {/* Font Properties */}
          {(selectedElement.type === 'text' || selectedElement.type === 'badge') && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Ukuran Font</Label>
                  <span className="text-xs text-muted-foreground">{selectedElement.fontSize || 14}px</span>
                </div>
                <Slider
                  value={[selectedElement.fontSize || 14]}
                  onValueChange={([value]) => onUpdateElement({ ...selectedElement, fontSize: value })}
                  min={8}
                  max={36}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ketebalan Font</Label>
                <div className="grid grid-cols-4 gap-1">
                  {fontWeights.map((weight) => (
                    <button
                      key={weight.value}
                      onClick={() => onUpdateElement({ ...selectedElement, fontWeight: weight.value as TicketElement['fontWeight'] })}
                      className={`px-2 py-1.5 text-xs rounded transition-all ${
                        selectedElement.fontWeight === weight.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {weight.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedElement.type === 'text' && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Perataan</Label>
                  <div className="flex gap-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                    ].map(({ value, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => onUpdateElement({ ...selectedElement, align: value as TicketElement['align'] })}
                        className={`flex-1 p-2 rounded transition-all ${
                          selectedElement.align === value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        <Icon size={16} className="mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Warna</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.color || '#ffffff'}
                    onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={selectedElement.color || '#ffffff'}
                    onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })}
                    className="input-designer text-sm flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs text-muted-foreground">Tampilkan Elemen</Label>
            <Switch
              checked={selectedElement.visible}
              onCheckedChange={() => onToggleVisibility(selectedElement.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
