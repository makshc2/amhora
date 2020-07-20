const webpack = require('webpack')
const locales = require('./src/assets/resources/Languages')
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const paths = require('./sitemapPaths')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(getLocalesForMomemt(locales))),
      new SitemapPlugin('https://amhora.com', paths, {
        filename: 'sitemap.xml',
        lastmod: true,
      })
    ],
  }
};

function getLocalesForMomemt(locales) {
  let localesValues = []
  for(const locale in locales) {
    localesValues.push(locales[locale].moment)
  }
  return localesValues.join('|')
}
