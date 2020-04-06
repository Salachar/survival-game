const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const Player = require('game/objects/player');
const Wall = require('game/objects/terrain/wall');

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
    'W': 'WALL', // permanent wall is permanent rock
};

const WORLD_MAP = [
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W  @                   W                         WWWWWWW                WWWWWWWW',
'W                     WW                                   WWWWWW       WWWWWWWW',
'W                   WWWWWWW                       WWWWWWWWWWWWWWWWWW   WWWWWWWWWW',
'W                      WW                        WWWWWWWWWWWWWWWWW        WWWWWW',
'W                    W                           WWWWWWWWWWWWWWWWWWWWW     WWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W     WWWW                     WW                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];
// const WORLD_MAP = [
// '                                        ',
// '         W                              ',
// '   @        W                WWWW       ',
// '         WW W                W  W       ',
// '                             W  W       ',
// '    W    W          W        WWWW       ',
// '   WWW  WW   WWW    WW                  ',
// '         W    W     W                   ',
// '                                        ',
// '                                        ',
// '     W        WW                        ',
// '    WWW      WWWW                       ',
// '     W        WW                        ',
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

        this.world = this.parseWorld(WORLD_MAP);
        this.generateWorld(this.world);
    }

    parseWorld (map) {
        return map.map((map_row) => {
            return map_row.split('');
        });
    }

    generateWorld (world) {
        world.forEach((row, y) => {
            row.forEach((tile, x) => {
                const type = WORLD_MAP_LEGEND[tile];
                const objectParams = {
                    x,
                    y,
                    neighbors: {
                        north: WORLD_MAP_LEGEND[(world[y - 1] || [])[x] || null],
                        south: WORLD_MAP_LEGEND[(world[y + 1] || [])[x] || null],
                        east: WORLD_MAP_LEGEND[(world[y] || [])[x + 1] || null],
                        west: WORLD_MAP_LEGEND[(world[y] || [])[x - 1] || null]
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
            width: this.cell_size,
            height: this.cell_size,
        });
    }
}

module.exports = World;