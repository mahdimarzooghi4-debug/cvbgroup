import { createInterface } from "node:readline";
import { hash } from "bcryptjs";

if (!process.stdin.isTTY || !process.stdin.setRawMode) {
  throw new Error("Run this script from an interactive terminal to keep the password hidden.");
}

process.stdout.write("گذرواژه مدیر را وارد کنید (حداقل ۱۲ نویسه): ");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
let password = "";
const input = createInterface({ input: process.stdin, output: process.stdout, terminal: false });

process.stdin.on("data", async (chunk: string) => {
  for (const char of chunk) {
    if (char === "\u0003") { process.exit(130); }
    if (char === "\r" || char === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      input.close();
      process.stdout.write("\n");
      if (password.length < 12) { process.stderr.write("گذرواژه باید حداقل ۱۲ نویسه داشته باشد.\n"); process.exit(1); }
      const passwordHash = await hash(password, 12);
      password = "";
      process.stdout.write(`ADMIN_PASSWORD_HASH=${passwordHash}\n`);
      process.exit(0);
    }
    if (char === "\u007f" || char === "\b") password = password.slice(0, -1);
    else password += char;
  }
});
