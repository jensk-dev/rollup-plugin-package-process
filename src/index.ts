import type { Plugin } from "rollup";
import fsp from "fs/promises";
import path from "path";
import fs from "fs";
import { proxy } from "./ProcessProxy";
import { green, log, yellow } from "./logger";

type OutputOptions = {
  fileName?: string;
  dir?: string;
  replaceExisting?: boolean;
};

type LoosePackageDefinitionObject = {
  [key: string]: string | number | any[] | LoosePackageDefinitionObject;
};
export type PackageDefinition = LoosePackageDefinitionObject;

export type PackageProcessOptions = {
  inputFileName?: string;
  output?: OutputOptions;
  process?: (inputPackage: PackageDefinition) => void;
};

function defaultProcess(inputPackage: PackageDefinition) {
  return inputPackage;
}

function serialize(packageDef: PackageDefinition): string {
  return JSON.stringify(packageDef, undefined, 2);
}

function deserialize(serializedPackageDef: string): PackageDefinition {
  // TODO: validate
  return JSON.parse(serializedPackageDef);
}

export default function packageProcess(
  options?: PackageProcessOptions
): Plugin {
  return {
    name: "package-process",
    generateBundle: async function (outOptions) {
      const workingDir = process.cwd();
      const inputFile = options?.inputFileName || "package.json";
      const inputFilePath = path.resolve(workingDir, inputFile);
      const inputExists = fs.existsSync(inputFilePath);

      if (!inputExists) {
        throw Error(`Could not resolve input file: "${inputFilePath}"`);
      }

      console.log("");
      log(`Processing ${green(inputFile)}`);

      const outDir = options?.output?.dir
        ? path.resolve(workingDir, options?.output?.dir)
        : outOptions.dir;

      if (!outDir) {
        throw Error(`Could not determine output directory, is it defined?`);
      }

      const outFile = options?.output?.fileName || inputFile;
      const outFilePath = path.resolve(outDir, outFile);

      // check if file should be created
      if (!fs.existsSync(outFilePath) || options?.output?.replaceExisting) {
        // check if the output directory exists, if not create it
        if (!fs.existsSync(outDir)) {
          // make dir
          fs.mkdirSync(outDir, 0o744);
        }

        // read existing file
        const inPackage = await fsp.readFile(inputFilePath, "utf8");
        const inDeserialized = deserialize(inPackage);

        const proxied = proxy(inDeserialized);

        options?.process ? options.process(proxied) : defaultProcess(proxied);

        const outSerialized = serialize(inDeserialized);
        await fsp.writeFile(outFilePath, outSerialized);
      } else {
        throw Error(`A file named ${outFile} already exists at ${outDir}`);
      }
    },
  };
}
