# Webpack SVG Sprite Plugin
Build an SVG sprite with Webpack and [svg-sprite](https://github.com/jkphl/svg-sprite) using configuration rather than imported dependencies in your app bundles. This is helpful if your app is not entirely powered by your bundled files - for example, a multi-page application made up of server-side and client-side components.

## Usage
**webpack.config.babel.js**
```javascript
import path from 'path';
import webpack from 'webpack';
import WebpackSVGSpritePlugin from 'webpack-svg-sprite';
import icons from './svg-sprite.js';
...
module.exports = {
    ...
    plugins: [
        new WebpackSVGSpritePlugin({icons}),
        ...
    ]
    ...
};
```
**svg-sprite.js**
```javascript
export default [
    'user',
    'lock',
    'menu',
    ...
];
```
It's up to you to include the sprite in your app now, but once you've got it, you can now do this:
```html
    <svg>
        <use href="#user"></use>
    </svg>
```
## Options
|Name|Type|Default|Description|
|---|---|---|---|
|**icons**|`Array<String>` \| `String`|`[]`|Either an array of icon names, or a reference to a config file containing the list. Each icon's file name will be used as the ID (i.e. `icon-name.svg` will be `'icon-name'`).|
|**context**|`String`|`'./icons'`|The path to the folder containing the separate SVG icon files.|
|**dest**|`String`|`'./dist'`|The path to the output folder where the generated SVG sprite file will be placed.|
|**filename**|`String`|`'sprite.svg'` <br>or the name of the config file if `options.icons` is a string.|The name of the generated SVG sprite file. (i.e. `'svg-sprite.svg'`|
