const GOM = require('../core/game-object-manager');
const GIM = require('../core/game-input-manager');
const GOB = require('../core/game-object-base');

const Player = require('./objects/player');
const Wall = require('./objects/wall');

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
    'W': 'WALL_PERMANENT', // permanent wall is permanent rock
};

const WORLD_MAP = [
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W                                      W',
'W  @                   R               W',
'W                     RR               W',
'W                   RRRRRR             W',
'W                      RR              W',
'W                    R                 W',
'W                                      W',
'W     RRRR                     RR      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'W                                      W',
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];
// const WORLD_MAP = [
// '        WW                              ',
// '         W                              ',
// '   @                                    ',
// '        WW                              ',
// '        WW                              ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// ];
// const WORLD_MAP = [
// '                                        ',
// '                                        ',
// '   @                                    ',
// '        W                               ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// ];


class World {
    constructor () {
        this.cell_size = 50;
        this.half_cell_size = this.cell_size / 2;

        GOM.world_size = {
            width: WORLD_MAP[0].length * this.cell_size,
            height: WORLD_MAP.length * this.cell_size,
        };

        this.generateWorld();
    }

    generateWorld () {
        WORLD_MAP.forEach((row, index_y) => {
            const row_split = row.split('');
            row_split.forEach((tile, index_x) => {
                const type = WORLD_MAP_LEGEND[tile];

                const objectParams = {
                    x: index_x,
                    y: index_y,
                };

                switch (type) {
                    case 'PLAYER_SPAWN':
                        this.spawnPlayer(objectParams);
                        break;
                    case 'ROCK':
                        this.createWall(objectParams);
                        break;
                    case 'WALL_PERMANENT':
                        objectParams.permanent = true;
                        this.createWall(objectParams);
                        break;
                    default: // EMPTY?
                        break;
                }
            });
        });
    }

    spawnPlayer (params = {}) {
        // We want the player to spawn in the middle of the cell
        new Player({
            camera_follow: true,
            layer: GOM.front,
            x: (params.x * this.cell_size) + this.half_cell_size,
            y: (params.y * this.cell_size) + this.half_cell_size,
        });
    }

    createWall (params = {}) {
        new Wall({
            layer: GOM.front,
            x: params.x * this.cell_size,
            y: params.y * this.cell_size,
            width: this.cell_size,
            height: this.cell_size,
        });
    }
}

module.exports = World;