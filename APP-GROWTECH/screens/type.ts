export type Plant = {
    id: string;
    name: string;
    idealConditions?: {
      temperature: { min: number; max: number };
      soilHumidity: { min: number; max: number };
      uvIndex: { max: number };
      color: { red: number; green: number; blue: number };
    };
  };
  
  export type RootStackParamList = {
    Home: undefined;
    PlantSelection: undefined;
    Monitor: { plant: Plant };
  };