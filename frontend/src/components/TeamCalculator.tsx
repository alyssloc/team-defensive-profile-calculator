import React, { useState, useSyncExternalStore, useCallback } from 'react';
import { calculateTeamProfile } from '../services/api';
import type { PokemonInput, TypeScoreResult, CalculationRequest } from '../types/pokemon';


const ALL_POKEMON_TYPES = [
  "null", "Normal", "Fire", "Water", "Electric", "Grass", "Ice", 
  "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", 
  "Rock", "Ghost", "Dragon", "Steel", "Dark", "Fairy"
];

const DEFAULT_RESULTS: TypeScoreResult[] = [
  { type: 'Normal', score: 0 }, { type: 'Fire', score: 0 },
  { type: 'Water', score: 0 }, { type: 'Electric', score: 0 },
  { type: 'Grass', score: 0 }, { type: 'Ice', score: 0 },
  { type: 'Fighting', score: 0 }, { type: 'Poison', score: 0 },
  { type: 'Ground', score: 0 }, { type: 'Flying', score: 0 },
  { type: 'Psychic', score: 0 }, { type: 'Bug', score: 0 },
  { type: 'Rock', score: 0 }, { type: 'Ghost', score: 0 },
  { type: 'Dragon', score: 0 }, { type: 'Steel', score: 0 },
  { type: 'Dark', score: 0 }, { type: 'Fairy', score: 0 },
];


function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function TeamCalculator() {
  const [generation, setGeneration] = useState<number>(6);
  const [team, setTeam] = useState<PokemonInput[]>(
    Array(6).fill(null).map(() => ({ type1: 'null', type2: 'null' }))
  );
  const [results, setResults] = useState<TypeScoreResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isLargeScreen = useMediaQuery('(min-width: 768px)');

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
      className="calculator-container has-results"
      style={{ 
        margin: '6vh auto 0', 
        padding: '10px',
      }}
    >
      {/* title */}
      <h1 style={{ 
        textAlign: 'center', 
        color: '#000000', 
        marginBottom: '30px', 
        fontSize: '2rem',   
        lineHeight: '1.2',
        letterSpacing: '1px'
      }}>
        Defensive Profile
      </h1>

      {/* gen selection */}
      <div 
        className="calculator-box" 
        style={{ 
          display: 'block',
          width: 'fit-content',
          margin: '0 auto 30px auto', 
          textAlign: 'center' 
        }}
      >
        <label style={{ marginRight: '10px', fontSize: '0.9rem' }}>
          Generation:
        </label>
        <select 
          className="calculator-select"
          value={generation} 
          onChange={(e) => handleGenerationChange(Number(e.target.value))}>
          <option value={1}>Gen 1 (RBY)</option>
          <option value={2}>Gen 2 - 5</option>
          <option value={6}>Gen 6+ (XY-SV)</option>
        </select>
      </div>
      
      <div 
        className="calculator-layout" style={{ 
          display: 'flex', 
          flexDirection: isLargeScreen ? 'row' : 'column', 
          gap: '40px', 
          alignItems: 'flex-start' 
        }}
      >
        {/* left: inputs */}
        <div 
          className="calculator-form-side" style={{ 
            flex: isLargeScreen ? '1 1 350px' : '1 1 auto',
            width: '100%',
            maxWidth: isLargeScreen ? '450px' : 'none' 
          }} >

          <form onSubmit={handleSubmit}>
            <h2 style={{ color: '#000000', marginBottom: '20px', fontSize: '1.2rem', marginTop: 0 }}>
              YOUR TEAM
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              {team.map((pokemon, idx) => (
                <div 
                  key={idx} 
                  className="calculator-box"
                  style={{ textAlign: 'center' }}
                >
                  <span style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>
                    SLOT {idx + 1}
                  </span>
                  <div>
                    <select 
                      className="calculator-select"
                      value={pokemon.type1} 
                      onChange={(e) => handleTypeChange(idx, 'type1', e.target.value)}
                    >
                      {availableTypes.map(t => (
                        <option key={t} value={t}>{t === "null" ? "—EMPTY—" : t.toUpperCase()}</option>
                      ))}
                    </select>

                    <select 
                      className="calculator-select"
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
                className="calculator-button"
              >
                {loading ? 'ANALYZING...' : 'CALCULATE'}
              </button>
            </div>
          </form>
        </div>


        {/* right side (Always rendered to prevent layout shift) */}
        <div 
          className="calculator-results-side" style={{
              flex: isLargeScreen ? '2 1 450px' : '1 1 auto',
              width: '100%'
            }}
          >
            <h2 style={{ color: '#6F2DA8', marginBottom: '20px', fontSize: '1.2rem', marginTop: 0 }}>
              RESULTS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
              {(results || DEFAULT_RESULTS).map((res) => {
                let netModifiers = res.score;
                let immunityCount = 0;

                  if (netModifiers <= -500) {
                    while (netModifiers <= -500) {
                      immunityCount++;
                      netModifiers += 1000;
                    }
                  }

                  let textColor = '#000000';
                  let displayValue = results ? 'Neutral' : '--';

                  if (immunityCount > 0) {
                    textColor = '#6F2DA8'; 
                    displayValue = 'Immune';
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
                    }
                  }

                  return (
                    <div key={res.type} className="calculator-box" style={{ textAlign: 'center', padding: '10px' }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        marginBottom: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px' 
                      }}>
                        <span>{res.type.toUpperCase()}</span>
                        <img 
                          src={`/types/${res.type.toLowerCase()}.png`} 
                          alt={res.type} 
                          style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                        />
                      </div>
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
            {/* error output located beneath results */}
            {error && (
              <div className="calculator-box error-box" style={{ color: '#bd2130', marginTop: '20px', textAlign: 'center' }}>
                ERROR: {error}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}