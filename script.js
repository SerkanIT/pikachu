const pokemonData = [];
let timeoutID;

async function getPokemon() {
  const pokemonCount = 151; 
  const fetchPromises = Array.from({ length: pokemonCount }, (_, i) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
  );

  try {
    const responses = await Promise.all(fetchPromises);
    const results = await Promise.all(
      responses.map((response) => response.json())
    );

    console.log("API Response:", results); 

    if (results && Array.isArray(results)) {
      pokemonData.push(...results);
      displayPokemons(pokemonData);
    } else {
      console.error("Pokémon data not found or not an array.");
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

function displayPokemons(pokemons) {
  const pokemonCardsContainer = document.getElementById("pokemon-cards");
  pokemonCardsContainer.innerHTML = ""; 

  if (pokemons.length === 0) {
    pokemonCardsContainer.innerHTML =
      "<p class='error-message'><span class='error-icon'>⚠️</span>No results</p>";
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      displayPokemons(pokemonData);
    }, 2000);
  } else {
    pokemons.forEach((pokemon) => {
      const imageUrl = pokemon.sprites.front_default || "/images/default.png"; 

      const cardHTML = `
        <a href="/" class="card"> <!-- Wrap the card in an anchor tag -->
          <div class="card-image" style="background-image: url('${imageUrl}');"></div>
          <h2>
            ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h2>
          <p>Type: ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
          <p>Id: ${pokemon.id}</p>
        </a>
      `;
      pokemonCardsContainer.innerHTML += cardHTML; 
    });
  }
}

function filterPokemons() {
  const nameValue = document.getElementById("name-input").value.toLowerCase();

  // Input control
  if (!nameValue) {
    const pokemonCardsContainer = document.getElementById("pokemon-cards");
    pokemonCardsContainer.innerHTML =
      "<p class='error-message'><span class='error-icon'>⚠️</span>Fill at least one input</p>";

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      displayPokemons(pokemonData);
    }, 2000);

    return;
  }

  const filteredPokemons = pokemonData.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(nameValue); 
  });

  displayPokemons(filteredPokemons);
}

document.addEventListener("DOMContentLoaded", () => {
  getPokemon(); 

  const nameInput = document.getElementById("name-input");
  const filterButton = document.getElementById("filter-button");

  filterButton.addEventListener("click", filterPokemons);

  nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      filterPokemons();
    }
  });
});
