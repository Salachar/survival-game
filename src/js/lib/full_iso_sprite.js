const full_iso_sprite_map = require('lib/full_iso_sprite_map');

function getSpritePosition (neighbors, openings) {
    switch (openings) {
        case 0:
            return determineNoneSideImage(neighbors);
        case 1:
            return determineOneSideImage(neighbors);
        case 2:
            return determineTwoSideImage(neighbors);
        case 3:
            return determineThreeSideImage(neighbors);
        case 4:
            return determineFourSideImage(neighbors);
    }
}

function determineNoneSideImage () {
    // clip the none side sprite
    return full_iso_sprite_map.none.f;
}

function determineOneSideImage (neighbors) {
    // one side doesnt give a shit about diagonals
    const { north, south, east, west } = neighbors;
    if (north) return full_iso_sprite_map.one.n;
    if (south) return full_iso_sprite_map.one.s;
    if (east) return full_iso_sprite_map.one.e;
    if (west) return full_iso_sprite_map.one.w;
}

function determineTwoSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = full_iso_sprite_map.two;

    if (north && south) {
        return map.v; // clip vertical tube
    }
    if (east && west) {
        return map.h; // clip horizontal tube
    }

    if (north && east) {
        if (north_east) {
            return map.ne_f; // clip north east full
        } else {
            return map.ne_i; // clip north east corner
        }
    }
    if (north && west) {
        if (north_west) {
            return map.nw_f; // clip north west full
        } else {
            return map.nw_i; // clip north west corner
        }
    }
    if (south && east) {
        if (south_east) {
            return map.se_f; // clip south east full
        } else {
            return map.se_i; // clip south east corner
        }
    }
    if (south && west) {
        if (south_west) {
            return map.sw_f; // clip south west full
        } else {
            return map.sw_i; // clip south west corner
        }
    }
}

function determineThreeSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = full_iso_sprite_map.three;

    // Faces north
    if (west && north && east) {
        if (north_west && north_east) {
            return map.north.f; // clip facing north northwest full northeast full
        }
        if (north_west && !north_east) {
            return map.north.ne_i; // clip facing north northwest full northeast corner
        }
        if (!north_west && north_east) {
            return map.north.nw_i; // clip facing north northwest corner northeast full
        }
        if (!north_west && !north_east) {
            return map.north.i; // clip facing north northwest corner northeast corner
        }
    }

    // Faces east
    if (north && east && south) {
        if (north_east && south_east) {
            return map.east.f; // clip facing east north_east full south_east full
        }
        if (north_east && !south_east) {
            return map.east.se_i; // clip facing east north_east full south_east corner
        }
        if (!north_east && south_east) {
            return map.east.ne_i; // clip facing east north_east corner south_east full
        }
        if (!north_east && !south_east) {
            return map.east.i; // clip facing east north_east corner south_east corner
        }
    }

    // Faces south
    if (west && south && east) {
        if (south_west && south_east) {
            return map.south.f; // clip facing east south_west full south_east full
        }
        if (south_west && !south_east) {
            return map.south.se_i; // clip facing east south_west full south_east corner
        }
        if (!south_west && south_east) {
            return map.south.sw_i; // clip facing east south_west corner south_east full
        }
        if (!south_west && !south_east) {
            return map.south.i; // clip facing east south_west corner south_east corner
        }
    }

    // Faces west
    if (north && west && south) {
        if (north_west && south_west) {
            return map.west.f; // clip facing east north_west full south_west full
        }
        if (north_west && !south_west) {
            return map.west.sw_i; // clip facing east north_west full south_west corner
        }
        if (!north_west && south_west) {
            return map.west.nw_i; // clip facing east north_west corner south_west full
        }
        if (!north_west && !south_west) {
            return map.west.i; // clip facing east north_west corner south_west corner
        }
    }
}

function determineFourSideImage (neighbors) {
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = full_iso_sprite_map.four;

    // all four
    if (north_east && north_west && south_east && south_west) {
        return map.f; // all full
    }

    if (!north_east && !north_west && !south_east && !south_west) {
        return map.i; // all inside corners
    }

    // ONE INSIDE CORNER
    // northeast corner only
    if (!north_east && north_west && south_east && south_west) {
        return map.ne_i;
    }
    // northwest corner only
    if (north_east && !north_west && south_east && south_west) {
        return map.nw_i;
    }
    // southeast corner only
    if (north_east && north_west && !south_east && south_west) {
        return map.se_i;
    }
    // southwest corner only
    if (north_east && north_west && south_east && !south_west) {
        return map.sw_i;
    }

    // TWO INSIDE CORNERS
    // northeast and northwest
    if (!north_east && !north_west && south_east && south_west) {
        return map.nw_i_ne_i;
    }
    // northeast and southeast
    if (!north_east && north_west && !south_east && south_west) {
        return map.ne_i_se_i;
    }
    // southwest and southeast
    if (north_east && north_west && !south_east && !south_west) {
        return map.sw_i_se_i;
    }
    // northwest and southwest
    if (north_east && !north_west && south_east && !south_west) {
        return map.nw_i_sw_i;
    }
    // northwest and southeast
    if (north_east && !north_west && !south_east && south_west) {
        return map.nw_i_se_i;
    }
    // northeast and southwest
    if (!north_east && north_west && south_east && !south_west) {
        return map.ne_i_sw_i;
    }

    // THREE INSIDE CORNERS
    // not northwest
    if (!north_east && north_west && !south_east && !south_west) {
        return map.nw_f;
    }
    // not northeast
    if (north_east && !north_west && !south_east && !south_west) {
        return map.ne_f;
    }
    // not southeast
    if (!north_east && !north_west && south_east && !south_west) {
        return map.se_f;
    }
    // not southwest
    if (!north_east && !north_west && !south_east && south_west) {
        return map.sw_f;
    }
}

module.exports = {
    getSpritePosition,
};