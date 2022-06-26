import type {Plugin} from "rollup";
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

type OutputOptions = {
  fileName?: string,
  dir?: string,
  replaceExisting?: boolean;
}

type LoosePackageDefinitionObject = {[key: string]: string | number | any[] | LoosePackageDefinitionObject}
type PackageDefinition = LoosePackageDefinitionObject

type PackageProcessOptions = {
  inputFileName?: string;
  output?: OutputOptions;
  process?: (inputPackage: PackageDefinition) => PackageDefinition
}

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

export default function packageProcess(options?: PackageProcessOptions): Plugin {
  return {
    name: "package-process",
    generateBundle: async function(outOptions) {
      const workingDir = process.cwd();
      const inputFile = options?.inputFileName || "package.json";
      const inputFilePath = resolve(workingDir, inputFile);
      const inputExists = existsSync(inputFilePath);

      if (!inputExists) {
        throw Error(`Could not resolve input file: "${inputFilePath}"`);
      }

      const outDir = options?.output?.dir
        ? resolve(workingDir, options?.output?.dir)
        : outOptions.dir;

      if (!outDir) {
        throw Error(`Could not determine output directory, is it defined?`);
      }

      const outFile = options?.output?.fileName || inputFile
      const outFilePath = resolve(outDir, outFile);

      // check if file should be created
      if (!existsSync(outFilePath) || options?.output?.replaceExisting) {
        // check if the output directory exists, if not create it
        if (!existsSync(outDir)) {
          // make dir
          mkdirSync(outDir, 0o744);
        }

        // read existing file
        const inPackage = await readFile(inputFilePath, 'utf8');
        const inDeserialized = deserialize(inPackage);

        const processed = options?.process
          ? options.process(inDeserialized)
          : defaultProcess(inDeserialized);

        const outSerialized = serialize(processed);
        await writeFile(outFilePath, outSerialized);
      } else {
        throw Error(`A file named ${outFile} already exists at ${outDir}`)
      }
    }
  };
}