#flags
CXX      := g++
CXXFLAGS := --std=c++17 -Wall -Werror -pedantic -g -fsanitize=address -fsanitize=undefined -D_GLIBCXX_DEBUG
LDFLAGS  := 

#executable name
TARGET   := calculator

#directories
SRC_DIR  := backend/src
OBJ_DIR  := obj

ALL_SRCS := $(wildcard $(SRC_DIR)/*.cpp)
SRCS 	 := $(filter-out $(SRC_DIR)/server.cpp, $(ALL_SRCS))
OBJS     := $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))
DEPS     := $(OBJS:.o=.d)


# build rules

.PHONY: all clean

# default rules
all: $(TARGET)

# link executable
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) $^ $(LDFLAGS) -o $@

# compile src files to obj files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -I$(SRC_DIR) -MMD -MP -c $< -o $@

# create directories
$(OBJ_DIR):
	mkdir -p $@

# clean
clean:
	rm -rf $(OBJ_DIR) $(TARGET)

# include auto created dependency files
-include $(DEPS)