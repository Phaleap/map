/* Display data only: names and coordinates. No statistics are shown in this first map view. */
const importantAreas = [
  { id: "prek-toal", nameKh: "តំបន់ស្នូលអភិរក្សព្រែកទាល់", nameEn: "Prek Toal Core Conservation Area", center: [13.1485, 103.6532], geoJsonFile: "data/prek-toal.geojson" },
  { id: "boeng-chhmar", nameKh: "តំបន់ស្នូលបឹងឆ្មារ", nameEn: "Boeng Chhmar Core Area", center: [12.7956, 104.3211], geoJsonFile: "data/boeng-chhmar.geojson" },
  { id: "stung-sen", nameKh: "តំបន់រ៉ាមសារស្ទឹងសែន", nameEn: "Stung Sen Ramsar Site", center: [12.6171, 104.5143], geoJsonFile: "data/stung-sen-ramsar.geojson" }
];
const provinces = [
  { id: "siem-reap", nameKh: "សៀមរាប", nameEn: "Siem Reap", lat: 13.30, lng: 104.35 },
  { id: "kampong-thom", nameKh: "កំពង់ធំ", nameEn: "Kampong Thom", lat: 12.90, lng: 104.62 },
  { id: "kampong-chhnang", nameKh: "កំពង់ឆ្នាំង", nameEn: "Kampong Chhnang", lat: 12.47, lng: 104.05 },
  { id: "pursat", nameKh: "ពោធិ៍សាត់", nameEn: "Pursat", lat: 12.77, lng: 103.55 },
  { id: "battambang", nameKh: "បាត់ដំបង", nameEn: "Battambang", lat: 13.10, lng: 103.42 }
];
const localPlaces = [
  { id: "prek-toal-village", nameKh: "ព្រែកទាល់", nameEn: "Prek Toal", provinceId: "battambang", lat: 13.203, lng: 103.680 },
  { id: "koh-chiveang", nameKh: "កោះជីវាំង", nameEn: "Koh Chiveang", provinceId: "battambang", lat: 13.039, lng: 103.498 },
  { id: "kampong-phluk", nameKh: "កំពង់ភ្លុក", nameEn: "Kampong Phluk", provinceId: "siem-reap", lat: 13.214, lng: 104.122 },
  { id: "chong-kneas", nameKh: "ចុងឃ្នាស", nameEn: "Chong Kneas", provinceId: "siem-reap", lat: 13.312, lng: 103.986 },
  { id: "kampong-khleang", nameKh: "កំពង់ឃ្លាំង", nameEn: "Kampong Khleang", provinceId: "siem-reap", lat: 12.873, lng: 104.196 },
  { id: "peam-bang", nameKh: "ពាមបាង", nameEn: "Peam Bang", provinceId: "kampong-thom", lat: 12.873, lng: 104.309 },
  { id: "boeng-chhmar-village", nameKh: "បឹងឆ្មារ", nameEn: "Boeng Chhmar", provinceId: "kampong-thom", lat: 12.782, lng: 104.425 },
  { id: "kampong-svay", nameKh: "កំពង់ស្វាយ", nameEn: "Kampong Svay", provinceId: "kampong-thom", lat: 12.550, lng: 104.590 },
  { id: "chhnok-tru", nameKh: "ឆ្នុកទ្រូ", nameEn: "Chhnok Tru", provinceId: "kampong-chhnang", lat: 12.534, lng: 104.182 },
  { id: "kampong-chhnang-town", nameKh: "កំពង់ឆ្នាំង", nameEn: "Kampong Chhnang", provinceId: "kampong-chhnang", lat: 12.252, lng: 104.666 },
  { id: "kampong-luong", nameKh: "កំពង់លួង", nameEn: "Kampong Luong", provinceId: "pursat", lat: 12.690, lng: 103.701 },
  { id: "krakor", nameKh: "ក្រគរ", nameEn: "Krakor", provinceId: "pursat", lat: 12.483, lng: 103.615 }
];
