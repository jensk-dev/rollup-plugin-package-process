import type { PackageDefinition } from "./index";
import { green, highlight, log, yellow } from "./logger";

const handlers: ProxyHandler<PackageDefinition> = {
  deleteProperty(target, p) {
    const oldVal = target[p as string];
    const type = typeof oldVal;
    const success = Reflect.deleteProperty(target, p);

    const propName = highlight(String(p));

    if (success) {
        log(`${green("✔")}  Removed ${propName} (${ type === "string" || type === "number" ? oldVal : type })`)

    } else {
        log(`${highlight(yellow("!"))} ${propName} could not be stripped`)
    }

    return success;
  },
  defineProperty(target, p, attributes) {
    const success = Reflect.defineProperty(target, p, attributes);
    
    const propName = highlight(String(p));

    if (success) {
        log(`${green("✔")}  Added ${propName} (${target[p as string]})`)
    } else {
        log(`${highlight(yellow("!"))} ${propName} could not be added`)
    }

    return success;
  },
  set(target, p, value, receiver) {
    const oldVal = target[p as string];
    const success = Reflect.set(target, p, value);
    const propName = highlight(String(p));

    const type = typeof target[p as string];

    if (success) {
        const change = type === "string" || type === "number" ? `${oldVal} → ${target[p as string]}` : type;

        if (oldVal === undefined) {
            log(`${green("✔")}  Added ${propName} (${target[p as string]})`)
        } else {
            log(`${green("✔")}  Changed ${propName} (${change})`)
        }
    } else {
        log(`${highlight(yellow("!"))} ${propName} could not be altered`)
    }

    return true;
  },
};

export function proxy(packageDef: PackageDefinition): PackageDefinition {
  return new Proxy(packageDef, handlers);
}
