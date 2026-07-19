export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl: string;
  role: string;
  points: number;
  impactMetrics: {
    co2Saved: number;
    wasteRecycled: number;
    waterSaved: number;
    treesPlanted: number;
  };
}

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
  isDemoMode?: boolean;
}

export interface WasteRecord {
  id: string;
  type: 'Organic' | 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste' | 'Hazardous';
  weight: number;
  points: number;
  co2Impact: number;
  date: string;
}

export interface EnergyRecord {
  id: string;
  type: string;
  value: number;
  unit: string;
  carbonAvoided: number;
  date: string;
}

export interface WaterRecord {
  id: string;
  consumption: number;
  rwhYield: number;
  leaksSimulated: number;
  date: string;
}

export interface EnvironmentRecord {
  id: string;
  aqi: number;
  co2: number;
  humidity: number;
  temperature: number;
  noise: number;
  date: string;
}

export interface UtilityRecord {
  id: string;
  electricity: number;
  water: number;
  gas: number;
  date: string;
}

export interface ManufacturingRecord {
  id: string;
  rawMaterial: number;
  scrapRate: number;
  carbonEfficiency: number;
  co2Emissions: number;
  date: string;
}

export interface PackagingRecord {
  id: string;
  original: string;
  greenAlt: string;
  costChange: number;
  score: number;
  date: string;
}

export interface InfrastructureRecord {
  id: string;
  treesTracked: number;
  canopyArea: number;
  offsetKgs: number;
  status: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  type: string;
  status: string;
  score: number;
  summary: string;
  createdAt: string;
}
