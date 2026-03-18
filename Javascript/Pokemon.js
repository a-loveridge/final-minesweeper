"use strict";

export class Pokemon {
    constructor(count) {
        this.count = count; // = mineCount
        this.pokemon = [];
    }

    // generates random pokemon id between 1 and 151 (using gen 1 pokemon only)
    generateRandomID() {
        const ids = new Set(); // somewhere to store the values - read up on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

        while (ids.size < this.count) {
            ids.add(Math.floor(Math.random() * 151) + 1);
        }

        // using a set ensures no duplicate pokemon on the board
        return Array.from(ids);
    }

    // fetches a single pokemon by id and returns name and sprite
    async fetchPokemon(id) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

        if (!resp.ok) {
            throw new Error(`Failed to fetch pokemon with id ${id}`);
        }

        const data = await resp.json();

        return {
            name: data.name,
            sprite: data.sprites.front_default
        };
    }

    // fetches pokemon for the game
    async fetchAll() {
        const ids = this.generateRandomID();

        for (const id of ids) {
            try {
                const pokemon = await this.fetchPokemon(id);
                this.pokemon.push(pokemon);
            } catch (error){
                // if one fetch fails push a fallback so the game doesn't break
                console.error(error);
                this.pokemon.push ({
                    name: "unknown",
                    sprite: "..\Images/pokeball.png"
                });
            }
        }

        return this.pokemon;
    }


}