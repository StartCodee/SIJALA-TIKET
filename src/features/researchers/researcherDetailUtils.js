const RESEARCH_DETAIL_KEYS = [
  "lokasiKKPN",
  "lokasiKkpn",
  "namaInstitusi",
  "asalInstitusi",
  "alamatInstitusi",
  "provinsi",
  "kabupatenKota",
  "nomorTeleponInstitusiPeneliti",
  "emailInstitusiPeneliti",
  "judulPenelitian",
  "tujuanPenelitian",
  "uraianSingkatPenelitian",
  "tanggalMulaiKegiatan",
  "tanggalSelesaiKegiatan",
  "namaLengkapPenanggungJawab",
  "kewarganegaraanPenanggungJawab",
  "nomorSelulerPenanggungJawab",
  "saranaPenelitianDigunakan",
  "jumlahKapalPenelitianIndonesia",
  "namaKapalPenelitianIndonesia",
  "jumlahKapalPenelitianAsing",
  "namaKapalPenelitianAsing",
  "anggotaPeneliti",
];

export const isResearcherFeeCategory = (feeCategory) =>
  String(feeCategory || "").startsWith("peneliti_");

const hasDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const hasResearcherDetailData = (ticket) =>
  RESEARCH_DETAIL_KEYS.some((key) => hasDisplayValue(ticket?.[key]));

const pickFirstValue = (source, keys, fallback = "-") => {
  for (const key of keys) {
    const value = source?.[key];
    if (hasDisplayValue(value)) return value;
  }
  return fallback;
};

const toNameList = (value) => {
  if (Array.isArray(value)) {
    const validItems = value.map((item) => String(item || "").trim()).filter(Boolean);
    return validItems.length ? validItems.join(", ") : "-";
  }
  if (typeof value === "string") {
    return value.trim() || "-";
  }
  return "-";
};

const toNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatResearchDate = (value) => {
  if (!hasDisplayValue(value)) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const buildResearcherDetail = (ticket, ticketMeta) => {
  const source = ticket || {};
  const indonesianVesselNamesRaw = pickFirstValue(
    source,
    [
      "indonesianResearchVesselNames",
      "indonesianResearchVessels",
      "kapalPenelitianIndonesiaNames",
      "kapalPenelitianIndonesia",
      "namaKapalPenelitianIndonesia",
      "namaKapalIndonesia",
    ],
    [],
  );
  const foreignVesselNamesRaw = pickFirstValue(
    source,
    [
      "foreignResearchVesselNames",
      "foreignResearchVessels",
      "kapalPenelitianAsingNames",
      "kapalPenelitianAsing",
      "namaKapalPenelitianAsing",
      "namaKapalAsing",
    ],
    [],
  );

  const derivedIndonesianCount = Array.isArray(indonesianVesselNamesRaw)
    ? indonesianVesselNamesRaw.filter(Boolean).length
    : null;
  const derivedForeignCount = Array.isArray(foreignVesselNamesRaw)
    ? foreignVesselNamesRaw.filter(Boolean).length
    : null;

  const indonesianCountValue = toNumericValue(
    pickFirstValue(
      source,
      [
        "indonesianResearchVesselCount",
        "kapalPenelitianIndonesiaCount",
        "jumlahKapalPenelitianIndonesia",
        "jumlahKapalIndonesia",
      ],
      null,
    ),
  );
  const foreignCountValue = toNumericValue(
    pickFirstValue(
      source,
      [
        "foreignResearchVesselCount",
        "kapalPenelitianAsingCount",
        "jumlahKapalPenelitianAsing",
        "jumlahKapalAsing",
      ],
      null,
    ),
  );

  return {
    ticketId: ticketMeta?.ticketId || source?.id || "-",
    ticketName: ticketMeta?.namaLengkap || source?.namaLengkap || "-",
    feeLabel: ticketMeta?.feeLabel || source?.feeCategory || "Peneliti",
    lokasiKkpn: pickFirstValue(source, [
      "lokasiKKPN",
      "lokasiKkpn",
      "researchLocationKKPN",
      "kkpnLocation",
    ]),
    namaInstitusi: pickFirstValue(source, [
      "namaInstitusi",
      "institutionName",
      "researchInstitutionName",
    ]),
    asalInstitusi: pickFirstValue(source, [
      "asalInstitusi",
      "institutionOrigin",
      "researchInstitutionOrigin",
    ]),
    alamatInstitusi: pickFirstValue(source, [
      "alamatInstitusi",
      "institutionAddress",
      "researchInstitutionAddress",
    ]),
    provinsi: pickFirstValue(source, [
      "provinsi",
      "province",
      "institutionProvince",
      "provinsiInstitusi",
    ]),
    kabupatenKota: pickFirstValue(source, [
      "kabupatenKota",
      "kabupaten_kota",
      "city",
      "institutionCity",
      "kotaInstitusi",
    ]),
    teleponInstitusi: pickFirstValue(source, [
      "nomorTeleponInstitusiPeneliti",
      "nomorTeleponInstitusi",
      "institutionPhone",
      "researchInstitutionPhone",
    ]),
    emailInstitusi: pickFirstValue(source, [
      "emailInstitusiPeneliti",
      "emailInstitusi",
      "institutionEmail",
      "researchInstitutionEmail",
    ]),
    judulPenelitian: pickFirstValue(source, ["judulPenelitian", "researchTitle"]),
    tujuanPenelitian: pickFirstValue(source, ["tujuanPenelitian", "researchObjective"]),
    uraianSingkatPenelitian: pickFirstValue(source, [
      "uraianSingkatPenelitian",
      "researchSummary",
      "researchDescription",
    ]),
    tanggalMulaiKegiatan: formatResearchDate(
      pickFirstValue(source, ["tanggalMulaiKegiatan", "activityStartDate", "researchStartDate"], null),
    ),
    tanggalSelesaiKegiatan: formatResearchDate(
      pickFirstValue(source, ["tanggalSelesaiKegiatan", "activityEndDate", "researchEndDate"], null),
    ),
    penanggungJawabNama: pickFirstValue(
      source,
      ["namaLengkapPenanggungJawab", "penanggungJawabNama", "personInChargeName"],
      ticketMeta?.namaLengkap || source?.namaLengkap || "-",
    ),
    penanggungJawabKewarganegaraan: pickFirstValue(
      source,
      [
        "kewarganegaraanPenanggungJawab",
        "penanggungJawabKewarganegaraan",
        "personInChargeCitizenship",
      ],
      source?.countryOCR || "-",
    ),
    penanggungJawabNomorSeluler: pickFirstValue(
      source,
      ["nomorSelulerPenanggungJawab", "penanggungJawabNomorSeluler", "personInChargePhone"],
      ticketMeta?.noHP || source?.noHP || "-",
    ),
    saranaPenelitian: pickFirstValue(
      source,
      ["saranaPenelitianDigunakan", "saranaPenelitian", "researchFacilitiesUsed", "researchFacility"],
      "-",
    ),
    kapalPenelitianIndonesiaJumlah: indonesianCountValue ?? derivedIndonesianCount ?? "-",
    kapalPenelitianIndonesiaNama: toNameList(indonesianVesselNamesRaw),
    kapalPenelitianAsingJumlah: foreignCountValue ?? derivedForeignCount ?? "-",
    kapalPenelitianAsingNama: toNameList(foreignVesselNamesRaw),
  };
};

export const resolveSharedResearcherTicket = (currentTicket, relatedTickets = []) => {
  const candidates = [currentTicket, ...relatedTickets].filter(Boolean);
  const uniqueCandidates = Array.from(
    new Map(candidates.map((ticket) => [ticket.id, ticket])).values(),
  );
  const researcherCandidates = uniqueCandidates.filter((ticket) =>
    isResearcherFeeCategory(ticket?.feeCategory),
  );

  return (
    researcherCandidates.find((ticket) => hasResearcherDetailData(ticket)) ||
    researcherCandidates[0] ||
    null
  );
};
