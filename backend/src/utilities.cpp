#include <cmath>
#include <string>
#include <unordered_map>
#include <algorithm>
#include "utilities.hpp"

bool double_comparison(double a, double b, double epsilon)
{
    return std::abs(a - b) < epsilon;
}

Multiplier weakness_level(double total_weakness)
{
    // immunity
    if (total_weakness == 0)
    {
        return Multiplier::Immune;
    }
    // 4x resist
    else if (double_comparison(total_weakness, 0.25))
    {
        return Multiplier::veryStrong;
    }
    // 2x resist
    else if (double_comparison(total_weakness, 0.5))
    {
        return Multiplier::Strong;
    }
    // 2x weakness
    else if (total_weakness == 2)
    {
        return Multiplier::Weak;
    }
    // 4x weakness
    else if (total_weakness == 4)
    {
        return Multiplier::veryWeak;
    }
    else
    {
        return Multiplier::Neutral;
    }
}

std::pair<Type, Type> string_to_type(const std::pair<std::string, std::string> &input)
{
    static const std::unordered_map<std::string, Type> typeMap = {
        {"normal", Type::Normal},
        {"fire", Type::Fire},
        {"water", Type::Water},
        {"electric", Type::Electric},
        {"grass", Type::Grass},
        {"ice", Type::Ice},
        {"fighting", Type::Fighting},
        {"poison", Type::Poison},
        {"ground", Type::Ground},
        {"flying", Type::Flying},
        {"psychic", Type::Psychic},
        {"bug", Type::Bug},
        {"rock", Type::Rock},
        {"ghost", Type::Ghost},
        {"dragon", Type::Dragon},
        {"dark", Type::Dark},
        {"steel", Type::Steel},
        {"fairy", Type::Fairy},
        {"null", Type::Null}};

    std::string str1 = input.first;
    std::string str2 = input.second;
    std::transform(str1.begin(), str1.end(), str1.begin(), ::tolower);
    std::transform(str2.begin(), str2.end(), str2.begin(), ::tolower);

    auto type_one = typeMap.find(str1);
    auto type_two = typeMap.find(str2);

    Type t1 = (type_one != typeMap.end()) ? type_one->second : Type::Null;
    Type t2 = (type_two != typeMap.end()) ? type_two->second : Type::Null;

    return std::make_pair(t1, t2);
}

std::string type_to_string(const Type &input)
{
    static const std::unordered_map<Type, std::string> typeMap = {
        {Type::Normal, "normal"},
        {Type::Fire, "fire"},
        {Type::Water, "water"},
        {Type::Electric, "electric"},
        {Type::Grass, "grass"},
        {Type::Ice, "ice"},
        {Type::Fighting, "fighting"},
        {Type::Poison, "poison"},
        {Type::Ground, "ground"},
        {Type::Flying, "flying"},
        {Type::Psychic, "psychic"},
        {Type::Bug, "bug"},
        {Type::Rock, "rock"},
        {Type::Ghost, "ghost"},
        {Type::Dragon, "dragon"},
        {Type::Dark, "dark"},
        {Type::Steel, "steel"},
        {Type::Fairy, "fairy"},
        {Type::Null, "null"}};

    auto type = typeMap.find(input);
    if (type == typeMap.end())
    {
        return "null";
    }

    return type->second;
}

std::string multiplier_to_string(const Multiplier &input)
{
    static const std::unordered_map<Multiplier, std::string> multiplierMap = {
        {Multiplier::veryWeak, "4x Weakness"},
        {Multiplier::Weak, "2x Weakness"},
        {Multiplier::Neutral, "Neutral Damage"},
        {Multiplier::Strong, "2x Resistance"},
        {Multiplier::veryStrong, "4x Resistance"},
        {Multiplier::Immune, "Immunity"}};

    auto it = multiplierMap.find(input);

    if (it == multiplierMap.end())
    {
        return "Neutral Damage";
    }
    return it->second;
}

int multiplier_to_int(const Multiplier &input)
{
    static const std::unordered_map<Multiplier, int> multiplierMap = {
        {Multiplier::veryWeak, 2},
        {Multiplier::Weak, 1},
        {Multiplier::Neutral, 0},
        {Multiplier::Strong, -1},
        {Multiplier::veryStrong, -2},
        {Multiplier::Immune, -1000}};

    auto it = multiplierMap.find(input);

    if (it == multiplierMap.end())
    {
        return 0;
    }
    return it->second;
}

std::string weakness_level_output(std::string type, int input)
{
    if (type.empty() || type == "null")
    {
        return "No Type Data";
    }

    if (input < -100)
    {
        return "Immunity to " + type;
    }
    else if (input > 0)
    {
        return std::to_string(input) + "x weak to " + type;
    }
    else if (input < 0)
    {
        return std::to_string(abs(input)) + "x resistant to " + type;
    }
    else
    {
        return "Neutral to " + type;
    }
}