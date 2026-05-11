// Real geographic data for Chishui City resource map
// Town center coordinates from Tencent Maps API (WGS84)
// City boundary from DataV API (WGS84)

// Town center coordinates (WGS84) from Tencent Maps API
export interface TownData {
  name: string;
  color: string;
  area: number;
  farmers: number;
  production: number;
  bases: number;
  factories: number;
  warehouses: number;
  highlight: string;
  /** WGS84 longitude */
  lng: number;
  /** WGS84 latitude */
  lat: number;
}

export interface ResourceItem {
  name: string;
  /** WGS84 longitude */
  lng: number;
  /** WGS84 latitude */
  lat: number;
  type: 'base' | 'factory' | 'warehouse';
  value: number;
  description: string;
  town: string;
}

// All 17 administrative divisions of Chishui City
// Center coordinates from Tencent Maps API (WGS84)
// Note: 市中/文华/金华 are urban subdistricts - grouped under main city area
export const TOWN_DATA: TownData[] = [
  // ── Urban subdistricts (main city area) ──
  {
    name: '市中街道',
    color: '#cc785c',
    area: 1200, farmers: 74, production: 38, bases: 1, factories: 0, warehouses: 0,
    highlight: '城市中心区',
    lng: 105.69467, lat: 28.58885,
  },
  {
    name: '文华街道',
    color: '#c64545',
    area: 1100, farmers: 68, production: 35, bases: 1, factories: 0, warehouses: 0,
    highlight: '城市文教区',
    lng: 105.703711, lat: 28.580521,
  },
  {
    name: '金华街道',
    color: '#9070c0',
    area: 900, farmers: 56, production: 28, bases: 0, factories: 1, warehouses: 0,
    highlight: '产业集聚区',
    lng: 105.726913, lat: 28.589938,
  },
  // ── Rural towns ──
  {
    name: '天台镇',
    color: '#7a9a60',
    area: 2600, farmers: 158, production: 78, bases: 1, factories: 1, warehouses: 0,
    highlight: '近郊农业与旅游',
    lng: 105.755446, lat: 28.56242,
  },
  {
    name: '复兴镇',
    color: '#8e8b82',
    area: 2800, farmers: 172, production: 82, bases: 1, factories: 1, warehouses: 1,
    highlight: '历史文化名镇',
    lng: 105.743532, lat: 28.515653,
  },
  {
    name: '大同镇',
    color: '#e8a55a',
    area: 4200, farmers: 265, production: 150, bases: 2, factories: 2, warehouses: 1,
    highlight: '合作社种植联盟',
    lng: 105.681299, lat: 28.504634,
  },
  {
    name: '旺隆镇',
    color: '#5db8a6',
    area: 5800, farmers: 341, production: 210, bases: 3, factories: 2, warehouses: 1,
    highlight: '标准化种植示范',
    lng: 105.890139, lat: 28.515186,
  },
  {
    name: '葫市镇',
    color: '#5db872',
    area: 3900, farmers: 240, production: 122, bases: 2, factories: 1, warehouses: 1,
    highlight: '高山中药材种植',
    lng: 105.93891, lat: 28.480249,
  },
  {
    name: '元厚镇',
    color: '#a07040',
    area: 3500, farmers: 218, production: 108, bases: 2, factories: 1, warehouses: 1,
    highlight: '红色旅游与种植',
    lng: 105.940302, lat: 28.363808,
  },
  {
    name: '官渡镇',
    color: '#5090b0',
    area: 8600, farmers: 528, production: 320, bases: 5, factories: 3, warehouses: 2,
    highlight: '石斛核心产区',
    lng: 106.090907, lat: 28.549239,
  },
  {
    name: '长期镇',
    color: '#5db872',
    area: 12000, farmers: 762, production: 480, bases: 8, factories: 4, warehouses: 3,
    highlight: '省级现代产业园',
    lng: 106.058144, lat: 28.625187,
  },
  {
    name: '长沙镇',
    color: '#b08070',
    area: 2300, farmers: 142, production: 68, bases: 1, factories: 1, warehouses: 1,
    highlight: '河谷种植带',
    lng: 105.993807, lat: 28.688915,
  },
  {
    name: '丙安镇',
    color: '#c64545',
    area: 3100, farmers: 189, production: 95, bases: 2, factories: 1, warehouses: 1,
    highlight: '林下仿野生种植',
    lng: 105.815568, lat: 28.470787,
  },
  {
    name: '两河口镇',
    color: '#6b9a8a',
    area: 4100, farmers: 255, production: 135, bases: 3, factories: 1, warehouses: 1,
    highlight: '生态旅游与种植',
    lng: 105.755946, lat: 28.382663,
  },
  {
    name: '宝源乡',
    color: '#a0c0a0',
    area: 2100, farmers: 130, production: 65, bases: 1, factories: 0, warehouses: 0,
    highlight: '生态林下种植',
    lng: 105.66408, lat: 28.371739,
  },
  {
    name: '石堡乡',
    color: '#708090',
    area: 1200, farmers: 74, production: 38, bases: 1, factories: 0, warehouses: 0,
    highlight: '高山生态保护区',
    lng: 106.171374, lat: 28.497854,
  },
  {
    name: '白云乡',
    color: '#9070c0',
    area: 2400, farmers: 148, production: 72, bases: 1, factories: 0, warehouses: 0,
    highlight: '林下中药材基地',
    lng: 105.967592, lat: 28.692371,
  },
];

// Resource points with real WGS84 coordinates
// Coordinates are estimated based on known locations within each town
export const RESOURCE_DATA: ResourceItem[] = [
  // 官渡镇 (lng: 105.728-106.148, lat: 28.485-28.625)
  {
    name: '官渡镇石斛林下经济示范园',
    lng: 105.715, lat: 28.545,
    type: 'base', value: 3200, description: '核心种植区，三年生金钗石斛',
    town: '官渡镇',
  },
  {
    name: '官渡镇石斛初加工厂',
    lng: 105.730, lat: 28.555,
    type: 'factory', value: 800, description: '日处理鲜条 2 吨',
    town: '官渡镇',
  },
  {
    name: '赤水金钗石斛7S产地仓',
    lng: 105.740, lat: 28.538,
    type: 'warehouse', value: 1200, description: '库容 500 吨',
    town: '官渡镇',
  },
  // 长期镇 (lng: 105.98-106.15, lat: 28.55-28.70)
  {
    name: '长期镇石斛产业园',
    lng: 106.050, lat: 28.618,
    type: 'base', value: 4500, description: '省级现代农业产业园',
    town: '长期镇',
  },
  {
    name: '长期镇石斛深加工基地',
    lng: 106.060, lat: 28.625,
    type: 'factory', value: 1500, description: '枫斗、石斛粉，原浆生产线',
    town: '长期镇',
  },
  {
    name: '赤水金钗石斛7S产地仓',
    lng: 106.045, lat: 28.632,
    type: 'warehouse', value: 2000, description: '省级示范产地仓',
    town: '长期镇',
  },
  {
    name: '长期镇生态种植基地',
    lng: 106.035, lat: 28.608,
    type: 'base', value: 2800, description: '有机石斛种植',
    town: '长期镇',
  },
  // 大同镇 (lng: 105.63-105.73, lat: 28.47-28.54)
  {
    name: '大同镇石斛合作社种植基地',
    lng: 105.672, lat: 28.508,
    type: 'base', value: 2100, description: '合作社统一种植管理',
    town: '大同镇',
  },
  {
    name: '大同镇石斛烘干中心',
    lng: 105.683, lat: 28.515,
    type: 'factory', value: 600, description: '热风循环烘干',
    town: '大同镇',
  },
  // 旺隆镇 (lng: 105.84-105.96, lat: 28.47-28.56)
  {
    name: '旺隆镇石斛种植园',
    lng: 105.882, lat: 28.512,
    type: 'base', value: 1800, description: '标准化示范种植基地',
    town: '旺隆镇',
  },
  {
    name: '旺隆镇石斛加工中心',
    lng: 105.895, lat: 28.520,
    type: 'factory', value: 450, description: '初加工车间',
    town: '旺隆镇',
  },
  // 丙安镇 (lng: 105.78-105.87, lat: 28.43-28.51)
  {
    name: '丙安镇石斛示范园',
    lng: 105.810, lat: 28.468,
    type: 'base', value: 950, description: '林下仿野生种植基地',
    town: '丙安镇',
  },
  {
    name: '丙安镇石斛体验工坊',
    lng: 105.822, lat: 28.475,
    type: 'factory', value: 200, description: 'DIY 枫斗制作体验',
    town: '丙安镇',
  },
  {
    name: '丙安镇产地仓',
    lng: 105.815, lat: 28.462,
    type: 'warehouse', value: 380, description: '小型冷链仓储',
    town: '丙安镇',
  },
  // 两河口镇 (lng: 105.70-105.82, lat: 28.33-28.43)
  {
    name: '两河口镇石斛林下基地',
    lng: 105.750, lat: 28.378,
    type: 'base', value: 1650, description: '生态林下种植',
    town: '两河口镇',
  },
  {
    name: '两河口镇加工中心',
    lng: 105.760, lat: 28.388,
    type: 'factory', value: 420, description: '初加工与分级',
    town: '两河口镇',
  },
  // 葫市镇 (lng: 105.88-105.99, lat: 28.43-28.53)
  {
    name: '葫市镇高山药材基地',
    lng: 105.930, lat: 28.478,
    type: 'base', value: 1900, description: '高山生态种植区',
    town: '葫市镇',
  },
  {
    name: '葫市镇中药材产地仓',
    lng: 105.942, lat: 28.488,
    type: 'warehouse', value: 650, description: '高山冷链仓储',
    town: '葫市镇',
  },
  // 元厚镇 (lng: 105.88-106.01, lat: 28.31-28.42)
  {
    name: '元厚镇红色老区种植基地',
    lng: 105.935, lat: 28.360,
    type: 'base', value: 1200, description: '红色旅游+种植',
    town: '元厚镇',
  },
  // 天台镇 (lng: 105.71-105.81, lat: 28.52-28.60)
  {
    name: '天台镇近郊农业种植园',
    lng: 105.750, lat: 28.558,
    type: 'base', value: 800, description: '近郊标准化种植',
    town: '天台镇',
  },
  // 复兴镇 (lng: 105.70-105.79, lat: 28.48-28.55)
  {
    name: '复兴镇石斛文化园',
    lng: 105.738, lat: 28.512,
    type: 'base', value: 650, description: '文旅融合种植示范',
    town: '复兴镇',
  },
  {
    name: '复兴镇加工体验中心',
    lng: 105.745, lat: 28.520,
    type: 'factory', value: 280, description: '手工枫斗体验',
    town: '复兴镇',
  },
  // 长沙镇 (lng: 105.93-106.06, lat: 28.63-28.74)
  {
    name: '长沙镇河谷种植带',
    lng: 105.988, lat: 28.685,
    type: 'base', value: 1100, description: '河谷气候特色种植',
    town: '长沙镇',
  },
  {
    name: '长沙镇产地仓',
    lng: 105.998, lat: 28.692,
    type: 'warehouse', value: 420, description: '河谷冷链中心',
    town: '长沙镇',
  },
  // 白马镇 - skipped (merged into 元厚镇 in current admin division)
  // 宝源乡 (lng: 105.61-105.72, lat: 28.32-28.42)
  {
    name: '宝源乡生态林下种植基地',
    lng: 105.660, lat: 28.368,
    type: 'base', value: 920, description: '生态林下经济',
    town: '宝源乡',
  },
  // 白云乡 (lng: 105.90-106.04, lat: 28.64-28.74)
  {
    name: '白云乡林下中药材基地',
    lng: 105.962, lat: 28.688,
    type: 'base', value: 1050, description: '林下中药材复合种植',
    town: '白云乡',
  },
  {
    name: '白云乡生态加工点',
    lng: 105.972, lat: 28.695,
    type: 'factory', value: 180, description: '小型生态加工',
    town: '白云乡',
  },
  // 石堡乡 (lng: 106.10-106.24, lat: 28.44-28.56)
  {
    name: '石堡乡高山生态保护区药材基地',
    lng: 106.165, lat: 28.494,
    type: 'base', value: 560, description: '高山珍稀药材',
    town: '石堡乡',
  },
];

// Export as named exports for convenience
export const towns = TOWN_DATA;
export const resources = RESOURCE_DATA;
