import { defaultTicketDesign } from '@/types/ticket';
import { Label } from '@/components/ui/label';
import { Fish, Waves, TreePalm, Sunset, Mountain, Anchor } from 'lucide-react';

const templates = [
  {
    id: 'ocean',
    name: 'Ocean Teal',
    icon: Waves,
    preview: {
      background: 'linear-gradient(135deg, #0d4f4f 0%, #1a7a7a 50%, #0d9488 100%)',
      accent: '#14b8a6',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #0d4f4f 0%, #1a7a7a 50%, #0d9488 100%)',
        opacity: 1,
      },
      borderColor: '#14b8a6',
    },
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    icon: Fish,
    preview: {
      background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)',
      accent: '#fb923c',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)',
        opacity: 1,
      },
      borderColor: '#fb923c',
    },
  },
  {
    id: 'deep-sea',
    name: 'Deep Sea',
    icon: Anchor,
    preview: {
      background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
      accent: '#38bdf8',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
        opacity: 1,
      },
      borderColor: '#38bdf8',
    },
  },
  {
    id: 'forest',
    name: 'Mangrove',
    icon: TreePalm,
    preview: {
      background: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)',
      accent: '#4ade80',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)',
        opacity: 1,
      },
      borderColor: '#4ade80',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: Sunset,
    preview: {
      background: 'linear-gradient(135deg, #581c87 0%, #a21caf 50%, #d946ef 100%)',
      accent: '#e879f9',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #581c87 0%, #a21caf 50%, #d946ef 100%)',
        opacity: 1,
      },
      borderColor: '#e879f9',
    },
  },
  {
    id: 'mountain',
    name: 'Highland',
    icon: Mountain,
    preview: {
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      accent: '#94a3b8',
    },
    design: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        opacity: 1,
      },
      borderColor: '#94a3b8',
    },
  },
];

export function TemplatesPanel({ currentDesignId, onSelectTemplate }) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">Template Siap Pakai</Label>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isActive = currentDesignId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate({ ...template.design, id: template.id })}
              className={`template-card group ${isActive ? 'template-card-active' : ''}`}
            >
              <div
                className="aspect-[16/9] rounded-lg flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                style={{ background: template.preview.background }}
              >
                <Icon
                  size={32}
                  color={template.preview.accent}
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="p-2 text-center">
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {template.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border">
        <button
          onClick={() => onSelectTemplate(defaultTicketDesign)}
          className="w-full btn-designer-secondary text-sm"
        >
          Reset ke Default
        </button>
      </div>
    </div>
  );
}
