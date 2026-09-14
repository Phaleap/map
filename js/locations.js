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
    lat: 13.218919,
    lng: 103.974401,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "chong-khneas",
    nameKh: "ចុងឃ្នៀស",
    nameEn: "Chong Khneas",
    lat: 13.278077,
    lng: 103.821780,
    labelDirection: "right",
    labelOffset: [8, 0]
  },
  {
    id: "keo-por",
    nameKh: "កែវពណ៌",
    nameEn: "Keo Por",
    aliasesEn: ["Kaev Poar"],
    lat: 13.380341,
    lng: 103.734020,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "doun-sdaeng",
    nameKh: "ដូនស្តើង",
    nameEn: "Doun Sdaeng",
    aliasesEn: ["Don Sdaeng"],
    lat: 12.771464,
    lng: 104.283052,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "tuol-neang-sav",
    nameKh: "ទួលនាងសាវ",
    nameEn: "Tuol Neang Sav",
    lat: 12.558440,
    lng: 104.499757,
    labelDirection: "top",
    labelOffset: [0, -8]
  },
  {
    id: "kampong-kou",
    nameKh: "កំពង់គោ",
    nameEn: "Kampong Kou",
    aliasesEn: ["Kampong Ko"],
    lat: 12.708523,
    lng: 104.788988,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "phlov-touk",
    nameKh: "ផ្លូវទូក",
    nameEn: "Phlov Touk",
    lat: 12.511971,
    lng: 104.639966,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "local-08",
    nameKh: "ច្រណូក",
    nameEn: "Chranouk",
    lat: 12.418761,
    lng: 104.776599,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "reang-til",
    nameKh: "រាំងទិល",
    nameEn: "Reang Til",
    lat: 12.784794,
    lng: 104.007049,
    labelDirection: "bottom",
    labelOffset: [0, 8]
  },
  {
    id: "prek-kra",
    nameKh: "ព្រែកក្រ",
    nameEn: "Prek Kra",
    lat: 12.935397,
    lng: 103.792408,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "bak-prea",
    nameKh: "បាក់ព្រា",
    nameEn: "Bak Prea",
    lat: 13.312503,
    lng: 103.400644,
    labelDirection: "left",
    labelOffset: [-8, 0]
  },
  {
    id: "prek-toal",
    nameKh: "ព្រែកទាល់",
    nameEn: "Prek Toal",
    lat: 13.237404,
    lng: 103.657541,
    labelDirection: "left",
    labelOffset: [-8, 0]
  }
];
