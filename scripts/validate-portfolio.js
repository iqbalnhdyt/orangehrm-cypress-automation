const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];

const required = [
  '.gitignore',
  'package.json',
  'cypress.config.js',
  'README.md',
  'cypress/e2e/login.cy.js',
  'cypress/e2e/directory.cy.js',
  'cypress/e2e/recruitment.cy.js',
  'cypress/pages/LoginPage.js',
  'cypress/pages/DirectoryPage.js',
  'cypress/pages/RecruitmentPage.js',
  'cypress/fixtures/loginData.json',
  'cypress/fixtures/directoryData.json',
  'cypress/fixtures/recruitmentData.json',
  'cypress/support/e2e.js',
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Missing required file: ${rel}`);
}

const forbiddenPaths = [
  'cypress/fixtures/example.json',
  'cypress/pages/POMLoginPage.js',
];
for (const rel of forbiddenPaths) {
  if (fs.existsSync(path.join(root, rel))) errors.push(`Forbidden path present: ${rel}`);
}

function read(rel) {
  const p = path.join(root, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}


const gitignore = read('.gitignore');
for (const entry of ['node_modules/', 'cypress/videos/', 'cypress/screenshots/', '.env']) {
  if (gitignore && !gitignore.includes(entry)) errors.push(`.gitignore must exclude: ${entry}`);
}

const support = read('cypress/support/e2e.js');
if (/uncaught:exception[\s\S]{0,300}return false;[\s\S]{0,100}\}\);/m.test(support) && !/includes\(/.test(support)) {
  errors.push('Support file appears to suppress all uncaught exceptions.');
}

const loginPage = read('cypress/pages/LoginPage.js');
if (loginPage.includes('failOnStatusCode: false')) errors.push('LoginPage still disables failOnStatusCode.');
if (loginPage.includes('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')) {
  errors.push('LoginPage still hard-codes the full OrangeHRM login URL.');
}

const loginSpec = read('cypress/e2e/login.cy.js');
if (/request\.body[\s\S]{0,180}invalidUser\.password/.test(loginSpec)) {
  errors.push('Login spec still inspects the invalid password in request body.');
}

const specFiles = [
  'cypress/e2e/login.cy.js',
  'cypress/e2e/directory.cy.js',
  'cypress/e2e/recruitment.cy.js',
];
for (const rel of specFiles) {
  const text = read(rel);
  const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(text))) {
    const base = path.resolve(path.dirname(path.join(root, rel)), match[1]);
    const candidates = [base, `${base}.js`, path.join(base, 'index.js')];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      errors.push(`Broken relative import in ${rel}: ${match[1]}`);
    }
  }
}

const specs = [
  ['login', read('cypress/e2e/login.cy.js')],
  ['directory', read('cypress/e2e/directory.cy.js')],
  ['recruitment', read('cypress/e2e/recruitment.cy.js')],
];
let total = 0;
for (const [name, text] of specs) {
  if (!text) continue;
  const count = (text.match(/\bit\s*\(/g) || []).length;
  total += count;
  if (count !== 8) errors.push(`${name}.cy.js must contain 8 baseline tests; found ${count}.`);
}
if (specs.every(([, text]) => text) && total !== 24) errors.push(`Expected 24 baseline tests; found ${total}.`);

const pkgText = read('package.json');
if (pkgText) {
  try {
    const pkg = JSON.parse(pkgText);
    const scripts = pkg.scripts || {};
    for (const key of ['test', 'cy:open', 'cy:run', 'validate']) {
      if (!scripts[key]) errors.push(`Missing npm script: ${key}`);
    }
    const deps = Object.keys(pkg.dependencies || {});
    if (deps.length) errors.push(`Runtime dependencies should be empty; found: ${deps.join(', ')}`);
    const devDeps = Object.keys(pkg.devDependencies || {});
    if (devDeps.length !== 1 || devDeps[0] !== 'cypress') {
      errors.push(`devDependencies should contain only cypress; found: ${devDeps.join(', ') || '(none)'}`);
    }
  } catch (e) {
    errors.push(`package.json is invalid JSON: ${e.message}`);
  }
}

const readme = read('README.md');
if (readme && !/24 automated test cases/i.test(readme)) errors.push('README must state the actual 24 automated test cases.');
if (readme && !/OrangeHRM Open Source Demo/i.test(readme)) errors.push('README must identify OrangeHRM Open Source Demo.');

if (errors.length) {
  console.error('Portfolio validation FAILED:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Portfolio validation PASSED: clean structure, 24 baseline tests, recruiter-facing constraints satisfied.');
