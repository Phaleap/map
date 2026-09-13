/*
 * Tonlé Sap Conservation Areas, Target Communes, and Provinces
 * Extracted from project records ("តំបន់គោលដៅនិងស្ថិតិ") and authoritative WDPA GIS datasets.
 */

const coreAreas = [
  {
    id: "prek-toal-core-area",
    type: "coreArea",
    nameEn: "Prek Toal Core Conservation Area",
    nameKh: "តំបន់ស្នូលអភិរក្សព្រែកទាល់",
    provinceEn: "Battambang",
    provinceKh: "បាត់ដំបង",
    districtEn: "Aek Phnum",
    districtKh: "ឯកភ្នំ",
    lat: 13.1485,
    lng: 103.6532,
    geoJsonFile: "data/prek-toal.geojson",
    statusBadge: "UNESCO Biosphere Core Zone",
    stats: [
      { label: "Protected Area", value: "21,342 ha" },
      { label: "Ramsar Site", value: "#2245" },
      { label: "Key Partner", value: "Kaoh Chiveang CFi" },
      { label: "Community Members", value: "700 local fishers" }
    ],
    highlight: "Southeast Asia's premier waterbird sanctuary, protecting nesting colonies of Spot-billed Pelicans, Greater Adjutants, and Milky Storks.",
    description: "Located at the northwestern edge of Tonlé Sap, Prek Toal is internationally renowned as the single most critical wetland breeding ground in Southeast Asia. Supported by local conservation rangers from the floating villages."
  },
  {
    id: "boeng-chhmar-core-area",
    type: "coreArea",
    nameEn: "Boeng Chhmar Core Area",
    nameKh: "តំបន់ស្នូលបឹងឆ្មារ",
    provinceEn: "Kampong Thom",
    provinceKh: "កំពង់ធំ",
    districtEn: "Stoung",
    districtKh: "ស្ទោង",
    lat: 12.7956,
    lng: 104.3211,
    geoJsonFile: "data/boeng-chhmar.geojson",
    statusBadge: "UNESCO Biosphere Core Zone",
    stats: [
      { label: "Protected Area", value: "28,000 ha" },
      { label: "Ramsar Site", value: "#997" },
      { label: "Ecosystem", value: "Permanent Lake & Forest" },
      { label: "Key Communities", value: "Peam Bang & Phat Sanday" }
    ],
    highlight: "A permanent wetland refuge that serves as an essential fish nursery and wintering sanctuary for migratory waterfowl.",
    description: "Boeng Chhmar encompasses an interconnected network of permanent shallow lake waters and dense inundated forests in eastern Tonlé Sap, sustaining high fish diversity during dry-season recessions."
  },
  {
    id: "stung-sen-ramsar",
    type: "coreArea",
    nameEn: "Stung Sen Ramsar Site",
    nameKh: "តំបន់រ៉ាមសារស្ទឹងសែន",
    provinceEn: "Kampong Thom",
    provinceKh: "កំពង់ធំ",
    districtEn: "Kampong Svay",
    districtKh: "កំពង់ស្វាយ",
    lat: 12.6171,
    lng: 104.5143,
    geoJsonFile: "data/stung-sen-ramsar.geojson",
    statusBadge: "Ramsar Wetland of Global Importance",
    stats: [
      { label: "Designated Area", value: "9,293 ha" },
      { label: "Ramsar Site", value: "#2433" },
      { label: "Habitat Type", value: "Peat Swamp & Gallery Forest" },
      { label: "River System", value: "Sen River Delta" }
    ],
    highlight: "Rare freshwater peat swamp forests that protect endangered fish migrations and buffer the lower Tonlé Sap basin.",
    description: "Situated along the mouth of the Sen River, Stung Sen harbors Cambodia's largest expanse of flooded gallery forests, providing spawning grounds for the endangered Mekong Giant Catfish and Giant Barb."
  }
];

const targetCommunes = [
  {
    id: "cfi-kampong-phluk",
    type: "commune",
    nameEn: "Kampong Phluk",
    nameKh: "កំពង់ភ្លុក",
    communityName: "កំពង់ភ្លុក (Kampong Phluk)",
    provinceEn: "Siem Reap",
    provinceKh: "សៀមរាប",
    districtEn: "Prasat Bakong",
    districtKh: "ប្រាសាទបាគង",
    lat: 13.1986,
    lng: 104.2240,
    stats: [
      { label: "Managed Area", value: "12,329 ha" },
      { label: "Conservation Zone", value: "200 ha" },
      { label: "Flooded Forest", value: "6,030 ha" },
      { label: "Community Members", value: "998 (13 Committee)" }
    ],
    highlight: "World-famous stilted village with extensive community-patrolled flooded mangrove forests."
  },
  {
    id: "cfi-chong-khneas",
    type: "commune",
    nameEn: "Chong Khneas",
    nameKh: "ចុងឃ្នៀស",
    communityName: "ចុងឃ្នៀស (Chong Khneas)",
    provinceEn: "Siem Reap",
    provinceKh: "សៀមរាប",
    districtEn: "Krong Siem Reap",
    districtKh: "ក្រុងសៀមរាប",
    lat: 13.2036,
    lng: 103.9812,
    stats: [
      { label: "Managed Area", value: "7,338 ha" },
      { label: "Conservation Zone", value: "250 ha" },
      { label: "Flooded Forest", value: "7,338 ha" },
      { label: "Community Members", value: "1,116 (15 Committee)" }
    ],
    highlight: "Major floating port community safeguarding large tracts of flooded forest on the Siem Reap river delta."
  },
  {
    id: "cfi-kaev-poar",
    type: "commune",
    nameEn: "Kaev Poar (Keo Por)",
    nameKh: "កែវពណ៌",
    communityName: "កែវពណ៌ (Kaev Poar)",
    provinceEn: "Siem Reap",
    provinceKh: "សៀមរាប",
    districtEn: "Puok",
    districtKh: "ពួក",
    lat: 13.2842,
    lng: 103.7651,
    stats: [
      { label: "Managed Area", value: "6,134 ha" },
      { label: "Conservation Zone", value: "10 ha" },
      { label: "Flooded Forest", value: "4,150 ha" },
      { label: "Community Members", value: "525 (216 Women)" }
    ],
    highlight: "Western Siem Reap lake margin community with active women-led fishery management."
  },
  {
    id: "cfi-peam-bang",
    type: "commune",
    nameEn: "Peam Bang",
    nameKh: "ពាមបាង",
    communityName: "ដូនស្តើង (Doun Sdaeng)",
    provinceEn: "Kampong Thom",
    provinceKh: "កំពង់ធំ",
    districtEn: "Stoung",
    districtKh: "ស្ទោង",
    lat: 12.8715,
    lng: 104.3852,
    stats: [
      { label: "Location", value: "Stoung River Mouth" },
      { label: "Flooded Forest", value: "1,036 ha" },
      { label: "Conservation Zone", value: "133 ha" },
      { label: "Community", value: "Doun Sdaeng CFi" }
    ],
    highlight: "Remote floating community bordering the Boeng Chhmar Core Area, vital for lake fishery surveillance."
  },
  {
    id: "cfi-phat-sanday",
    type: "commune",
    nameEn: "Phat Sanday",
    nameKh: "ផាត់សណ្តាយ",
    communityName: "ទួលនាងសាវ (Tuol Neang Sav)",
    provinceEn: "Kampong Thom",
    provinceKh: "កំពង់ធំ",
    districtEn: "Kampong Svay",
    districtKh: "កំពង់ស្វាយ",
    lat: 12.5370,
    lng: 104.4709,
    stats: [
      { label: "Managed Area", value: "1,229 ha" },
      { label: "Conservation Zone", value: "133 ha" },
      { label: "Flooded Forest", value: "1,036 ha" },
      { label: "Community Members", value: "671 (311 Women)" }
    ],
    highlight: "Strategic confluence community at the gateway to Stung Sen Ramsar Site with strong female leadership (6 women on committee)."
  },
  {
    id: "cfi-kampong-kou",
    type: "commune",
    nameEn: "Kampong Kou",
    nameKh: "កំពង់គោ",
    communityName: "កំពង់គោ (Kampong Kou)",
    provinceEn: "Kampong Thom",
    provinceKh: "កំពង់ធំ",
    districtEn: "Kampong Svay",
    districtKh: "កំពង់ស្វាយ",
    lat: 12.7482,
    lng: 104.8143,
    stats: [
      { label: "Managed Area", value: "2,925 ha" },
      { label: "Conservation Zone", value: "27 ha" },
      { label: "Flooded Forest", value: "525 ha" },
      { label: "Community Members", value: "1,147 (522 Women)" }
    ],
    highlight: "Vibrant inland wetland community with over 1,100 members actively stewarding fish conservation pools."
  },
  {
    id: "cfi-phlov-touk",
    type: "commune",
    nameEn: "Phlov Touk",
    nameKh: "ផ្លូវទូក",
    communityName: "ផ្លូវទូក (Phlov Touk)",
    provinceEn: "Kampong Chhnang",
    provinceKh: "កំពង់ឆ្នាំង",
    districtEn: "Kampong Leaeng",
    districtKh: "កំពង់លែង",
    lat: 12.5627,
    lng: 104.6137,
    stats: [
      { label: "Managed Area", value: "2,429 ha" },
      { label: "Conservation Zone", value: "24.4 ha" },
      { label: "Flooded Forest", value: "2,429 ha" },
      { label: "Community Members", value: "182 (72 Women)" }
    ],
    highlight: "Water-access village preserving critical floodplain vegetation across the southern lake basin."
  },
  {
    id: "cfi-chranouk",
    type: "commune",
    nameEn: "Chranouk",
    nameKh: "ច្រណូក",
    communityName: "ច្រណូក (Chranouk)",
    provinceEn: "Kampong Chhnang",
    provinceKh: "កំពង់ឆ្នាំង",
    districtEn: "Kampong Leaeng",
    districtKh: "កំពង់លែង",
    lat: 12.4312,
    lng: 104.7410,
    stats: [
      { label: "Managed Area", value: "20,570 ha" },
      { label: "Conservation Zone", value: "95 ha" },
      { label: "Flooded Forest", value: "8,000 ha" },
      { label: "Community Members", value: "270 (45 Women)" }
    ],
    highlight: "Expansive 20,570 ha territory guarding 8,000 ha of continuous flooded forest against encroachment."
  },
  {
    id: "cfi-raing-til",
    type: "commune",
    nameEn: "Raing Til",
    nameKh: "រាំងទិល",
    communityName: "រាំងទិល (Raing Til)",
    provinceEn: "Pursat",
    provinceKh: "ពោធិ៍សាត់",
    districtEn: "Kandieng",
    districtKh: "កណ្តៀង",
    lat: 12.7849,
    lng: 104.0071,
    stats: [
      { label: "Managed Area", value: "15,230 ha" },
      { label: "Conservation Zone", value: "28.5 ha" },
      { label: "Flooded Forest", value: "8,000 ha" },
      { label: "Community Members", value: "517 (269 Women)" }
    ],
    highlight: "Pursat's landmark floating community maintaining an 8,000 ha flooded forest green corridor."
  },
  {
    id: "cfi-me-tuek",
    type: "commune",
    nameEn: "Me Tuek",
    nameKh: "មេទឹក",
    communityName: "ព្រែកក្រ (Preek Kra)",
    provinceEn: "Pursat",
    provinceKh: "ពោធិ៍សាត់",
    districtEn: "Bakan",
    districtKh: "បាកាន",
    lat: 12.6954,
    lng: 103.7404,
    stats: [
      { label: "Managed Area", value: "101,062 ha" },
      { label: "Conservation Zone", value: "14 ha" },
      { label: "Flooded Forest", value: "101,062 ha" },
      { label: "Community Members", value: "557 (277 Women)" }
    ],
    highlight: "Largest community territory in the project (over 100,000 ha), defending extensive flooded wilderness."
  },
  {
    id: "cfi-prey-chas",
    type: "commune",
    nameEn: "Prey Chas",
    nameKh: "ព្រៃចាស់",
    communityName: "បាក់ព្រា (Bak Prea)",
    provinceEn: "Battambang",
    provinceKh: "បាត់ដំបង",
    districtEn: "Aek Phnum",
    districtKh: "ឯកភ្នំ",
    lat: 13.1180,
    lng: 103.5420,
    stats: [
      { label: "Managed Area", value: "10,036 ha" },
      { label: "Conservation Zone", value: "529 ha" },
      { label: "Flooded Forest", value: "10,036 ha" },
      { label: "Community Members", value: "283 (180 Women)" }
    ],
    highlight: "Over 500 ha dedicated fish sanctuary at the mouth of the Sangker River delta."
  },
  {
    id: "cfi-kaoh-chiveang",
    type: "commune",
    nameEn: "Kaoh Chiveang",
    nameKh: "កោះជីវាំង",
    communityName: "ព្រែកទាល់ (Prek Toal)",
    provinceEn: "Battambang",
    provinceKh: "បាត់ដំបង",
    districtEn: "Aek Phnum",
    districtKh: "ឯកភ្នំ",
    lat: 13.1950,
    lng: 103.6550,
    stats: [
      { label: "Managed Area", value: "2,320 ha" },
      { label: "Conservation Zone", value: "20,000 ha" },
      { label: "Flooded Forest", value: "2,320 ha" },
      { label: "Community Members", value: "700 (317 Women)" }
    ],
    highlight: "Direct frontline stewards protecting the Prek Toal Core Bird Sanctuary alongside community rangers."
  }
];

const provinces = [
  {
    id: "province-siem-reap",
    type: "province",
    nameEn: "Siem Reap Province",
    nameKh: "ខេត្តសៀមរាប",
    lat: 13.2500,
    lng: 104.0500,
    zoom: 10,
    targetCommunesCount: 3,
    communesList: ["Kampong Phluk", "Chong Khneas", "Kaev Poar"],
    highlight: "Northern shore featuring tourist gateways, stilted communities, and dense mangrove networks.",
    description: "Bordering the northern lake front, Siem Reap hosts three active community fisheries patrolling over 25,000 ha of combined flooded habitats."
  },
  {
    id: "province-kampong-thom",
    type: "province",
    nameEn: "Kampong Thom Province",
    nameKh: "ខេត្តកំពង់ធំ",
    lat: 12.7200,
    lng: 104.6000,
    zoom: 10,
    targetCommunesCount: 3,
    communesList: ["Peam Bang", "Phat Sanday", "Kampong Kou"],
    highlight: "Eastern heartland holding two UNESCO Biosphere Core Areas: Boeng Chhmar & Stung Sen.",
    description: "Home to expansive open water wetlands, peat swamps, and river delta forests of critical conservation priority."
  },
  {
    id: "province-kampong-chhnang",
    type: "province",
    nameEn: "Kampong Chhnang Province",
    nameKh: "ខេត្តកំពង់ឆ្នាំង",
    lat: 12.4200,
    lng: 104.7000,
    zoom: 10,
    targetCommunesCount: 2,
    communesList: ["Phlov Touk", "Chranouk"],
    highlight: "Southern funnel connecting the great lake directly into the Tonlé Sap River.",
    description: "Protects over 22,000 ha of water channels and seasonal floodplains essential for annual fish migration."
  },
  {
    id: "province-pursat",
    type: "province",
    nameEn: "Pursat Province",
    nameKh: "ខេត្តពោធិ៍សាត់",
    lat: 12.6500,
    lng: 103.9500,
    zoom: 10,
    targetCommunesCount: 2,
    communesList: ["Raing Til", "Me Tuek"],
    highlight: "Southwestern wilderness spanning over 115,000 ha of community-protected flooded forests.",
    description: "Known for floating villages like Raing Til and the vast pristine wetlands of Bakan district."
  },
  {
    id: "province-battambang",
    type: "province",
    nameEn: "Battambang Province",
    nameKh: "ខេត្តបាត់ដំបង",
    lat: 13.1200,
    lng: 103.6000,
    zoom: 10,
    targetCommunesCount: 2,
    communesList: ["Prey Chas", "Kaoh Chiveang"],
    highlight: "Northwestern cradle embracing the world-famous Prek Toal Core Bird Sanctuary.",
    description: "Home to the Sangker river delta and the dedicated community rangers who protect Southeast Asia's greatest waterbird colonies."
  }
];
