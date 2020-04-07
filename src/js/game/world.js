const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const Player = require('game/objects/player');
const Wall = require('game/objects/terrain/wall');
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
    'R': 'ROCK',
    '@': 'PLAYER_SPAWN',
    'T': 'TREE',
    'W': 'WALL', // permanent wall is permanent rock
};

class World {
    constructor (world_map) {
        this.cell_size = 50;
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
                    x,
                    y,
                    neighbors: {
                        north: WORLD_MAP_LEGEND[(world[y - 1] || [])[x] || null] || null,
                        south: WORLD_MAP_LEGEND[(world[y + 1] || [])[x] || null] || null,
                        east: WORLD_MAP_LEGEND[(world[y] || [])[x + 1] || null] || null,
                        west: WORLD_MAP_LEGEND[(world[y] || [])[x - 1] || null] || null,
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
            x: (params.x * this.cell_size) + this.half_cell_size,
            y: (params.y * this.cell_size) + this.half_cell_size,
        });
    }

    createWall (params = {}) {
        new Wall({
            ...params,
            layer: GOM.front,
            x: params.x * this.cell_size,
            y: params.y * this.cell_size,
            z: 1,
            width: this.cell_size,
            height: this.cell_size,
        });
    }

    createTree (params = {}) {
        new Tree({
            ...params,
            layer: GOM.front,
            x: params.x * this.cell_size,
            y: params.y * this.cell_size,
            z: 2,
            width: this.cell_size,
            height: this.cell_size,
        });
    }
}

module.exports = World;