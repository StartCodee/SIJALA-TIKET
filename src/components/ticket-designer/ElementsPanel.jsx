import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Type, Image as ImageIcon, QrCode, Circle, Minus,
  Eye, EyeOff, AlignLeft, AlignCenter, AlignRight,
  Upload, Trash2, Pencil,
} from 'lucide-react';
import { defaultTicketDesign, elementLabels } from '@/types/ticket';

const elementIcons = {
  text: Type, image: ImageIcon, qr: QrCode, logo: Circle, divider: Minus, badge: Circle,
};

const fontWeights = [
  { label: 'Normal', value: 'normal'},
  { label: 'Medium', value: 'medium'},
  { label: 'Semibold', value: 'semibold'},
  { label: 'Bold', value: 'bold'},
];


export function ElementsPanel({
  elements, selectedElementId, onSelectElement, onUpdateElement,
  onToggleVisibility, onDeleteElement, onRequestInlineEdit,
}) {
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const fileRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!selectedElement) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateElement({ ...selectedElement, content: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Elements List */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Bagian Tiket</Label>
        <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
          {elements.map((element) => {
            const Icon = elementIcons[element.type] || Circle;
            const isSelected = selectedElementId === element.id;

            return (
              <div
                key={element.id}
                className={`element-item ${isSelected ? 'element-item-selected' : ''}`}
                onClick={() => onSelectElement(element)}
              >
                <Icon size={14} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`flex-1 text-xs truncate ${!element.visible ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {elementLabels[element.id] || element.id}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleVisibility(element.id); }}
                  className="p-1 rounded transition-colors hover:bg-secondary"
                  title={element.visible ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {element.visible
                    ? <Eye size={13} className="text-muted-foreground" />
                    : <EyeOff size={13} className="text-muted-foreground" />}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Klik elemen untuk edit. Double-click teks di tiket untuk edit langsung.
        </p>
      </div>

      {/* Selected Element Editor */}
      {selectedElement && (
        <div className="space-y-4 pt-3 border-t border-border animate-fade-in">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold truncate max-w-[180px]">
              {elementLabels[selectedElement.id] || selectedElement.id}
            </Label>
            <div className="flex gap-1.5">
              {(selectedElement.type === 'text' || selectedElement.type === 'badge') && (
                <button className="btn-designer-ghost text-xs" onClick={onRequestInlineEdit} title="Edit langsung di tiket">
                  <Pencil size={13} />
                </button>
              )}
              <button className="btn-designer-ghost text-xs text-destructive hover:text-destructive" onClick={() => onDeleteElement(selectedElement.id)} title="Sembunyikan">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Text Content */}
          {(selectedElement.type === 'text' || selectedElement.type === 'badge') && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Teks</Label>
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => onUpdateElement({ ...selectedElement, content: e.target.value })}
                  className="input-designer text-xs min-h-[60px] resize-y"
                />
              </div>

              {/* Font Size */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Ukuran Font</Label>
                  <span className="text-xs text-muted-foreground">{selectedElement.fontSize || 14}px</span>
                </div>
                <Slider
                  value={[selectedElement.fontSize || 14]}
                  onValueChange={([v]) => onUpdateElement({ ...selectedElement, fontSize: v })}
                  min={6} max={48} step={1}
                />
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ketebalan</Label>
                <div className="grid grid-cols-4 gap-1">
                  {fontWeights.map((fw) => (
                    <button key={fw.value} type="button"
                      className={`text-[10px] py-1.5 rounded-md transition-all ${selectedElement.fontWeight === fw.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                      onClick={() => onUpdateElement({ ...selectedElement, fontWeight: fw.value })}
                    >
                      {fw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Perataan</Label>
                <div className="flex gap-1">
                  {[
                    { value: 'left', icon: AlignLeft },
                    { value: 'center', icon: AlignCenter },
                    { value: 'right', icon: AlignRight },
                  ].map(({ value, icon: Icon }) => (
                    <button key={value} type="button"
                      className={`p-2 rounded-md transition-all ${selectedElement.align === value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                      onClick={() => onUpdateElement({ ...selectedElement, align: value })}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Warna Teks</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={selectedElement.color || '#111827'} onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })} className="w-8 h-7 rounded cursor-pointer border-0" />
                  <input type="text" value={selectedElement.color || ''} onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })} placeholder="#111827" className="input-designer text-xs flex-1" />
                </div>
              </div>
            </div>
          )}

          {/* Image / Logo / QR */}
          {(selectedElement.type === 'image' || selectedElement.type === 'logo' || selectedElement.type === 'qr') && (
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Gambar</Label>
              <div className="flex gap-2">
                <button className="btn-designer-secondary text-xs" onClick={() => fileRef.current?.click()}>
                  <Upload size={13} /> Upload
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleFileUpload(file);
                  e.currentTarget.value = '';
                }} />
                <input type="text" value={selectedElement.content} onChange={(e) => onUpdateElement({ ...selectedElement, content: e.target.value })} placeholder="URL gambar..." className="input-designer text-xs flex-1" />
              </div>

              {selectedElement.content && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="h-20 bg-secondary flex items-center justify-center">
                    {(selectedElement.content.startsWith('data:image') || selectedElement.content.startsWith('http') || selectedElement.content.startsWith('/')) ? (
                      <img src={selectedElement.content} alt="preview" className="w-full h-full object-contain" draggable={false} />
                    ) : (
                      <span className="text-xs text-muted-foreground">Belum ada gambar</span>
                    )}
                  </div>
                </div>
              )}

              {/* Image Fit */}
              {selectedElement.type === 'image' && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Mode Gambar</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['cover', 'contain']).map((fit) => (
                      <button key={fit} type="button"
                        className={`text-xs py-1.5 rounded-md transition-all ${selectedElement.imageFit === fit ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                        onClick={() => onUpdateElement({ ...selectedElement, imageFit: fit })}
                      >
                        {fit === 'cover' ? 'Penuh' : 'Pas'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Opacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
                </div>
                <Slider
                  value={[(selectedElement.opacity ?? 1) * 100]}
                  onValueChange={([v]) => onUpdateElement({ ...selectedElement, opacity: v / 100 })}
                  min={10} max={100} step={5}
                />
              </div>
            </div>
          )}

          {/* Divider Color */}
          {selectedElement.type === 'divider' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Warna / Gradient</Label>
                <input type="text" value={selectedElement.color || ''} onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })} placeholder="#ea580c atau linear-gradient(...)" className="input-designer text-xs" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
                </div>
                <Slider
                  value={[(selectedElement.opacity ?? 1) * 100]}
                  onValueChange={([v]) => onUpdateElement({ ...selectedElement, opacity: v / 100 })}
                  min={0} max={100} step={5}
                />
              </div>
            </div>
          )}

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between pt-1">
            <Label className="text-xs text-muted-foreground">Tampilkan</Label>
            <Switch checked={selectedElement.visible} onCheckedChange={() => onToggleVisibility(selectedElement.id)} />
          </div>
        </div>
      )}
    </div>
  );
}
