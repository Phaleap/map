/*
 * Important Tonle Sap areas.
 * Verified conservation area boundaries are loaded via GeoJSON from data/.
 * Areas without verified boundary data remain marker-only.
 */
const areas = [
  {
    id: "prek-toal-core-area",
    nameKh: "តំបន់ស្នូលអភិរក្សព្រែកទាល់",
    nameEn: "Prek Toal Core Conservation Area",
    aliasesKh: ["ព្រែកទាល់", "តំបន់ព្រែកទាល់"],
    aliasesEn: ["Prek Toal", "Prek Toal Core Area", "Prek Toal Conservation Area"],
    lat: 13.1485, lng: 103.6532,
    geoJsonFile: "data/prek-toal.geojson"
  },
  {
    id: "boeng-chhmar-core-area",
    nameKh: "តំបន់ស្នូលបឹងឆ្មារ",
    nameEn: "Boeng Chhmar Core Area",
    aliasesKh: ["បឹងឆ្មារ", "ទន្លេឆ្មារ", "ទន្លេឆ្មា"],
    aliasesEn: ["Boeng Chhmar", "Boeung Chhmar", "Tonle Chhmar"],
    lat: 12.7956, lng: 104.3211,
    geoJsonFile: "data/boeng-chhmar.geojson"
  },
  {
    id: "stung-sen-ramsar",
    nameKh: "តំបន់រ៉ាមសារស្ទឹងសែន",
    nameEn: "Stung Sen Ramsar Site",
    aliasesKh: ["ស្ទឹងសែន", "រ៉ាមសារស្ទឹងសែន"],
    aliasesEn: ["Stung Sen", "Stung Sen Ramsar", "Stung Sen Ramsar Site"],
    lat: 12.6171, lng: 104.5143,
    geoJsonFile: "data/stung-sen-ramsar.geojson"
  },
  {
    id: "chong-khneas",
    nameKh: "ចុងឃ្នៀស",
    nameEn: "Chong Khneas",
    aliasesKh: ["ភូមិបណ្តែតទឹកចុងឃ្នៀស"],
    aliasesEn: ["Chong Kneas", "Chong Khneas Floating Village"],
    lat: 13.2036, lng: 103.9812
  },
  {
    id: "kampong-phluk",
    nameKh: "កំពង់ភ្លុក",
    nameEn: "Kampong Phluk",
    aliasesKh: ["ភូមិកំពង់ភ្លុក"],
    aliasesEn: ["Kampong Pluk", "Kampong Phluk Floating Village"],
    lat: 13.1986, lng: 104.2240
  },
  {
    id: "kampong-khleang",
    nameKh: "កំពង់ឃ្លាំង",
    nameEn: "Kampong Khleang",
    aliasesKh: ["ភូមិកំពង់ឃ្លាំង"],
    aliasesEn: ["Kampong Kleang", "Kampong Khleang Floating Village"],
    lat: 13.0839, lng: 104.4082
  },
  {
    id: "mechrey",
    nameKh: "មេជ្រៃ",
    nameEn: "Mechrey",
    aliasesKh: ["ភូមិមេជ្រៃ"],
    aliasesEn: ["Me Chrey", "Mechrey Floating Village"],
    lat: 13.3914, lng: 104.1180
  },
  {
    id: "tonle-sap-river",
    nameKh: "ទន្លេសាប",
    nameEn: "Tonle Sap River",
    aliasesKh: ["ទន្លេបឹងទន្លេសាប"],
    aliasesEn: ["Tonle Sap", "Tonle Sap Waterway"],
    lat: 12.5069, lng: 104.9458
  },
  {
    id: "sangker-river",
    nameKh: "ស្ទឹងសង្កែ",
    nameEn: "Sangker River",
    aliasesKh: ["ទន្លេសង្កែ"],
    aliasesEn: ["Sangkae River", "Sangke River"],
    lat: 12.9563, lng: 103.9951
  },
  {
    id: "siem-reap-river",
    nameKh: "ស្ទឹងសៀមរាប",
    nameEn: "Siem Reap River",
    aliasesKh: ["ទន្លេសៀមរាប"],
    aliasesEn: ["Siem Reap Waterway"],
    lat: 13.2675, lng: 103.9687
  },
  {
    id: "pursat-river",
    nameKh: "ស្ទឹងពោធិ៍សាត់",
    nameEn: "Pursat River",
    aliasesKh: ["ទន្លេពោធិ៍សាត់"],
    aliasesEn: ["Pursat Waterway"],
    lat: 12.5627, lng: 103.9158
  },
  {
    id: "kampong-chhnang-port",
    nameKh: "កំពង់ឆ្នាំង",
    nameEn: "Kampong Chhnang Port",
    aliasesKh: ["កំពង់ផែកំពង់ឆ្នាំង"],
    aliasesEn: ["Kampong Chhnang", "Kampong Chhnang River Port"],
    lat: 12.2506, lng: 104.6667
  },
  {
    id: "pursat-town",
    nameKh: "ក្រុងពោធិ៍សាត់",
    nameEn: "Pursat Town",
    aliasesKh: ["ពោធិ៍សាត់"],
    aliasesEn: ["Pursat"],
    lat: 12.5388, lng: 103.9192
  },
  {
    id: "siem-reap-town",
    nameKh: "ក្រុងសៀមរាប",
    nameEn: "Siem Reap Town",
    aliasesKh: ["សៀមរាប"],
    aliasesEn: ["Siem Reap"],
    lat: 13.3633, lng: 103.8564
  },
  {
    id: "kampong-thom-town",
    nameKh: "ក្រុងកំពង់ធំ",
    nameEn: "Kampong Thom Town",
    aliasesKh: ["កំពង់ធំ"],
    aliasesEn: ["Kampong Thom"],
    lat: 12.7111, lng: 104.8887
  }
];
