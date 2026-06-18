#pragma once
#include "types.hpp"
#include "multiplier.hpp"
#include "info.hpp"

class Pokemon
{
public:
    Pokemon(Info info_in, std::pair<Type, Type> types_in);
    void populate_multipliers();
    void pokemon_output(const int &num);
    int get_num_types();
    Multiplier get_weakness(Type type);
    Type get_type_one();
    Type get_type_two();

private:
    Info info;
    Type type_one;
    Type type_two;
    std::vector<std::pair<Type, Multiplier>> defensive_profile;
};