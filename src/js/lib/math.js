const Helpers = {
    copy: function (object) {
        if (!object) return null;
        return JSON.parse(JSON.stringify(object));
    },

    degreesToRadians (degrees) {
        return degrees * (Math.PI / 180);
    },

    pointMatch: function (p1, p2, tolerance) {
        tolerance = tolerance || 0;
        return (Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance);
    },

    rgb: function (r,g,b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    },

    rgba: function (r,g,b,a) {
        a = (a || a === 0) ? a : 1;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    },

    randomRGBA: function (alpha) {
        alpha = (typeof alpha === 'number') ? alpha : 1;
        const r = Math.floor(Math.random() * 255 + 1);
        const g = Math.floor(Math.random() * 255 + 1);
        const b = Math.floor(Math.random() * 255 + 1);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    },

    sqr: function (value) {
        return value * value;
    },

    distanceBetween: function (obj1, obj2) {
        if (!obj1 || !obj2) return null;
        return Math.sqrt(
            Helpers.sqr(obj2.x - obj1.x) + Helpers.sqr(obj2.y - obj1.y)
        );
    },

    closestDistanceToLine: function (obj1, obj2) {

    },

    pDistance: function (point, item, opts = {}) {
        if (!point || !item) return;
        if (item.segment) item = item.segment;

        // The "item" can be anything, segment, light, point
        // If it's a simple point, get the distance and return
        if (item.x && item.y && !item.p1) {
            return {
                distance: Math.sqrt(Helpers.sqr(item.x - point.x) + Helpers.sqr(item.y - point.y)),
                x: item.x,
                y: item.y
            }
        }

        if (item.position) {
            return {
                distance: Math.sqrt(Helpers.sqr(item.position.x - point.x) + Helpers.sqr(item.position.y - point.y)),
                x: item.position.x,
                y: item.position.y
            }
        }

        // Now we're looking at a segment with p1 and p2, check the endpoints first
        let p1_match = Helpers.pointMatch(point, item.p1, 1);
        let p2_match = Helpers.pointMatch(point, item.p2, 1);
        if (opts.line_only && (p1_match || p2_match)) {
            return {
                distance: null,
                x: null,
                y: null
            };
        }

        return Helpers.distanceToLine(point, item);
    },

    distanceToLine: function (point, line) {
        const A = point.x - line.p1.x;
        const B = point.y - line.p1.y;
        const C = line.p2.x - line.p1.x;
        const D = line.p2.y - line.p1.y;

        const dot = (A * C) + (B * D);
        const len_sq = (C * C) + (D * D);
        const param = (len_sq !== 0) ? (dot / len_sq) : -1;

        let xx = 0;
        let yy = 0;
        if (param < 0) {
            xx = line.p1.x;
            yy = line.p1.y;
        } else if (param > 1) {
            xx = line.p2.x;
            yy = line.p2.y;
        } else {
            xx = line.p1.x + param * C;
            yy = line.p1.y + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;
        return {
            distance: Math.sqrt(Helpers.sqr(dx) + Helpers.sqr(dy)),
            x: xx,
            y: yy
        }
    },

    getIntersection (r, s) {
        if ((r.dx / r.dy) == (s.dx / s.dy)) return null;

        const t2 = (r.dx * (s.py - r.py) + r.dy * (r.px - s.px)) / (s.dx * r.dy - s.dy * r.dx);
        const t1 = (r.dx != 0) ? (s.px + s.dx * t2 - r.px) / r.dx : (s.py + s.dy * t2 - r.py) / r.dy;

        return {
            x: r.px + (t1 * r.dx),
            y: r.py + (t1 * r.dy),
            t2: t2,
            t1: t1
        };
    },

    getDotProduct: function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    },

    getMagnitude: function (v) {
        return Math.sqrt(Helpers.sqr(v.x) + Helpers.sqr(v.y));
    },

    getAngleBetweenVectors: function (v1, v2) {
        const dot = Helpers.getDotProduct(v1, v2);
        const v1_mag = Helpers.getMagnitude(v1);
        const v2_mag = Helpers.getMagnitude(v2);
        const cos_angle = dot / (v1_mag * v2_mag);
        const angle = Math.acos(cos_angle);
        return angle;
    },

    getNormal: function (segment, reference_point) {
        reference_point = reference_point || Mouse;
        // the "open" normal will be on the side
        // of the reference point, the mouse in most cases
        if (!segment) return;
        if (segment.segment) segment = segment.segment;

        // Get a unit vector of that perpendicular
        let unit_vector = Helpers.getUnitVector(segment);

        let perp_unit_vector = {
            x: unit_vector.y,
            y: unit_vector.x * -1
        };

        // Get the middle of the origin segment
        let middle_point = Helpers.getSegmentMiddle(segment);

        // Add some distance to the unit normal (for show)
        let dist_mod = 20;
        let mod_vector = {
            x: perp_unit_vector.x * dist_mod,
            y: perp_unit_vector.y * dist_mod
        };

        let point_one = {
            x: Math.round(middle_point.x + mod_vector.x),
            y: Math.round(middle_point.y + mod_vector.y)
        };

        let point_two = {
            x: Math.round(middle_point.x - mod_vector.x),
            y: Math.round(middle_point.y - mod_vector.y)
        };

        let dist_one = Helpers.pDistance(reference_point, point_one);
        let dist_two = Helpers.pDistance(reference_point, point_two);

        if (dist_one.distance <= dist_two.distance) {
            return {
                open: point_one,
                closed: point_two
            };
        }
        return {
            open: point_two,
            closed: point_one
        };
    },

    getSlope: function (p1, p2) {
        return (p2.y - p1.y) / (p2.x - p1.x);
    },

    getUnitVector: function (segment) {
        let vector = {
            x: segment.p2.x - segment.p1.x,
            y: segment.p2.y - segment.p1.y
        };
        let mag = Math.sqrt(Helpers.sqr(vector.x) + Helpers.sqr(vector.y));
        return {
            x: vector.x / mag,
            y: vector.y / mag
        };
    },

    getPerpendicularUnitVector: function (segment) {
        let unit_vector = Helpers.getUnitVector(segment);
        let perp = {
            x: unit_vector.y,
            y: unit_vector.x * -1
        }
        return perp;
    }
};


module.exports = Helpers;
