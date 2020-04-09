const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const Player = require('game/objects/player');
const Wall = require('game/objects/terrain/wall');
const Water = require('game/objects/terrain/water');
const Tree = require('game/objects/terrain/tree');
/*
What kind of environment do I want.
    - No tiers, just one flat plane
    - Rivers
    - Lakes
    - Trees (like one per tile)
    - Forest (dense trees, 3-4 per tile or something)
    - Rocks/Boulders (they can be kinda random size)
    - Iron deposit
    - Wall (like permanent unmovable/undamageable)
*/

const WORLD_MAP_LEGEND = {
    ' ': 'EMPTY',
    '#': 'WALL',
    'R': 'ROCK',
    '@': 'PLAYER_SPAWN',
    'T': 'TREE',
    'W': 'WATER', // permanent wall is permanent rock
};

class World {
    constructor (world_map) {
        this.cell_size = 48;
        this.half_cell_size = this.cell_size / 2;

        GOM.world_size = {
            width: world_map[0].length * this.cell_size,
            height: world_map.length * this.cell_size,
        };

        this.world = this.parseWorld(world_map);
        this.generateWorld(this.world);
    }

    parseWorld (map) {
        return map.map((map_row) => {
            return map_row.split('');
        });
    }

    generateWorld (world) {
        let wall_count = 0;

        console.log('World Width: ' + world[0].length);
        console.log('World Height: ' + world.length);

        world.forEach((row, y) => {
            row.forEach((tile, x) => {
                const type = WORLD_MAP_LEGEND[tile];
                const objectParams = {
                    spawn: {
                        x: (x * this.cell_size) + this.half_cell_size,
                        y: (y * this.cell_size) + this.half_cell_size,
                    },
                    neighbors: {
                        north: WORLD_MAP_LEGEND[(world[y - 1] || [])[x] || null] || null,
                        south: WORLD_MAP_LEGEND[(world[y + 1] || [])[x] || null] || null,
                        east: WORLD_MAP_LEGEND[(world[y] || [])[x + 1] || null] || null,
                        west: WORLD_MAP_LEGEND[(world[y] || [])[x - 1] || null] || null,
                        north_east: WORLD_MAP_LEGEND[(world[y - 1] || [])[x + 1] || null] || null,
                        north_west: WORLD_MAP_LEGEND[(world[y - 1] || [])[x - 1] || null] || null,
                        south_east: WORLD_MAP_LEGEND[(world[y + 1] || [])[x + 1] || null] || null,
                        south_west: WORLD_MAP_LEGEND[(world[y + 1] || [])[x - 1] || null] || null,
                    }
                };
                switch (type) {
                    case 'PLAYER_SPAWN':
                        this.spawnPlayer(objectParams);
                        break;
                    case 'ROCK':
                        this.createWall(objectParams);
                        break;
                    case 'WALL':
                        objectParams.permanent = true;
                        this.createWall(objectParams);
                        break;
                    case 'WATER':
                        objectParams.permanent = true;
                        this.createWater(objectParams);
                        break;
                    case 'TREE':
                        this.createTree(objectParams);
                    default: // EMPTY?
                        break;
                }
            });
        });
    }

    spawnPlayer (params = {}) {
        // We want the player to spawn in the middle of the cell
        new Player({
            ...params,
            camera_follow: true,
            layer: GOM.front,
            z: 10,
        });
    }

    createWall (params = {}) {
        new Wall({
            ...params,
            layer: GOM.front,
            z: 1,
        });
    }

    createWater (params = {}) {
        new Water({
            ...params,
            layer: GOM.front,
            z: 1,
        });
    }

    createTree (params = {}) {
        new Tree({
            ...params,
            layer: GOM.front,
            z: 20,
        });
    }
}

module.exports = World;