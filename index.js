import SVGSpriter from 'svg-sprite';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

export default class WebpackSVGSpritePlugin {
    constructor({
        icons = [],
        context = path.resolve(__dirname, 'icons'),
        dest = path.resolve(__dirname, 'dist'),
        filename = null
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
    }
    apply(compiler) {
        compiler.plugin('after-emit', (compilation, callback) => {
            if (this.icons.length > 0) {
                const spriter = new SVGSpriter({
                    dest: 'out',
                    mode: {
                        inline: true,
                        symbol: {
                            dest: this.dest,
                            sprite: this.filename
                        }
                    }
                });

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
