export interface TicketElement {
  id: string;
  type: 'text' | 'image' | 'qr' | 'logo' | 'divider' | 'badge';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  rotation?: number;
  opacity?: number;
  visible: boolean;
}

export interface TicketBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  value: string;
  opacity: number;
  overlay?: string;
}

export interface TicketDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  background: TicketBackground;
  elements: TicketElement[];
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketTemplate {
  id: string;
  name: string;
  thumbnail: string;
  design: Omit<TicketDesign, 'id' | 'createdAt' | 'updatedAt'>;
}

export const defaultTicketDesign: TicketDesign = {
  id: 'default',
  name: 'Tiket Baru',
  width: 400,
  height: 220,
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #0d4f4f 0%, #1a7a7a 50%, #0d9488 100%)',
    opacity: 1,
  },
  borderRadius: 16,
  borderColor: '#14b8a6',
  borderWidth: 2,
  elements: [
    {
      id: 'logo',
      type: 'logo',
      content: 'KKP Raja Ampat',
      x: 20,
      y: 20,
      width: 50,
      height: 50,
      visible: true,
    },
    {
      id: 'title',
      type: 'text',
      content: 'MARINE PARK FEE',
      x: 80,
      y: 25,
      width: 200,
      height: 30,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
      align: 'left',
      visible: true,
    },
    {
      id: 'subtitle',
      type: 'text',
      content: 'Tiket Masuk Kawasan Konservasi',
      x: 80,
      y: 48,
      width: 200,
      height: 20,
      fontSize: 10,
      fontWeight: 'normal',
      color: '#94a3b8',
      align: 'left',
      visible: true,
    },
    {
      id: 'ticketId',
      type: 'text',
      content: 'RA-2024-001234',
      x: 20,
      y: 90,
      width: 150,
      height: 25,
      fontSize: 14,
      fontWeight: 'semibold',
      color: '#14b8a6',
      align: 'left',
      visible: true,
    },
    {
      id: 'visitorName',
      type: 'text',
      content: 'Nama Pengunjung',
      x: 20,
      y: 115,
      width: 200,
      height: 25,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      align: 'left',
      visible: true,
    },
    {
      id: 'category',
      type: 'badge',
      content: 'DOMESTIK',
      x: 20,
      y: 150,
      width: 80,
      height: 24,
      fontSize: 10,
      fontWeight: 'semibold',
      color: '#14b8a6',
      visible: true,
    },
    {
      id: 'validDate',
      type: 'text',
      content: 'Berlaku: 01 Jan - 31 Des 2024',
      x: 20,
      y: 185,
      width: 200,
      height: 20,
      fontSize: 11,
      fontWeight: 'normal',
      color: '#94a3b8',
      align: 'left',
      visible: true,
    },
    {
      id: 'qrCode',
      type: 'qr',
      content: 'RA-2024-001234',
      x: 300,
      y: 100,
      width: 80,
      height: 80,
      visible: true,
    },
    {
      id: 'divider',
      type: 'divider',
      content: '',
      x: 280,
      y: 20,
      width: 2,
      height: 180,
      color: '#14b8a6',
      opacity: 0.3,
      visible: true,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};
