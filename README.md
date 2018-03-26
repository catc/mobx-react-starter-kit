# React Starter Kit

Supports:
- react router
- hot reloading (in dev)
- typescript
- es6/es7 support
	- decorators
	- class properties
- mobx
- scss
- lazy loading components
	- see `src/components/lazy-loader` for info
- linting

Perfect for single page applications that communicate with an API.

## Installation + Setup

To change config for development/builds - see `config/index.js`.

### Setup
- `nvm use 8.9.4`
- `npm install`

### Development
- `npm run dev` and navigate to `localhost:7005`
- to configure server proxy, see `devServerConfig` in `webpack.dev.js`

### Production
- `npm run build`

### Debugging
- `npm run analyze`
	- will run build and display bundles
	- see [bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) for more info

--------------

## TODO
- update dependencies once `babel` and `extract-text-webpack-plugin` when they leave beta
- add test support (jest)
