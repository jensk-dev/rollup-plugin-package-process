# plugin-rollup-package-process

## Disclaimer

This plugin is incredibly barebones and doesn't hold the hand of the developer implementing it. However, it allows the implementing party to transform the package.json file if they wish. Therefore, this plugin is primarily useful when bundling for an npm package, and you need to strip parts of your development package.json from the published version.

## Example Usage

```js
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

## Options

### inputFileName

Type: ``string?`` | Default: ``package.json``

The file's name to process is relative to the project's working directory (usually the root). By default, the value is ``package.json``.

### output

Type: ``OutputOptions?`` | Default: ``undefined``

#### fileName

Type: ``string?`` | Default: ``options.inputFileName``

Used to specify the name to use for the output file. Defaults to [options.inputFileName](#inputfilename)

#### dir

Type: ``string?`` | Default: ``rollup.output.dir``

Specifies the output directory of the processed ``package.json`` file. ``dir`` defaults to the output directory specified in the rollup output configuration.

#### replaceExisting

Type: ``boolean?`` | Default: ``undefined``

If defined, ``replaceExisting`` indicates whether an existing file at the [output directory](#dir) should be overwritten.

### process

Type ``(inputPackage: PackageDefinition) => PackageDefinition`` | Default: ``undefined``

A function that gets the contents of the input file and returns the output used to store at the [output location](#output). You should use this method to process the `package.json` by, for instance, deleting or altering existing fields or adding new ones. See [usage](#example-usage)