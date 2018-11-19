
<p align="center">
  <img src="https://github.com/ridaamirini/zammad-jira-web/blob/master/src/icons/icon_128.png">
</p>

<h1 align="center">:hatched_chick: Zammad <=> Jira</h1>

This web extension lets you create a issue from the [Zammad](https://zammad.com/de) Helpdesk.

### Installing

1. Install Zammad/Jira Web from [Chrome Web Store](https://chrome.google.com/webstore/detail/zammadjira-web/knhicoaokhccbpkdihcfnloekimjhjgh) or
[Download](https://github.com/ridaamirini/zammad-jira-web/releases) the latest version
2. Enable "__Developer Mode__" in your Browser :exclamation:
3. Unzip or Drag the release in to the Extensions page of your Browser
4. Open the "__Option Page__" of __Zammad/Jira Web__ :point_left:
   1. Enter required data :point_up:
   2. Enjoy the web extension :raised_hands:

### Tested on...

- [x] ~~Google Chrome~~
- [ ] Mozilla Firfox

## Deployment

### `npm run build` 

Build the extension into `dist` folder for **production**.

### `npm run build:dev` 

Build the extension into `dist` folder for **development**.

### `npm run watch`

Watch for modifications then run `npm run build`.

### `npm run watch:dev`

Watch for modifications then run `npm run build:dev`.

It also enable [Hot Module Reloading](https://webpack.js.org/concepts/hot-module-replacement), thanks to [webpack-chrome-extension-reloader](https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader) plugin. 

:warning: Keep in mind that HMR only works for your **background** entry.

### `npm run build-zip`

Build a zip file following this format `<name>-v<version>.zip`, by reading `name` and `version` from `manifest.json` file.
Zip file is located in `dist-zip` folder.

## Built With

* [Vue](https://github.com/vuejs/vue) - A JavaScript framework
* [VueWebExtension](https://github.com/Kocal/vue-web-extension) - A boilerplate for quickly starting a web extension with Vue, webpack 4, ESLint and more!

## Authors

* **Rida Amirini** - *Initial work* - [ridaamirini](https://github.com/ridaamirini)

See also the list of [contributors](https://github.com/ridaamirini/zammad-jira-web/contributors) who participated in this project.

## License

MIT © [ridaamirini](https://github.com/ridaamirini)
