export default function DisplayInfo({pokemonName, pokemon, displayChoice}) {

    const displayPokemonName = () => {
        return(<div>{pokemonName}</div>)
    }

    const displayPokemonSR = () => {
        return(<div>{pokemon.SR}</div>)
    }

    const displayPokemonIndex = () => {
        return(<div>{pokemon.Index}</div>)
    }

    return(
         <>

            { displayChoice == 0 && displayPokemonName() }
            { displayChoice == 1 && displayPokemonSR() }
            { displayChoice == 2 && displayPokemonIndex() }

         </>
    )
}