class ImageCache {
    constructor () {
        this.cached_images = {};
        this.image_promises = {};
    }

    load (image_key, image_source) {
        const cached_image = this.cached_images[image_source];

        const image_promise = new Promise((resolve) => {
            if (cached_image) {
                if (cached_image.complete) {
                    resolve({
                        key: image_key,
                        image: cached_image
                    });
                } else {
                    this.image_promises[image_source].push({
                        resolve: resolve,
                        payload: {
                            key: image_key,
                            image: cached_image
                        }
                    });
                }
                return;
            }

            console.log('Image load called for: ' + image_source);

            const img = new Image();
            img.onload = () => {
                this.image_promises[image_source].forEach((image_promise) => {
                    image_promise.resolve(image_promise.payload);
                });
                this.image_promises[image_source] = [];
            };
            img.onerror = () => {
                resolve(null);
            };
            this.cached_images[image_source] = img;
            this.image_promises[image_source] = [{
                resolve: resolve,
                payload: {
                    key: image_key,
                    image: img
                }
            }];

            img.src = image_source;
        });

        return image_promise;
    }
}

module.exports = new ImageCache();