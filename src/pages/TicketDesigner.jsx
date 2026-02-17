import { useState, useRef, useMemo } from 'react';
import { defaultTicketDesign } from '@/types/ticket';

import { TicketPreview } from '@/components/ticket-designer/TicketPreview';
import { BackgroundPanel } from '@/components/ticket-designer/BackgroundPanel';
import { ElementsPanel } from '@/components/ticket-designer/ElementsPanel';
import { TemplatesPanel } from '@/components/ticket-designer/TemplatesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Paintbrush, Layers, Palette, Printer, Save, RotateCcw,
  ZoomIn, ZoomOut, Download, Eye, ArrowLeft, Fish, Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function TicketDesigner() {
  const [design, setDesign] = useState(defaultTicketDesign);
  const [selectedElementId, setSelectedElementId] = useState(undefined);
  const [editingElementId, setEditingElementId] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [previewScale, setPreviewScale] = useState(1.1);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef(null);

  const selectedElement = useMemo(
    () => design.elements.find((el) => el.id === selectedElementId),
    [design.elements, selectedElementId]
  );

  const handleDesignChange = (updates) => {
    setDesign((prev) => ({ ...prev, ...updates, updatedAt: new Date() }));
  };

  const handleElementUpdate = (updatedElement) => {
    setDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
      updatedAt: new Date(),
    }));
  };

  const handleToggleVisibility = (elementId) => {
    setDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => el.id === elementId ? { ...el, visible: !el.visible } : el),
      updatedAt: new Date(),
    }));
  };

  const handleDeleteElement = (elementId) => {
    setDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => el.id === elementId ? { ...el, visible: false } : el),
      updatedAt: new Date(),
    }));
    if (selectedElementId === elementId) setSelectedElementId(undefined);
    if (editingElementId === elementId) { setEditingElementId(null); setDraftText(''); }
    toast.info('Bagian disembunyikan (bisa ditampilkan lagi dari daftar elemen).');
  };

  const startInlineEdit = (el) => {
    setSelectedElementId(el.id);
    setEditingElementId(el.id);
    setDraftText(el.content ?? '');
  };

  const commitInlineEdit = () => {
    if (!editingElementId) return;
    const el = design.elements.find((x) => x.id === editingElementId);
    if (!el) return;
    handleElementUpdate({ ...el, content: draftText });
    setEditingElementId(null);
  };

  const cancelInlineEdit = () => { setEditingElementId(null); setDraftText(''); };

  const handleTemplateSelect = (template) => {
    setDesign((prev) => ({
      ...prev,
      id: template.id || prev.id,
      ...(template.borderColor ? { borderColor: template.borderColor } : {}),
      elements: prev.elements.map((el) => {
        if (template.accent && (el.id === 'accentBarRight' || el.id === 'leftAccentStrip')) {
          return { ...el, color: template.accent };
        }
        return el;
      }),
      updatedAt: new Date(),
    }));
    toast.success('Template berhasil diterapkan!');
  };

  const handleReset = () => {
    setDesign(defaultTicketDesign);
    setSelectedElementId(undefined);
    setEditingElementId(null);
    setDraftText('');
    toast.info('Design dikembalikan ke default');
  };

  const handleSave = () => {
    localStorage.setItem('ticketDesign', JSON.stringify(design));
    toast.success('Design tiket berhasil disimpan!');
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => { window.print(); setShowPrintPreview(false); }, 100);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(design, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-design-${design.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Design berhasil di-export!');
  };

  const zoomIn = () => setPreviewScale((prev) => Math.min(prev + 0.1, 1.8));
  const zoomOut = () => setPreviewScale((prev) => Math.max(prev - 0.1, 0.6));

  return (
    <div className="min-h-screen bg-background">
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center print:block" style={{ backgroundColor: 'white' }}>
          <div ref={printRef}><TicketPreview design={design} scale={1.35} /></div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm hidden sm:inline">Kembali</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Fish size={16} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-tight">Ticket Designer</h1>
                <p className="text-[11px] text-muted-foreground hidden sm:block">Double-click teks untuk edit langsung</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={handleReset} className="btn-designer-ghost"><RotateCcw size={15} /></button>
            <button onClick={handleExport} className="btn-designer-ghost"><Download size={15} /></button>
            <button onClick={handlePrint} className="btn-designer-ghost"><Printer size={15} /></button>
            <button onClick={handleSave} className="btn-designer-primary text-xs">
              <Save size={14} /> <span className="hidden sm:inline">Simpan</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
        {/* Preview Area */}
        <div className="flex-1 p-4 lg:p-8 flex flex-col items-center justify-center bg-muted/40">
          <div className="flex items-center gap-1.5 mb-5">
            <button onClick={zoomOut} className="btn-designer-ghost" disabled={previewScale <= 0.6}>
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center font-medium">
              {Math.round(previewScale * 100)}%
            </span>
            <button onClick={zoomIn} className="btn-designer-ghost" disabled={previewScale >= 1.8}>
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="animate-scale-in">
            <TicketPreview
              design={design}
              scale={previewScale}
              selectedElementId={selectedElementId}
              onElementSelect={(el) => setSelectedElementId(el ? el.id : undefined)}

              onElementDoubleClick={(el) => {
                if (el.type === 'text' || el.type === 'badge') startInlineEdit(el);
              }}
              onDeleteElement={handleDeleteElement}
              editingElementId={editingElementId}
              draftText={draftText}
              onDraftTextChange={setDraftText}
              onCommitText={commitInlineEdit}
              onCancelText={cancelInlineEdit}
            />
          </div>

          <div className="mt-5 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Eye size={12} /> {design.width} × {design.height} px</span>
            <span className="flex items-center gap-1"><Layers size={12} /> {design.elements.filter((el) => el.visible).length} elemen</span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-[380px] xl:w-[400px] border-l border-border bg-card overflow-y-auto">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0 h-auto">
              {[
                { value: 'templates', icon: Palette, label: 'Template' },
                { value: 'background', icon: Paintbrush, label: 'Style' },
                { value: 'elements', icon: Settings, label: 'Elemen' },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-2.5 text-xs font-medium"
                >
                  <Icon size={14} className="mr-1.5" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-4">
              <TabsContent value="templates" className="mt-0 animate-fade-in">
                <TemplatesPanel currentDesignId={design.id} onSelectTemplate={handleTemplateSelect} />
              </TabsContent>
              <TabsContent value="background" className="mt-0 animate-fade-in">
                <BackgroundPanel design={design} onChange={handleDesignChange} />
              </TabsContent>
              <TabsContent value="elements" className="mt-0 animate-fade-in">
                <ElementsPanel
                  elements={design.elements}
                  selectedElementId={selectedElementId}
                  onSelectElement={(el) => setSelectedElementId(el.id)}
                  onUpdateElement={handleElementUpdate}
                  onToggleVisibility={handleToggleVisibility}
                  onDeleteElement={handleDeleteElement}
                  onRequestInlineEdit={() => {
                    if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'badge')) {
                      startInlineEdit(selectedElement);
                    }
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
