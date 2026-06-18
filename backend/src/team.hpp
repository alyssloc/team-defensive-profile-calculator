#pragma once
#include <vector>
#include <unordered_map>
#include "pokemon.hpp"
class Team
{
public:
    Team(std::vector<Pokemon> pokemon_in);
    void print_pokemon_info();
    void populate_team_profile();
    void output_team_profile();
    std::unordered_map<Type, int> get_defensive_profile();

private:
    
    std::vector<Pokemon> pokemon;
    //std::vector<std::pair<Type, Multiplier>> defensive_profile;
    std::unordered_map<Type, int> defensive_profile;
    //std::unordered_map<Type, int> strenghts;
    //std::unordered_map<Type, int> immunities;
};