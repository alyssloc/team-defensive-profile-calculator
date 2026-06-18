export interface PokemonInput {
  type1: string; 
  type2: string;
}

export interface CalculationRequest {
  generation: number;
  team: PokemonInput[]; 
}

export interface TypeScoreResult {
  type: string;
  score: number;
}

export interface CalculationResponse {
  results: TypeScoreResult[];
}