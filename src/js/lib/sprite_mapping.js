module.exports = {
    one: {
       e: {x: 0, y: 0},
       n: {x: 1, y: 0},
       s: {x: 2, y: 0},
       w: {x: 3, y: 0},
    },
    two: {
        ne_i: {x: 0, y: 1},
        se_i: {x: 1, y: 1},
        sw_i: {x: 2, y: 1},
        nw_i: {x: 3, y: 1},

        ne_f: {x: 0, y: 4},
        se_f: {x: 1, y: 4},
        sw_f: {x: 2, y: 4},
        nw_f: {x: 3, y: 4},

        v: {x: 1, y: 3},
        h: {x: 2, y: 3},
    },
    three: {
        north: {
            i: {x: 0, y: 2},
            nw_i: {x: 0, y: 5},
            ne_i: {x: 0, y: 6},
            f: {x: 0, y: 7},
        },
        east: {
            i: {x: 1, y: 2},
            se_i: {x: 1, y: 5},
            ne_i: {x: 1, y: 6},
            f: {x: 1, y: 7},
        },
        south: {
            i: {x: 2, y: 2},
            se_i: {x: 2, y: 5},
            sw_i: {x: 2, y: 6},
            f: {x: 2, y: 7},
        },
        west: {
            i: {x: 3, y: 2},
            sw_i: {x: 3, y: 5},
            nw_i: {x: 3, y: 6},
            f: {x: 3, y: 7},
        }
    },
    four: {
        f: {x: 2, y: 11},
        i: {x: 3, y: 3},
        ne_i_sw_i: {x: 0, y: 1},
        nw_i_se_i: {x: 1, y: 1},

        sw_i: {x: 0, y: 8},
        nw_i: {x: 1, y: 8},
        ne_i: {x: 2, y: 8},
        se_i: {x: 3, y: 8},

        sw_i_se_i: {x: 0, y: 9},
        nw_i_sw_i: {x: 1, y: 9},
        nw_i_ne_i: {x: 2, y: 9},
        ne_i_se_i: {x: 3, y: 9},

        ne_f: {x: 0, y: 10},
        nw_f: {x: 1, y: 10},
        sw_f: {x: 2, y: 10},
        se_f: {x: 3, y: 10},
    },
    none: {
        f: {x: 0, y: 3},
    }
};