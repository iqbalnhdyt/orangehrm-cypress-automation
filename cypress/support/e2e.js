// OrangeHRM Open Source Demo occasionally throws known application-side
// exceptions while the tested UI remains usable. Suppress only the exact
// known demo exceptions; unexpected exceptions must still fail the test.
Cypress.on('uncaught:exception', (err) => {
  const knownDemoErrors = [
    "Cannot read properties of undefined (reading 'response')",
    "Cannot read properties of null (reading 'nextSibling')",
    "Cannot read properties of undefined (reading 'nextSibling')"
  ];

  if (knownDemoErrors.some((message) => err.message.includes(message))) {
    return false;
  }

  // Do not return false for unknown exceptions.
  return undefined;
});
