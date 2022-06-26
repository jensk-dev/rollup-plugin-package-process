# plugin-rollup-package-process

## Disclaimer

This plugin is incredibly barebones and doesn't hold the hand of the developer implementing it. However, it allows the implementing party to transform the package.json file if they wish. Therefore, this plugin is primarily useful when bundling for an npm package, and you need to strip parts of your development package.json from the published version.

## Example Usage

```
// rollup.config.js
import packageProcess from "@jensk/rollup-plugin-package-process";

export default {
  // ...
  plugins: [
    packageProcess({
      output: {
        replaceExisting: true
      },
      process: (inputPackage) => {
        inputPackage.peerDependencies = inputPackage.dependencies;
        
        delete inputPackage.devDependencies;
        delete inputPackage.dependencies;
        delete inputPackage.scripts;

        return inputPackage;
      }
    })
  ]
};
```