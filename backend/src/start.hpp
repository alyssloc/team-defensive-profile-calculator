#pragma once
#include <vector>
#include <string>
#include "types.hpp"
#include "team.hpp"
class Start
{
public:
    void print_welcome_message();
    void get_input(std::string file);
    void print_closing_message();
    Team create_team();

private:
    void set_info();
    bool read_file(const std::string &file);
    std::pair<Type, Type> set_pokemon_info(const int &i);
    int gen;
    Info info;
    bool file_input;
    std::vector<std::pair<Type, Type>> file_pokemon_types;
};