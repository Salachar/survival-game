const sprite_mapping = require('lib/simple_sprite_mapping');

function getSpritePosition (neighbors, openings) {
    let x = null;
    let y = 0;
    switch (openings) {
        case 0:
            x = determineNoneSideImage(neighbors);
            break;
        case 1:
            x = determineOneSideImage(neighbors);
            break;
        case 2:
            x = determineTwoSideImage(neighbors);
            break;
        case 3:
            x = determineThreeSideImage(neighbors);
            break;
        case 4:
            x = determineFourSideImage(neighbors);
            break;
    }
    return { x, y };
}

function determineNoneSideImage () {
    // clip the none side sprite
    return sprite_mapping.none.f;
}

function determineOneSideImage (neighbors) {
    // one side doesnt give a shit about diagonals
    const { north, south, east, west } = neighbors;
    const map = sprite_mapping.one;
    if (north) return map.n;
    if (south) return map.s;
    if (east) return map.e;
    if (west) return map.w;
}

function determineTwoSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const map = sprite_mapping.two;
    if (north && south) return map.v; // clip vertical tube
    if (east && west) return map.h; // clip horizontal tube

    if (north && east) return map.ne;
    if (north && west) return map.nw;
    if (south && east) return map.se;
    if (south && west) return map.sw;
}

function determineThreeSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const map = sprite_mapping.three;

    // Faces north
    if (west && north && east) return map.n;
    // Faces east
    if (north && east && south) return map.e;
    // Faces south
    if (west && south && east) return map.s;
    // Faces west
    if (north && west && south) return map.w;
}

function determineFourSideImage (neighbors) {
    return sprite_mapping.four.f;
}

module.exports = {
    getSpritePosition,
};