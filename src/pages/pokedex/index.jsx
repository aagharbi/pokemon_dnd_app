import React, { useEffect, useState } from "react";

const PokedexPage = () => {
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
      <div className="w-full h-screen flex flex-row ">
        {/* Pokemon Description <left> */}
        <div className="w-full items-center"></div>

        {/* Pokemon List <right> */}
        <div className="flex flex-col w-2/5 justify-center items-center bg-slate-400">
          {/* Input Box */}
          <div className="pb-8 w-full flex justify-center">
            <input
              type="text"
              value={pokemonSearch}
              onChange={handleSearch}
              placeholder="Enter name of Pokemon"
              className=" pl-2 w-5/6 h-8 text-black focus:outline-none"
            />
          </div>

          <div
            className="h-1/2 items-center justify-center overflow-hidden overflow-y-auto
            w-5/6
          scrollbar-thumb-rose-500 scrollbar-track-rose-300 scrollbar-thin"
          >
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
                            <span>
                              {pokemon.index.toString().padStart(3, "0")}
                            </span>{" "}
                            <span>{pokemon.name}</span>{" "}
                            <span>{pokemon.SR}</span>
                          </div>
                        </div>
                      </>
                    );
                  })
                : // Else, Display the entire pokemon list
                // Another comment
                  pokemon_objects.map((pokemon, index) => {
                    return (
                      <>
                        <div
                          className={`flex w-full gap-x-10 py-2 cursor-pointer items-center border-rose-500 border- ${
                            selectedPokemon.name === pokemon.name
                              ? "m-4 p-1 rounded-full max-w-2xl bg-gradient-to-r pastel from-zinc-700 via-zinc-800 to-zinc-900 border-4 border-rose-500"
                              : ""
                          }`}
                          onClick={() => {
                            handleSelect(pokemon);
                          }}
                          key={index}
                        >
                          <img
                            className=" max-h-12 pl-8"
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.index}.png`}
                            alt=""
                          />

                          <div className="tracking-wide pl-8">
                            no.{pokemon.index.toString().padStart(3, "0")}
                          </div>

                          <div className="uppercase tracking-wider w-60">
                            {pokemon.name}
                          </div>

                          <div className="tracking-wider w-32">
                            sr {pokemon.SR}
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

export default PokedexPage;
