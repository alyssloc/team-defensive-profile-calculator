#include "team.hpp"
#include "utilities.hpp"
#include <iostream>
#include <algorithm>

Team::Team(std::vector<Pokemon> pokemon_in) : pokemon(pokemon_in) {};

void Team::print_pokemon_info()
{
    std::cout << "Printing the Defensive Profile for Each Pokemon on Your Team\n";
    for (int i = 0; i < static_cast<int>(pokemon.size()); ++i)
    {
        // if both types are null, don't output this profile
        if (pokemon[i].get_type_one() == Type::Null && pokemon[i].get_type_two() == Type::Null)
            continue;

        pokemon[i].pokemon_output(i + 1);
    }
}

void Team::populate_team_profile()
{
    // first need to populate pokemon defensive profile
    if (pokemon.empty())
        return;

    int num_types = 0;
    for (auto &pkmn : pokemon)
    {
        if (pkmn.get_type_one() != Type::Null || pkmn.get_type_two() != Type::Null)
        {
            num_types = pkmn.get_num_types();
            break;
        }
    }

    if (num_types == 0)
        return;

    for (int i = 0; i < static_cast<int>(pokemon.size()); ++i)
    {
        if (pokemon[i].get_type_one() == Type::Null && pokemon[i].get_type_two() == Type::Null)
            continue;
            
        for (int j = 0; j < num_types; ++j)
        {
            Multiplier mult = pokemon[i].get_weakness(static_cast<Type>(j));
            defensive_profile[static_cast<Type>(j)] += multiplier_to_int(mult);
        }
    }
}

void Team::output_team_profile()
{
    std::cout << "---------------------------------------------------------\n";
    std::cout << "Now Outputting Your Team's Overall Defensive Profile.....\n";

    // putting into vector to sort from very weak -> immune
    std::vector<std::pair<Type, int>> sorted(defensive_profile.begin(), defensive_profile.end());
    std::sort(sorted.begin(), sorted.end(), [](const auto &a, const auto &b)
              { return a.second < b.second; });

    for (const auto &[type, mult] : sorted)
    {
        std::cout << weakness_level_output(type_to_string(type), mult) << "\n";
    }
}

std::unordered_map<Type, int> Team::get_defensive_profile()
{
    return defensive_profile;
}