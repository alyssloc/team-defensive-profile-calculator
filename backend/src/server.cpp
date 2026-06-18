#include "crow_all.h"
#include "info.hpp"
#include "multiplier.hpp"
#include "types.hpp"
#include "pokemon.hpp"
#include "team.hpp"
#include "utilities.hpp"
#include <vector>
#include <utility>
#include <string>
#include <exception>

int main()
{
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]()
                         {
        crow::json::wvalue health_status;
        health_status["status"] = "healthy";
        health_status["service"] = "pokemon-defensive-profile-backend";
        health_status["version"] = "2.0-cors-fix";
        
        crow::response res(200, health_status);
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        return res; });

    CROW_ROUTE(app, "/calculate").methods(crow::HTTPMethod::POST, crow::HTTPMethod::OPTIONS)([](const crow::request &req)
                                                                                             {
        if (req.method == crow::HTTPMethod::OPTIONS) 
        {
            crow::response res(200);
            res.add_header("Access-Control-Allow-Origin", "*");
            res.add_header("Access-Control-Allow-Methods", "POST, OPTIONS");
            res.add_header("Access-Control-Allow-Headers", "Content-Type");
            return res;
        }

        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");

        try 
        {
            auto json_data = crow::json::load(req.body);
            if (!json_data)
            {
                res.code = 400;
                res.body = R"({"error": "Invalid JSON payload"})";
                return res;
            }

            // Safety Check: Verify top-level keys exist before trying to access them
            if (!json_data.has("generation") || !json_data.has("team"))
            {
                res.code = 400;
                res.body = R"({"error": "Missing 'generation' or 'team' keys in payload"})";
                return res;
            }

            // 1- setting gen info (copy of Start::set_info)
            int gen = json_data["generation"].i();
            Info info;

            if (gen == 1)
            {
                info.type_chart = GEN_ONE_TYPE_CHART;
                info.num_types = NUM_TYPES_GEN_ONE;
            }
            else if (gen >= 6)
            {
                info.type_chart = GEN_SIX_PLUS_CHART;
                info.num_types = NUM_TYPES_GEN_SIX_PLUS;
            }
            else
            {
                info.type_chart = GEN_TWO_FIVE_TYPE_CHART;
                info.num_types = NUM_TYPES_GEN_TWO_FIVE;
            }

            // 2- setting up pokemon team
            std::vector<Pokemon> pokemon_team;
            auto extracted_arr = json_data["team"];
            
            bool all_empty = true;

            for (const auto &pokemon : extracted_arr)
            {
                if (!pokemon.has("type1") || !pokemon.has("type2"))
                {
                    res.code = 400;
                    res.body = R"({"error": "Missing 'type1' or 'type2' fields inside a team object"})";
                    return res;
                }

                std::string t1 = pokemon["type1"].s();
                std::string t2 = pokemon["type2"].s();

                if (t1 != "null" || t2 != "null") 
                {
                    all_empty = false;
                }

                std::pair<Type, Type> types = string_to_type(std::make_pair(t1, t2));
                Pokemon p(info, types);
                pokemon_team.push_back(p);
            }

            // if all 6 pokemon are null, not a valid team
            if (all_empty) 
            {
                crow::json::wvalue error_json;
                error_json["error"] = "Invalid Team Configuration";
                error_json["message"] = "Your team cannot be entirely empty. Please select at least one valid type for a Pokémon.";
                
                res.code = 400;
                res.body = error_json.dump();
                return res;
            }

            Team team(pokemon_team);
            team.populate_team_profile();

            // 3- constructing json response
            crow::json::wvalue response_json;
            crow::json::wvalue::list results_list;

            const auto &scores = team.get_defensive_profile();
            for (int j = 0; j < info.num_types; ++j)
            {
                Type t = static_cast<Type>(j);
                crow::json::wvalue type_score_pair;

                type_score_pair["type"] = type_to_string(t);

                if (scores.count(t))
                {
                    type_score_pair["score"] = scores.at(t);
                }
                else
                {
                    type_score_pair["score"] = 0;
                }

                results_list.push_back(type_score_pair);
            } 

            response_json["results"] = std::move(results_list);
            
            res.code = 200;
            res.body = response_json.dump();
            return res;
        }
        catch (const std::exception& e) 
        {
            // catch library exceptions 
            res.code = 500;
            res.body = std::string(R"({"error": "Internal logic exception: ")") + e.what() + R"("})";
            return res;
        }
        catch (...) 
        {
            // catch all for signal 11 segmentation faults
            res.code = 500;
            res.body = R"({"error": "Fatal memory parsing crash intercepted cleanly"})";
            return res;
        }
    });

    const char *port_env = std::getenv("PORT");
    int port = port_env ? std::stoi(port_env) : 8080;

    app.port(port).multithreaded().run();
}