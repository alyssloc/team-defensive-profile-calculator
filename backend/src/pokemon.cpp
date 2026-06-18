#include "pokemon.hpp"
#include "start.hpp"
#include "utilities.hpp"
#include <utility>
#include <iostream>
#include <algorithm>

Pokemon::Pokemon(Info info_in, std::pair<Type, Type> types_in) : info(info_in), type_one(types_in.first), type_two(types_in.second)
{
    populate_multipliers();
};

int Pokemon::get_num_types()
{
    return info.num_types;
}

Type Pokemon::get_type_one() 
{
    return type_one;
}

Type Pokemon::get_type_two() 
{
    return type_two;
}

Multiplier Pokemon::get_weakness(Type type)
{
    for (const auto& pair : defensive_profile) {
        if (pair.first == type) {
            return pair.second;
        }
    }
    return Multiplier::Neutral;
}

void Pokemon::populate_multipliers()
{
    for (int j = 0; j < info.num_types; ++j)
    {
        double total_weakness = info.type_chart[j][static_cast<int>(type_one)];
        if (type_two != Type::Null)
            total_weakness *= info.type_chart[j][static_cast<int>(type_two)];
        Multiplier mult = weakness_level(total_weakness);
        defensive_profile.push_back(std::make_pair(static_cast<Type>(j), mult));
    }
}

void Pokemon::pokemon_output(const int &num)
{
    // sorting by defensive type from strongest to weakest (very weak -> immune)
    std::sort(defensive_profile.begin(), defensive_profile.end(), [](const auto &a, const auto &b)
              { return static_cast<int>(a.second) < static_cast<int>(b.second); });

    std::cout << "---------------------------------------------------------\n";
    std::cout << "Defensive Profile of Pokemon #" << num << ":\n";
    for (int i = 0; i < info.num_types; ++i)
    {
        std::cout << "Type: " << type_to_string(defensive_profile[i].first)
                  << ", Multiplier: " << multiplier_to_string(defensive_profile[i].second)
                  << "\n";
    }
}