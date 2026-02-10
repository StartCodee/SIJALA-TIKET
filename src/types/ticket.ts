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
  zIndex?: number;
  imageFit?: 'cover' | 'contain';
  borderRadius?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: string;
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

const ASSET_BASE = '/ticket-assets';

const IMG_LEFT_WALLPAPER = `${ASSET_BASE}/hero.jpg`;
const IMG_RIGHT_HEADER_BG = `${ASSET_BASE}/hero.jpg`;
const IMG_LOGO_WATERMARK = `${ASSET_BASE}/logo-watermark.png`;
const IMG_CREST_1 = `${ASSET_BASE}/crest-1.png`;
const IMG_CREST_2 = `${ASSET_BASE}/crest-2.png`;
const IMG_FOOTER_1 = `${ASSET_BASE}/logo-watermark.png`;
const IMG_FOOTER_2 = `${ASSET_BASE}/footer-geopark.png`;
const IMG_FOOTER_3 = `${ASSET_BASE}/footer-rajaampat.png`;
const IMG_FOOTER_4 = `${ASSET_BASE}/footer-wonderful.png`;
const IMG_QR_PLACEHOLDER = `${ASSET_BASE}/qr.svg`;

const ORANGE_GRADIENT = 'linear-gradient(90deg, #ea580c 0%, #f97316 45%, #fb923c 100%)';

export const defaultTicketDesign: TicketDesign = {
  id: 'raja-ampat-tlpjl',
  name: 'TLPJL Raja Ampat',
  width: 900,
  height: 360,
  background: { type: 'solid', value: '#ffffff', opacity: 1 },
  borderRadius: 8,
  borderColor: ORANGE_GRADIENT,
  borderWidth: 2,
  elements: [
    { id: 'leftWallpaper', type: 'image', content: IMG_LEFT_WALLPAPER, x: 0, y: 0, width: 450, height: 280, opacity: 1, imageFit: 'cover', zIndex: 1, visible: true },
    { id: 'leftAccentStrip', type: 'divider', content: '', x: 0, y: 260, width: 450, height: 20, color: ORANGE_GRADIENT, opacity: 1, zIndex: 2, visible: true },
    { id: 'leftBottomWhite', type: 'divider', content: '', x: 0, y: 280, width: 450, height: 80, color: '#ffffff', opacity: 1, zIndex: 2, visible: true },
    { id: 'crest1', type: 'image', content: IMG_CREST_1, x: 175, y: 14, width: 42, height: 48, imageFit: 'contain', zIndex: 5, visible: true },
    { id: 'crest2', type: 'image', content: IMG_CREST_2, x: 225, y: 14, width: 42, height: 48, imageFit: 'contain', zIndex: 5, visible: true },
    { id: 'leftTitle1', type: 'text', content: 'Raja Ampat Marine Conservation Area', x: 25, y: 86, width: 400, height: 30, fontSize: 18, fontWeight: 'bold', color: '#ffffff', align: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.65)', zIndex: 6, visible: true },
    { id: 'leftTitle2', type: 'text', content: 'Environmental Maintenance Services Fee', x: 25, y: 122, width: 400, height: 30, fontSize: 18, fontWeight: 'bold', color: '#fde047', align: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.75)', zIndex: 6, visible: true },
    { id: 'leftTitle3', type: 'text', content: 'MPA Raja Ampat for International Visitor', x: 25, y: 158, width: 400, height: 26, fontSize: 16, fontWeight: 'bold', color: '#fde047', align: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.75)', zIndex: 6, visible: true },
    { id: 'footerLogo1', type: 'image', content: IMG_FOOTER_1, x: 18, y: 294, width: 105, height: 57, imageFit: 'contain', zIndex: 6, visible: true },
    { id: 'footerLogo2', type: 'image', content: IMG_FOOTER_2, x: 120, y: 292, width: 80, height: 57, imageFit: 'contain', zIndex: 6, visible: true },
    { id: 'footerLogo3', type: 'image', content: IMG_FOOTER_3, x: 205, y: 295, width: 105, height: 57, imageFit: 'contain', zIndex: 6, visible: true },
    { id: 'footerLogo4', type: 'image', content: IMG_FOOTER_4, x: 328, y: 298, width: 100, height: 57, imageFit: 'contain', zIndex: 6, visible: true },
    { id: 'rightHeaderBg', type: 'image', content: IMG_RIGHT_HEADER_BG, x: 450, y: 0, width: 450, height: 140, opacity: 0.35, imageFit: 'cover', zIndex: 1, visible: true },
    { id: 'rightHeaderOverlay', type: 'divider', content: '', x: 450, y: 0, width: 450, height: 140, color: 'rgba(226, 245, 255, 0.82)', opacity: 1, zIndex: 2, visible: true },
    { id: 'rightWatermarkLogo', type: 'image', content: IMG_LOGO_WATERMARK, x: 428, y: 16, width: 190, height: 50, imageFit: 'contain', zIndex: 4, visible: true },
    { id: 'rightOrgHeader', type: 'text', content: 'Unit Pelaksana Teknis Daerah\nPengelolaan Kawasan Konservasi\nDi Perairan Kepulauan Raja Ampat', x: 620, y: 18, width: 260, height: 54, fontSize: 12, fontWeight: 'bold', color: '#1d4ed8', align: 'right', lineHeight: 1.15, zIndex: 5, visible: true },
    { id: 'rightAddress', type: 'text', content: 'Jl. Yos Sudarso, Siwindores,\nDistrik Kota Waisai, Kabupaten Raja Ampat\nProvinsi Papua Barat Daya, Indonesia', x: 620, y: 76, width: 260, height: 58, fontSize: 9, fontWeight: 'normal', color: '#334155', align: 'right', lineHeight: 1.25, zIndex: 5, visible: true },
    { id: 'accentBarRight', type: 'divider', content: '', x: 450, y: 120, width: 450, height: 120, color: ORANGE_GRADIENT, opacity: 1, zIndex: 3, visible: true },
    { id: 'visitorName', type: 'text', content: 'Ivan Nizar', x: 468, y: 138, width: 260, height: 22, fontSize: 18, fontWeight: 'bold', color: '#ffffff', align: 'left', zIndex: 6, visible: true },
    { id: 'visitorCountry', type: 'text', content: 'Indonesia', x: 468, y: 162, width: 260, height: 18, fontSize: 11, fontWeight: 'semibold', color: '#ffffff', align: 'left', zIndex: 6, visible: true },
    { id: 'visitorId', type: 'text', content: 'KTP: 32598079287420572', x: 468, y: 182, width: 300, height: 18, fontSize: 10, fontWeight: 'bold', color: '#ffffff', align: 'left', zIndex: 6, visible: true },
    { id: 'validPeriod', type: 'text', content: 'Berlaku 07/08/2024 hingga 07/08/2025', x: 468, y: 200, width: 320, height: 18, fontSize: 10, fontWeight: 'normal', color: '#ffffff', align: 'left', zIndex: 6, visible: true },
    { id: 'ticketCode', type: 'text', content: 'INA24080023', x: 468, y: 220, width: 240, height: 18, fontSize: 10, fontWeight: 'bold', color: '#ffffff', align: 'left', zIndex: 6, visible: true },
    { id: 'qrCode', type: 'qr', content: IMG_QR_PLACEHOLDER, x: 790, y: 138, width: 92, height: 92, zIndex: 6, visible: true },
    { id: 'disclaimer', type: 'text', content: 'Kartu ini tidak bisa diuangkan dan dipindah tangankan.\nInformasi diatas harus sesuai sebagai syarat pengesahan izin masuk.\nKartu ini harus selalu dibawa dan dapat ditunjukkan kepada petugas jika diminta.\nTerima kasih telah berkontribusi pada pengelolaan Kawasan Konservasi di Perairan Raja Ampat.\nPemasukan yang diperoleh dari kartu izin masuk ini dipergunakan untuk mendukung pengelolaan Kawasan Konservasi\ndi Perairan Raja Ampat dan memastikan keberlangsungan keanekaragaman sumber daya yang ada.', x: 468, y: 250, width: 420, height: 70, fontSize: 8.5, fontWeight: 'normal', color: '#334155', align: 'left', lineHeight: 1.25, zIndex: 6, visible: true },
    { id: 'contactLine', type: 'text', content: 'TLPJL: environmentalfee@gmail.com   •   Office: kkpr4.office@gmail.com   •   www.kkprajaampat.com', x: 468, y: 330, width: 420, height: 18, fontSize: 9, fontWeight: 'semibold', color: '#0f172a', align: 'left', lineHeight: 1.1, zIndex: 6, visible: true },
    { id: 'middleDivider', type: 'divider', content: '', x: 449, y: 0, width: 2, height: 360, color: 'rgba(15, 23, 42, 0.12)', opacity: 1, zIndex: 20, visible: true },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const elementLabels: Record<string, string> = {
  leftWallpaper: 'Foto Kiri',
  leftAccentStrip: 'Strip Aksen Kiri',
  leftBottomWhite: 'Area Bawah Kiri',
  crest1: 'Logo Lambang 1',
  crest2: 'Logo Lambang 2',
  leftTitle1: 'Judul Utama',
  leftTitle2: 'Sub Judul',
  leftTitle3: 'Keterangan Visitor',
  footerLogo1: 'Logo Footer 1',
  footerLogo2: 'Logo Footer 2',
  footerLogo3: 'Logo Footer 3',
  footerLogo4: 'Logo Footer 4',
  rightHeaderBg: 'BG Header Kanan',
  rightHeaderOverlay: 'Overlay Header',
  rightWatermarkLogo: 'Logo Watermark',
  rightOrgHeader: 'Nama Instansi',
  rightAddress: 'Alamat',
  accentBarRight: 'Bar Aksen Kanan',
  visitorName: 'Nama Pengunjung',
  visitorCountry: 'Negara',
  visitorId: 'ID Pengunjung',
  validPeriod: 'Masa Berlaku',
  ticketCode: 'Kode Tiket',
  qrCode: 'QR Code',
  disclaimer: 'Disclaimer',
  contactLine: 'Kontak',
  middleDivider: 'Garis Tengah',
};