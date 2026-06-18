import React, { useState } from 'react';
import { calculateTeamProfile } from '../services/api';
import type { PokemonInput, TypeScoreResult, CalculationRequest } from '../types/pokemon';

const ALL_POKEMON_TYPES = [
  "null", "Normal", "Fire", "Water", "Electric", "Grass", "Ice", 
  "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", 
  "Rock", "Ghost", "Dragon", "Steel", "Dark", "Fairy"
];

export default function TeamCalculator() {
  const [generation, setGeneration] = useState<number>(6);
  const [team, setTeam] = useState<PokemonInput[]>(
    Array(6).fill(null).map(() => ({ type1: 'null', type2: 'null' }))
  );
  const [results, setResults] = useState<TypeScoreResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAvailableTypes = () => {
    if (generation === 1) {
      return ALL_POKEMON_TYPES.filter(
        type => type !== "Steel" && type !== "Dark" && type !== "Fairy"
      );
    }
    if (generation === 2) {
      return ALL_POKEMON_TYPES.filter(type => type !== "Fairy");
    }
    return ALL_POKEMON_TYPES;
  };

  const availableTypes = getAvailableTypes();

  const handleTypeChange = (index: number, field: 'type1' | 'type2', value: string) => {
    const updatedTeam = [...team];
    updatedTeam[index][field] = value;
    setTeam(updatedTeam);
  };

  const handleGenerationChange = (gen: number) => {
    setGeneration(gen);
    
    const sanitizedTeam = team.map(pkmn => {
      let t1 = pkmn.type1;
      let t2 = pkmn.type2;

      if (gen === 1) {
        if (t1 === "Fairy" || t1 === "Dark" || t1 === "Steel") t1 = "null";
        if (t2 === "Fairy" || t2 === "Dark" || t2 === "Steel") t2 = "null";
      } else if (gen === 2) {
        if (t1 === "Fairy") t1 = "null";
        if (t2 === "Fairy") t2 = "null";
      }
      
      return { type1: t1, type2: t2 };
    });

    setTeam(sanitizedTeam);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CalculationRequest = {
        generation: generation,
        team: team.map(p => ({
          type1: p.type1,
          type2: p.type2
        }))
      };

      const data = await calculateTeamProfile(payload);
      setResults(data.results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setResults(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div 
      className="retro-theme"
      style={{ 
        maxWidth: '550px', 
        margin: '6vh auto 0', 
        padding: '10px',
      }}
    >
      <h1 style={{ 
        textAlign: 'center', 
        color: '#000000', 
        marginBottom: '25px', 
        fontSize: '1.2rem',   
        lineHeight: '1.4',
      }}>
        Defensive Profile
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Generation Selection */}
        <div className="retro-box" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <label style={{ marginRight: '10px', fontSize: '0.9rem' }}>
            Generation:
          </label>
          <select 
            className="retro-select"
            value={generation} 
            onChange={(e) => handleGenerationChange(Number(e.target.value))}>
            <option value={1}>Gen 1 (RBY)</option>
            <option value={2}>Gen 2 - 5</option>
            <option value={6}>Gen 6+ (XY-SV)</option>
          </select>
        </div>

        <h2 style={{ color: '#000000', marginBottom: '20px', fontSize: '1.2rem' }}>
          YOUR TEAM
        </h2>
        
        {/* 6 Team Member Slots */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          {team.map((pokemon, idx) => (
            <div 
              key={idx} 
              className="retro-box"
              style={{ textAlign: 'center' }}
            >
              <span style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>
                SLOT {idx + 1}
              </span>
              <div>
                <select 
                  className="retro-select"
                  value={pokemon.type1} 
                  onChange={(e) => handleTypeChange(idx, 'type1', e.target.value)}
                >
                  {availableTypes.map(t => (
                    <option key={t} value={t}>{t === "null" ? "—EMPTY—" : t.toUpperCase()}</option>
                  ))}
                </select>

                <select 
                  className="retro-select"
                  value={pokemon.type2} 
                  onChange={(e) => handleTypeChange(idx, 'type2', e.target.value)}
                >
                  {availableTypes.map(t => (
                    <option key={t} value={t}>{t === "null" ? "—EMPTY—" : t.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            disabled={loading} 
            className="retro-button"
          >
            {loading ? 'ANALYZING...' : 'CALCULATE'}
          </button>
        </div>
      </form>

      {/* Error Output */}
      {error && (
        <div className="retro-box" style={{ color: 'red', marginTop: '30px', textAlign: 'center' }}>
          ERROR: {error}
        </div>
      )}

      {/* Profile Results Grid */}
      {results && (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ color: '#6F2DA8', marginBottom: '20px', fontSize: '1.2rem' }}>
            RESULTS
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
            {results.map((res) => {
              let netModifiers = res.score;
              let immunityCount = 0;

              if (netModifiers <= -500) {
                while (netModifiers <= -500) {
                  immunityCount++;
                  netModifiers += 1000;
                }
              }

              let textColor = '#000000';
              let displayValue = '';

              if (immunityCount > 0) {
                textColor = '#6F2DA8'; 
                displayValue = immunityCount > 1 ? `Immune x${immunityCount}` : 'Immune';
              } 
              else {
                if (netModifiers === 1) {
                  textColor = '#bd2130'; 
                  displayValue = '2x Weak';
                } else if (netModifiers === 2) {
                  textColor = '#bd2130';
                  displayValue = '4x Weak';
                } else if (netModifiers > 2) {
                  textColor = '#bd2130';
                  displayValue = `${netModifiers}x Weak`; 
                } else if (netModifiers === -1) {
                  textColor = '#1e7e34'; 
                  displayValue = '2x Resist';
                } else if (netModifiers === -2) {
                  textColor = '#1e7e34';
                  displayValue = '4x Resist';
                } else if (netModifiers < -2) {
                  textColor = '#1e7e34';
                  displayValue = `${Math.abs(netModifiers)}x Resist`; 
                } else {
                  displayValue = 'Neutral'; 
                }
              }

              return (
                <div key={res.type} className="retro-box" style={{ textAlign: 'center', padding: '10px' }}>
                  <div style={{ fontSize: '0.8rem', marginBottom: '10px' }}>{res.type.toUpperCase()}</div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    color: textColor 
                  }}>
                    {displayValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}