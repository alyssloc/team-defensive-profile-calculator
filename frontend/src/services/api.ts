import type { CalculationRequest, CalculationResponse } from '../types/pokemon';

const API_BASE_URL = '/api';

export const calculateTeamProfile = async (payload: CalculationRequest): Promise<CalculationResponse> => {
  const response = await fetch(`${API_BASE_URL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to calculate defensive profile');
  }

  return response.json();
};