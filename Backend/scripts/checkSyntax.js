const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== "node_modules" && f !== ".git") {
        files = files.concat(walk(p));
      }
    } else if (f.endsWith(".js") || f.endsWith(".mjs")) {
      files.push(p);
    }
  }
  return files;
}

const all = walk(path.join(__dirname, "../src")).concat([
  path.join(__dirname, "../server.js"),
]);

console.log(`Checking ${all.length} backend files for syntax errors...`);
let errCount = 0;
for (const file of all) {
  try {
    execSync(`node --check "${file}"`, { stdio: "pipe" });
  } catch (err) {
    console.error(`❌ Syntax error in: ${file}`);
    errCount++;
  }
}

if (errCount === 0) {
  console.log(`✅ All ${all.length} backend files passed syntax verification!`);
} else {
  console.error(`❌ Found ${errCount} files with syntax errors.`);
  process.exit(1);
}
