autoprefixer = require('autoprefixer');
postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
postcssExtract = require('postcss-extract');
path = require('path');
const postcssInlineSvg = require('postcss-inline-svg');

module.exports = {
    plugins: [
	    autoprefixer({ browsers: ["last 3 versions", "ie 10"] }),
	    require('postcss-object-fit-images'),
	    postcssFlexbugsFixes(),
	    require('postcss-custom-media'),
	    require('postcss-media-minmax'),
        postcssInlineSvg({path: 'app/general/svg' })
    ]
};
