const SVGSpriter = require('svg-sprite');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

class WebpackSVGSpritePlugin {
    constructor({
        icons = [],
        context = path.resolve(__dirname, 'icons'),
        dest = path.resolve(__dirname, 'dist'),
        filename = null,
        config = {}
    } = {}) {
        if (typeof icons === 'string') {
            let iconImport = require(icons);

            this.icons = Object.keys(iconImport).reduce((iconsArr, item) => {
                return iconsArr.concat(iconImport[item]);
            }, []);

            this.iconsFile = icons;
        } else {
            this.iconsFile = null;
            this.icons = icons;
        }

        this.context = context[context.length - 1] === '/' ? context.slice(0, -1) : context;

        this.filename = filename || (this.iconsFile !== null
            ? this.iconsFile.slice(this.iconsFile.lastIndexOf('/') + 1, this.iconsFile.lastIndexOf('.'))
            : 'sprite') + '.svg';
        this.dest = dest;
        this.config = config;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('SVGSprite', (compilation, callback) => {
            if (this.icons.length > 0) {
                const spriter = new SVGSpriter(Object.assign({
                    dest: 'out',
                    mode: {
                        inline: true,
                        symbol: {
                            dest: this.dest,
                            sprite: this.filename
                        }
                    }
                }, this.config));

                this.icons.forEach(icon => {
                    const svgFilename = `${icon}.svg`;
                    spriter.add(
                        path.resolve(this.context, svgFilename),
                        svgFilename,
                        fs.readFileSync(`${this.context}/${svgFilename}`, 'utf-8')
                    );
                });
                spriter.compile(function (error, result) {
                    if (!error) {
                        for (let mode in result) {
                            for (let resource in result[mode]) {
                                mkdirp.sync(path.dirname(result[mode][resource].path));
                                fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
                            }
                        }
                    }
                });
            }
            callback();
        });
    }
}

module.exports = WebpackSVGSpritePlugin;
