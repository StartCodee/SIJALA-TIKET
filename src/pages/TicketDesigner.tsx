import { useState, useRef } from 'react';
import { TicketDesign, TicketElement, defaultTicketDesign } from '@/types/ticket';
import { TicketPreview } from '@/components/ticket-designer/TicketPreview';
import { BackgroundPanel } from '@/components/ticket-designer/BackgroundPanel';
import { ElementsPanel } from '@/components/ticket-designer/ElementsPanel';
import { TemplatesPanel } from '@/components/ticket-designer/TemplatesPanel';
import { LayoutPanel } from '@/components/ticket-designer/LayoutPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paintbrush, 
  Layers, 
  Layout, 
  Palette,
  Printer,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  ArrowLeft,
  Fish,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function TicketDesigner() {
  const [design, setDesign] = useState<TicketDesign>(defaultTicketDesign);
  const [selectedElementId, setSelectedElementId] = useState<string | undefined>();
  const [previewScale, setPreviewScale] = useState(1.5);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDesignChange = (updates: Partial<TicketDesign>) => {
    setDesign(prev => ({ ...prev, ...updates, updatedAt: new Date() }));
  };

  const handleElementUpdate = (updatedElement: TicketElement) => {
    setDesign(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      ),
      updatedAt: new Date(),
    }));
  };

  const handleToggleVisibility = (elementId: string) => {
    setDesign(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, visible: !el.visible } : el
      ),
    }));
  };

  const handleTemplateSelect = (templateDesign: Partial<TicketDesign>) => {
    setDesign(prev => ({ 
      ...prev, 
      ...templateDesign,
      elements: prev.elements.map(el => {
        if (templateDesign.borderColor && (el.type === 'badge' || el.id === 'ticketId')) {
          return { ...el, color: templateDesign.borderColor };
        }
        if (templateDesign.borderColor && el.type === 'divider') {
          return { ...el, color: templateDesign.borderColor };
        }
        return el;
      }),
      updatedAt: new Date() 
    }));
    toast.success('Template berhasil diterapkan!');
  };

  const handleReset = () => {
    setDesign(defaultTicketDesign);
    setSelectedElementId(undefined);
    toast.info('Design dikembalikan ke default');
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('ticketDesign', JSON.stringify(design));
    toast.success('Design tiket berhasil disimpan!');
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setShowPrintPreview(false);
    }, 100);
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

  const zoomIn = () => setPreviewScale(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setPreviewScale(prev => Math.max(prev - 0.25, 0.75));

  return (
    <div className="min-h-screen bg-background">
      {/* Print Preview (Hidden until print) */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center print:block">
          <div ref={printRef}>
            <TicketPreview design={design} scale={2} />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Kembali</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-ocean flex items-center justify-center">
                <Fish size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Ticket Designer</h1>
                <p className="text-xs text-muted-foreground">Kustomisasi design tiket Anda</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn-designer-secondary flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleExport}
              className="btn-designer-secondary flex items-center gap-2"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-designer-secondary flex items-center gap-2"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-designer-primary flex items-center gap-2"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Simpan</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Preview Area */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center bg-muted/30">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={zoomOut}
              className="p-2 rounded-lg bg-gray hover:bg-gray/80 transition-colors"
              disabled={previewScale <= 0.75}
            >
              <ZoomOut size={18} className="text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground w-16 text-center">
              {Math.round(previewScale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 rounded-lg bg-gray hover:bg-gray/80 transition-colors"
              disabled={previewScale >= 2.5}
            >
              <ZoomIn size={18} className="text-foreground" />
            </button>
          </div>

          {/* Ticket Preview */}
          <div className="relative animate-scale-in">
            {/* Background glow effect */}
            <div 
              className="absolute -inset-4 rounded-2xl opacity-30 blur-2xl"
              style={{ background: design.background.value }}
            />
            
            <TicketPreview
              design={design}
              scale={previewScale}
              selectedElementId={selectedElementId}
              onElementSelect={(el) => setSelectedElementId(el.id)}
            />
          </div>

          {/* Quick Info */}
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {design.width} × {design.height} px
            </span>
            <span className="flex items-center gap-1">
              <Layers size={14} />
              {design.elements.filter(el => el.visible).length} elemen aktif
            </span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-[450px] border-l border-border bg-card overflow-y-auto">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="templates" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Palette size={16} className="mr-2" />
                <span className="hidden sm:inline">Template</span>
              </TabsTrigger>
              <TabsTrigger 
                value="background" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Paintbrush size={16} className="mr-2" />
                <span className="hidden sm:inline">Background</span>
              </TabsTrigger>
              <TabsTrigger 
                value="layout" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Layout size={16} className="mr-2" />
                <span className="hidden sm:inline">Layout</span>
              </TabsTrigger>
              <TabsTrigger 
                value="elements" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
              >
                <Settings size={16} className="mr-2" />
                <span className="hidden sm:inline">Elemen</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="templates" className="mt-0 animate-fade-in">
                <TemplatesPanel
                  currentDesignId={design.id}
                  onSelectTemplate={handleTemplateSelect}
                />
              </TabsContent>

              <TabsContent value="background" className="mt-0 animate-fade-in">
                <BackgroundPanel
                  background={design.background}
                  onChange={(background) => handleDesignChange({ background })}
                />
              </TabsContent>

              <TabsContent value="layout" className="mt-0 animate-fade-in">
                <LayoutPanel
                  design={design}
                  onChange={handleDesignChange}
                />
              </TabsContent>

              <TabsContent value="elements" className="mt-0 animate-fade-in">
                <ElementsPanel
                  elements={design.elements}
                  selectedElementId={selectedElementId}
                  onSelectElement={(el) => setSelectedElementId(el.id)}
                  onUpdateElement={handleElementUpdate}
                  onToggleVisibility={handleToggleVisibility}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
