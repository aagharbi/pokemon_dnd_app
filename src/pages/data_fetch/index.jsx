import React, { useEffect, useState } from "react";

const FetchPokemonData = () => {
  const [pokemonHeader, setPokemonHeader] = useState([]);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [selectedPokemonDescription, setSelectedPokemonDescription] =
    useState(null);
  const [selectedPokemonEvolution, setSelectedPokemonEvolution] = useState({});
  const [tmHeader, setTMHeader] = useState({});
  const [hoveredTMDescription, setHoveredTMDescription] = useState(null);
  const [moveDescription, setMoveDescription] = useState({});
  const [hoveredMove, setHoveredMove] = useState(null);

  // Fetch pokemon headers containing name, index, sr, and min_lvl
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch("/data/filter_data.json");
        const data = await response.json();
        let pokemon_objects = data;
        setPokemonHeader(pokemon_objects);
        setFilteredPokemon(pokemon_objects); // Initialize filteredPokemon with the complete list
        console.log(filteredPokemon);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHeaders();
  }, []);

  // Reformat pokemonHeader Object into Array
  let pokemon_keys = Object.keys(pokemonHeader);
  let pokemon_data = Object.values(pokemonHeader);
  let pokemon_objects = [...pokemon_data];

  pokemon_keys.map((pokemon, index) => {
    pokemon_objects[index] = { ...pokemon_objects[index], name: pokemon };
  });

  // Called On Change when input box is populated.
  const handleSearch = (event) => {
    let search = event.target.value.toLowerCase();
    setPokemonSearch(search);
  };

  // Returns List of Objects that include substring pokemonSearch
  useEffect(() => {
    setFilteredPokemon(filterPokemon());
  }, [pokemonSearch]);

  // Filter Pokemon Function called when pokemonSearch is changed
  const filterPokemon = () => {
    return pokemon_objects.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(pokemonSearch);
    });
  };

  // Change Selected Pokemon On Click
  const handleSelect = (pokemon) => {
    console.log("Selected Pokemon: ", pokemon);
    setSelectedPokemon(pokemon);
    setSelectedPokemonEvolution(pokemon);
  };

  // Fetch Selected Pokemon's Description
  useEffect(() => {
    const fetchSelectedDescription = async () => {
      try {
        const fileName = `${selectedPokemon.name}.json`;
        const response = await fetch(`/data/pokemon/${fileName}`);
        const stats = await response.json();
        setSelectedPokemonDescription(stats);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedPokemon.name) {
      fetchSelectedDescription();
    }
  }, [selectedPokemon]);

  // Fetch Selected Pokemon's Evolution
  useEffect(() => {
    const fetchSelectedEvolution = async () => {
      try {
        const filePath = "/data/evolve.json";
        const response = await fetch(filePath);
        const evolution = await response.json();

        // Check if the selectedPokemon exists in the evolution data
        if (selectedPokemon.name && evolution[selectedPokemon.name]) {
          setSelectedPokemonEvolution(evolution[selectedPokemon.name]);
          console.log("Into: ", selectedPokemonEvolution.into);
        } else {
          setSelectedPokemonEvolution({}); // Empty object when the selectedPokemon doesn't have an entry in evolve.json
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedPokemon.name) {
      fetchSelectedEvolution();
    }
  }, [selectedPokemon]);

  // Fetch Selected TM's Description
  useEffect(() => {
    const fetchTMHeader = async () => {
      try {
        const response = await fetch("/data/tm.json");
        const data = await response.json();
        const headerData = data;
        setTMHeader(headerData);
        console.log(tmHeader);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTMHeader();
  }, []);

  // Fetch Selected Move's Description
  const fetchMoveDescription = async (header) => {
    try {
      console.log("Found Object: ", header);
      const response = await fetch(`/data/moves/${header.name}.json`);
      const data = await response.json();
      const move = data;
      setMoveDescription(move);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoveDescriptionByName = async (moveName) => {
    try {
      console.log("We got here");
      const response = await fetch(`/data/moves/${moveName}.json`);
      const data = await response.json();
      const move = data;
      setMoveDescription(move);
    } catch (error) {
      console.error(error);
    }
  };

  // Display Move Description
  const displayDescription = (moveName, index) => {
    return (
      <div
        className="cursor-pointer"
        onMouseEnter={async () => {
          const move = await fetchMoveDescriptionByName(moveName);
          console.log("Move Name: ", moveName);
          setHoveredMove(moveName);
        }}
        onMouseLeave={() => setHoveredMove(null)}
      >
        {`${moveName}`}

        <div className="">
          {hoveredMove === moveName && (
            <div>
              {moveDescription && (
                <div className="">
                  {moveDescription.Description && (
                    <p>Description: {moveDescription.Description}</p>
                  )}
                  {moveDescription.Duration && (
                    <p>Duration: {moveDescription.Duration}</p>
                  )}
                  {moveDescription["Move Power"] && (
                    <p>
                      Move Power: {moveDescription["Move Power"].join(", ")}
                    </p>
                  )}
                  {moveDescription["Move Time"] && (
                    <p>Move Time: {moveDescription["Move Time"]}</p>
                  )}
                  {moveDescription.PP && <p>PP: {moveDescription.PP}</p>}
                  {moveDescription.Range && (
                    <p>Range: {moveDescription.Range}</p>
                  )}
                  {moveDescription.Scaling && (
                    <p>Scaling: {moveDescription.Scaling}</p>
                  )}
                  {moveDescription.Type && <p>Type: {moveDescription.Type}</p>}
                  {moveDescription.atk !== undefined && (
                    <p>atk: {moveDescription.atk ? "true" : "false"}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Return Display
  return (
    <>
      {/* Main Container */}
      <div className="w-full flex flex-row">
        {/* Split Right (for now) */}
        <div className="w-1/2 items-center">
          {/* Selected Pokemon's Evolution */}
          <div>
            {selectedPokemonEvolution.into &&
            selectedPokemonEvolution.into.length > 0 ? (
              <>
                <div>
                  <div>
                    Evolves into:
                    {selectedPokemonEvolution.into.map((evolution, index) => {
                      const item =
                        selectedPokemonEvolution[`item_${index + 1}`];
                      const loyalty =
                        selectedPokemonEvolution[`loyalty_${index + 1}`];
                      const time =
                        selectedPokemonEvolution[`time_${index + 1}`];
                      const move =
                        selectedPokemonEvolution[`move_${index + 1}`];
                      const gender =
                        selectedPokemonEvolution[`gender_${index + 1}`];
                      const useItem =
                        selectedPokemonEvolution[`use_${index + 1}`];
                      const level =
                      selectedPokemonEvolution[`level`];

                      return (
                        <div key={index}>
                          {evolution}
                          {useItem && <span> by using {useItem}</span>}
                          {item && <span> while holding a {item}</span>}
                          {loyalty && (
                            <span> with a Loyalty of +{loyalty}</span>
                          )}
                          {time && <span> during {time} time</span>}
                          {move && <span> after learning {move}</span>}
                          {gender && <span> as {gender}</span>}
                          {level && <span> at Lv. {level}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* Selected Pokemon's Description */}
          <div>
            {selectedPokemonDescription ? (
              <div>
                <p>
                  Armor Class:{" "}
                  {selectedPokemonDescription.AC &&
                    selectedPokemonDescription.AC}
                </p>
                <p>
                  Abilities:{" "}
                  {selectedPokemonDescription.Abilities &&
                    selectedPokemonDescription.Abilities.join(",")}
                </p>
                <p>
                  HP:{" "}
                  {selectedPokemonDescription.HP &&
                    selectedPokemonDescription.HP}
                </p>
                <p>
                  Hidden Ability:{" "}
                  {selectedPokemonDescription["Hidden Ability"] &&
                    selectedPokemonDescription["Hidden Ability"]}{" "}
                </p>
                <p>
                  Hit Dice:{" "}
                  {selectedPokemonDescription["Hit Dice"] &&
                    selectedPokemonDescription["Hit Dice"]}
                </p>
                <p>
                  Skill:{" "}
                  {selectedPokemonDescription.Skill &&
                    selectedPokemonDescription.Skill.join(", ")}
                </p>
                <p>
                  {selectedPokemonDescription.WSp && (
                    <p>Walk Speed: {selectedPokemonDescription.WSp}</p>
                  )}
                </p>
                <p>
                  {selectedPokemonDescription.Ssp && (
                    <p>Swim Speed: {selectedPokemonDescription.Ssp}</p>
                  )}
                </p>
                <p>
                  {selectedPokemonDescription.Fsp && (
                    <p>Fly Speed: {selectedPokemonDescription.Fsp}</p>
                  )}
                </p>
                <p>Attributes:</p>
                <ul>
                  {selectedPokemonDescription.attributes &&
                    Object.entries(selectedPokemonDescription.attributes).map(
                      ([attr, value]) => (
                        <li key={attr}>
                          {attr}: {value}
                        </li>
                      )
                    )}
                </ul>
                <p>
                  Saving Throws:{" "}
                  {selectedPokemonDescription.saving_throws &&
                    selectedPokemonDescription.saving_throws.join(", ")}
                </p>
                <p>
                  Size:{" "}
                  {selectedPokemonDescription.size &&
                    selectedPokemonDescription.size}
                </p>

                <p>
                  Starting Moves:{" "}
                  {selectedPokemonDescription.Moves["Starting Moves"] &&
                    selectedPokemonDescription.Moves["Starting Moves"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>

                <p>
                  Level 2:{" "}
                  {selectedPokemonDescription.Moves.Level["2"] &&
                    selectedPokemonDescription.Moves.Level["2"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>

                <p>
                  Level 6:{" "}
                  {selectedPokemonDescription.Moves.Level["6"] &&
                    selectedPokemonDescription.Moves.Level["6"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>
                <p>
                  Level 10:{" "}
                  {selectedPokemonDescription.Moves.Level["10"] &&
                    selectedPokemonDescription.Moves.Level["10"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>
                <p>
                  Level 14:{" "}
                  {selectedPokemonDescription.Moves.Level["14"] &&
                    selectedPokemonDescription.Moves.Level["14"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>
                <p>
                  Level 18:{" "}
                  {selectedPokemonDescription.Moves.Level["18"] &&
                    selectedPokemonDescription.Moves.Level["18"].map(
                      (moveName, index) => {
                        return (
                          <div key={index}>
                            {displayDescription(moveName, index)}
                          </div>
                        );
                      }
                    )}
                </p>

                {/* Learnable TMs */}
                <div>
                  <div>
                    <p>Learnable TMs:</p>

                    {selectedPokemonDescription.Moves.TM &&
                      selectedPokemonDescription.Moves.TM.map(
                        (tmNumber, index) => {
                          const paddedTMNumber = String(tmNumber).padStart(
                            2,
                            "0"
                          );

                          return (
                            <div
                              key={index}
                              className="cursor-pointer"
                              onMouseEnter={async () => {
                                console.log("TM Header: ", tmHeader);
                                console.log(tmHeader[`${paddedTMNumber}`]);
                                const move = await fetchMoveDescription(
                                  tmHeader[`${paddedTMNumber}`]
                                );
                                setHoveredTMDescription(paddedTMNumber);
                              }}
                              onMouseLeave={() => setHoveredTMDescription(null)}
                            >
                              {`TM ${paddedTMNumber}`}

                              <div className="">
                                {hoveredTMDescription === paddedTMNumber && (
                                  <div>
                                    {tmHeader[`${paddedTMNumber}`].name}
                                    {moveDescription && (
                                      <div className="">
                                        {moveDescription.Description && (
                                          <p>
                                            Description:{" "}
                                            {moveDescription.Description}
                                          </p>
                                        )}
                                        {moveDescription.Duration && (
                                          <p>
                                            Duration: {moveDescription.Duration}
                                          </p>
                                        )}
                                        {moveDescription["Move Power"] && (
                                          <p>
                                            Move Power:{" "}
                                            {moveDescription["Move Power"].join(
                                              ", "
                                            )}
                                          </p>
                                        )}
                                        {moveDescription["Move Time"] && (
                                          <p>
                                            Move Time:{" "}
                                            {moveDescription["Move Time"]}
                                          </p>
                                        )}
                                        {moveDescription.PP && (
                                          <p>PP: {moveDescription.PP}</p>
                                        )}
                                        {moveDescription.Range && (
                                          <p>Range: {moveDescription.Range}</p>
                                        )}
                                        {moveDescription.Scaling && (
                                          <p>
                                            Scaling: {moveDescription.Scaling}
                                          </p>
                                        )}
                                        {moveDescription.Type && (
                                          <p>Type: {moveDescription.Type}</p>
                                        )}
                                        {moveDescription.atk !== undefined && (
                                          <p>
                                            atk:{" "}
                                            {moveDescription.atk
                                              ? "true"
                                              : "false"}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Container Horizontal Split Right*/}
        <div className="flex flex-col w-1/2">
          {/* Display Input Box */}
          <div>
            <input
              type="text"
              value={pokemonSearch}
              onChange={handleSearch}
              placeholder="Enter name of Pokemon"
              className="text-black"
            />
          </div>
          {/* Pokemon Scroll List */}
          <div>
            {
              // If there is a search, display filtered Pokemon block
              filteredPokemon.length > 0
                ? filteredPokemon.map((pokemon, index) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            handleSelect(pokemon);
                          }}
                          className="cursor-pointer"
                          key={index}
                        >
                          <div
                            className={`${
                              selectedPokemon.name === pokemon.name
                                ? " px-2 rounded-full max-w-fit bg-gradient-to-r pastel from-zinc-700 via-zinc-800 to-zinc-900 border-4 border-rose-500"
                                : ""
                            }`}
                          >
                            {pokemon.name}
                          </div>
                        </div>
                      </>
                    );
                  })
                : // Else, Display the entire pokemon list
                  pokemon_objects.map((pokemon, index) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            handleSelect(pokemon);
                          }}
                          className="cursor-pointer"
                          key={index}
                        >
                          <div
                            className={`${
                              selectedPokemon.name === pokemon.name
                                ? " px-2 rounded-full max-w-fit bg-gradient-to-r pastel from-zinc-700 via-zinc-800 to-zinc-900 border-4 border-rose-500"
                                : ""
                            }`}
                          >
                            {pokemon.name}
                          </div>
                        </div>
                      </>
                    );
                  })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchPokemonData;
