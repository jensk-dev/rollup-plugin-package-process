import type { PackageDefinition } from "./index";
import { green, highlight, log, yellow } from "./logger";

const propDisplayName = (text: string) => highlight(green(text));
const propDisplayVal = <T extends {[key: string | symbol]: unknown}>(prop: string | symbol, target: T) => {
  const type = typeof prop;

  switch (type)
  {
    case "string":
    case "number":
      return target[prop];
    default:
      return type;
  }
}

const handlers: ProxyHandler<PackageDefinition> = {
  deleteProperty(target, p) {
    const displayName = propDisplayName(String(p));
    const success = Reflect.deleteProperty(target, p);

    if (success) log(`${green("✔")}  Removed ${displayName}`);
    else log(`${highlight(yellow("!"))} Could not remove ${displayName}`);

    return success;
  },
  defineProperty(target, p, attributes) {
    const displayName = propDisplayName(String(p));
    const success = Reflect.defineProperty(target, p, attributes);
    const displayVal = propDisplayVal(p, target);
    
    if (success) log(`${green("✔")}  Set ${displayName} to ${displayVal}`)
    else log(`${highlight(yellow("!"))} Could not set ${displayName}`);

    return success;
  },
  set(target, p, value, receiver) {
    const displayName = propDisplayName(String(p));
    const success = Reflect.set(target, p, value);
    const displayVal = propDisplayVal(p, target);
    
    if (success) log(`${green("✔")}  Set ${displayName} to ${displayVal}`)
    else log(`${highlight(yellow("!"))} Could not set ${displayName}`);

    return true;
  },
};

export function proxy(packageDef: PackageDefinition): PackageDefinition {
  return new Proxy(packageDef, handlers);
}
