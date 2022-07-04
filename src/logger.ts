const Reset = "\u001B[0m";
const Bright = "\u001B[1m";
const Dim = "\u001B[2m";
const Underscore = "\u001B[4m";
const Blink = "\u001B[5m";
const Reverse = "\u001B[7m";
const Hidden = "\u001B[8m";

const FgBlack = "\u001B[30m";
const FgRed = "\u001B[31m";
const FgGreen = "\u001B[32m";
const FgYellow = "\u001B[33m";
const FgBlue = "\u001B[34m";
const FgMagenta = "\u001B[35m";
const FgCyan = "\u001B[36m";
const FgWhite = "\u001B[37m";

const BgBlack = "\u001B[40m";
const BgRed = "\u001B[41m";
const BgGreen = "\u001B[42m";
const BgYellow = "\u001B[43m";
const BgBlue = "\u001B[44m";
const BgMagenta = "\u001B[45m";
const BgCyan = "\u001B[46m";
const BgWhite = "\u001B[47m";

const prefixColor = FgCyan;

const prefix = `[${prefixColor}package-process${Reset}]:`;

export function log(message?: any, ...optionalParams: any[]) {
  console.log(prefix, message, ...optionalParams);
}

export function highlight(text: string) {
  return `${Bright}${text}${Reset}`;
}

export function yellow(text: string) {
  return `${FgYellow}${text}${Reset}`;
}

export function green(text: string) {
  return `${FgGreen}${text}${Reset}`;
}
