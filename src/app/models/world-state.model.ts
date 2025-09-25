export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ResourceDeposit {
  id: string;
  type: string;
  polygon: Coordinate[];
  remaining: number;
  countryId?: string | null;
}

export interface Conflict {
  id: string;
  type: string;
  regionId: string;
  status: string;
  participants: unknown;
  notes?: string;
}

export interface Facility {
  id: string;
  type: string;
  locationId: string;
  status: string;
  countryId?: string | null;
}

export interface FlagBorder {
  id: string;
  borderId: string;
  latitude: number;
  longitude: number;
  status: string;
  countryId: string;
}

export interface TradeOrder {
  id: string;
  resourceId: string;
  type: string;
  quantity: number;
  pricePerUnit: number;
  status: string;
  countryId: string;
}

export interface WorldStateData {
  terrainLayer: string;
  deposits: ResourceDeposit[];
  conflicts: Conflict[];
  facilities: Facility[];
  tradeOrders: TradeOrder[];
  borders: FlagBorder[];
  tradeRoutes: unknown[];
}
