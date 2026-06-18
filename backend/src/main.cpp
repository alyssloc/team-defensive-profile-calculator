//main.cpp file for running c++ code locally, via cli or file input

#include <iostream>
#include <string>
#include "start.hpp"
#include "team.hpp"

int main(int argc, char **argv)
{
    // creating start object, printing welcome, and getting user input
    Start start;
    start.print_welcome_message();
    std::string file = "";
    if (argc > 1)
    {
        file = argv[1];
    }

    start.get_input(file);
    // creating a team object
    Team team = start.create_team();
    // printing out individual pokemon info
    team.print_pokemon_info();
    // creating team defensive profile and outputting that info
    team.populate_team_profile();
    team.output_team_profile();
    // printing the closing message
    start.print_closing_message();
    return 0;
}