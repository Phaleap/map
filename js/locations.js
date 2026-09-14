/**
 * Tonlé Sap Map Dataset
 * Contains ONLY:
 * 1. Exactly 3 important conservation/wetland areas (polygons)
 * 2. Exactly 12 commune / local-area points
 */

const importantAreas = [
  {
    id: "prek-toal-core-area",
    nameKh: "តំបន់ស្នូលអភិរក្សព្រែកទាល់",
    nameEn: "Prek Toal Core Conservation Area",
    lat: 13.1400,
    lng: 103.6850,
    geoJsonFile: "data/prek-toal.geojson"
  },
  {
    id: "boeng-chhmar-core-area",
    nameKh: "តំបន់ស្នូលបឹងឆ្មារ",
    nameEn: "Boeng Chhmar Core Area",
    lat: 12.8300,
    lng: 104.3400,
    geoJsonFile: "data/boeng-chhmar.geojson"
  },
  {
    id: "stung-sen-ramsar",
    nameKh: "តំបន់រ៉ាមសារស្ទឹងសែន",
    nameEn: "Stung Sen Ramsar Site",
    lat: 12.6150,
    lng: 104.5500,
    geoJsonFile: "data/stung-sen-ramsar.geojson"
  }
];

const localPlaces = [
  {
    id: "kampong-phluk",
    nameKh: "កំពង់ភ្លុក",
    nameEn: "Kampong Phluk",
    lat: 13.1986,
    lng: 104.2240,
    labelDirection: "top",
    labelOffset: [0, -8]
  },
  {
    id: "chong-khneas",
    nameKh: "ចុងឃ្នៀស",
    nameEn: "Chong Khneas",
    lat: 13.2036,
    lng: 103.9812,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "keo-por",
    nameKh: "កែវពណ៌",
    nameEn: "Keo Por",
    aliasesEn: ["Kaev Poar"],
    lat: 13.2842,
    lng: 103.7651,
    labelDirection: "top",
    labelOffset: [0, -8]
  },
  {
    id: "doun-sdaeng",
    nameKh: "ដូនស្តើង",
    nameEn: "Doun Sdaeng",
    aliasesEn: ["Don Sdaeng"],
    lat: 12.5370,
    lng: 104.4709,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "tuol-neang-sav",
    nameKh: "ទួលនាងសាវ",
    nameEn: "Tuol Neang Sav",
    lat: 12.5550,
    lng: 104.4350,
    labelDirection: "top",
    labelOffset: [0, -8]
  },
  {
    id: "kampong-kou",
    nameKh: "កំពង់គោ",
    nameEn: "Kampong Kou",
    aliasesEn: ["Kampong Ko"],
    lat: 12.7482,
    lng: 104.8143,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "phlov-touk",
    nameKh: "ផ្លូវទូក",
    nameEn: "Phlov Touk",
    lat: 12.5340,
    lng: 104.1820,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "local-08",
    nameKh: "ច្រណូក",
    nameEn: "Chranouk",
    lat: 12.3943,
    lng: 104.6242,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "reang-til",
    nameKh: "រាំងទិល",
    nameEn: "Reang Til",
    lat: 12.7849,
    lng: 104.0071,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "prek-kra",
    nameKh: "ព្រែកក្រ",
    nameEn: "Prek Kra",
    lat: 12.6954,
    lng: 103.7404,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "bak-prea",
    nameKh: "បាក់ព្រា",
    nameEn: "Bak Prea",
    lat: 13.1180,
    lng: 103.5420,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "prek-toal",
    nameKh: "ព្រែកទាល់",
    nameEn: "Prek Toal",
    lat: 13.1950,
    lng: 103.6550,
    labelDirection: "left",
    labelOffset: [-8, 0]
  }
];
