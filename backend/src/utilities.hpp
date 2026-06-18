#pragma once 
#include <string>
#include <utility> 
#include "multiplier.hpp" 
#include "types.hpp"  
const int TEAM_SIZE = 6; 

bool double_comparison(double a, double b, double epsilon = 1e-9);

Multiplier weakness_level(double total_weakness);

std::pair<Type, Type> string_to_type(const std::pair<std::string, std::string> &input);

std::string type_to_string(const Type &input);

std::string multiplier_to_string(const Multiplier &input);

int multiplier_to_int(const Multiplier &input);

std::string weakness_level_output(std::string type, int input);