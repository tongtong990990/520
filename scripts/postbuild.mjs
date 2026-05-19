import { copyFileSync, existsSync } from "fs";
import { join } from "path";

const out = join(process.cwd(), "out");
const index = join(out, "index.html");
const nojekyll = join(out, ".nojekyll");

if (existsSync(index)) {
  copyFileSync(index, join(out, "404.html"));
  console.log("Copied index.html -> 404.html for GitHub Pages");
}

if (!existsSync(nojekyll)) {
  copyFileSync(join(process.cwd(), "public", ".nojekyll"), nojekyll);
}
