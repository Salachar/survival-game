const Helpers = {
	uuid: function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	rgba: function (r,g,b,a) {
		var a = (a) ? a : 1;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")"
	},

	sqr: function (value) {
		return value * value;
	},

	getDistance: function (p1, p2, no_sqrt) {
		let dist = Helpers.sqr(p1.x - p2.x) + Helpers.sqr(p1.y - p2.y);
		if (no_sqrt) return dist;
		return Math.sqrt(dist);
	},

	getRandomArbitrary: function (min, max){
		return Math.random() * (max - min) + min;
	},

	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	returnRandom: function (numbers) {
		var length = numbers.length;
		var index = getRandomInt(0, length-1);
		return numbers[index];
	},

	percentage: function (percent) {
		return (getRandomInt(1,100) >= percent);
	},

	getMouseCoords: function (event, canvas) {
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = canvas;

		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;

		while(currentElement = currentElement.offsetParent){
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		}

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return {
			x : canvasX,
			y : canvasY
		};
	},

    createElement: function (type, classes, opts) {
        opts = opts || {};
        let node = document.createElement(type);
        let classes_split = classes.split(' ');
        for (let i = 0; i < classes_split.length; ++i) {
            node.classList.add(classes_split[i]);
        }
        if (opts.attributes) {
            for (let attr in opts.attributes) {
                if (opts.attributes[attr]) {
                    node.setAttribute(attr, opts.attributes[attr]);
                }
            }
        }
        if (opts.dataset) {
            for (let data in opts.dataset) {
                if (opts.dataset[data]) {
                    node.dataset[data] = opts.dataset[data];
                }
            }
        }
        if (opts.events) {
            for (let event in opts.events) {
                node.addEventListener(event, opts.events[event]);
            }
        }
        if (opts.html) {
            node.innerHTML = opts.html;
        }
        if (opts.addTo) {
            opts.addTo.appendChild(node);
        }
        return node;
    }
};
module.exports = Helpers;
