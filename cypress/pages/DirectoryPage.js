class DirectoryPage {


  menuDirectory() {
    return cy.contains(
      'span',
      'Directory',
      { timeout: 20000 }
    );
  }


  pageTitle() {
    return cy.contains(
      'h6',
      'Directory',
      { timeout: 20000 }
    );
  }



  employeeNameInput() {
    return cy.get(
      'input[placeholder="Type for hints..."]',
      { timeout: 20000 }
    );
  }


  typeEmployeeName(name) {
    this.employeeNameInput()
      .should('be.visible')
      .clear()
      .type(name);
  }


  employeeSuggestionOptions() {
    return cy.get(
      '.oxd-autocomplete-dropdown [role="option"]',
      { timeout: 20000 }
    );
  }


  selectFirstEmployeeSuggestion() {
    this.employeeSuggestionOptions()
      .first()
      .should('be.visible')
      .click();
  }


  autocompleteDropdown() {
    return cy.get(
      '.oxd-autocomplete-dropdown',
      { timeout: 20000 }
    );
  }


  autocompleteNoRecords() {
    return this.autocompleteDropdown()
      .should('be.visible')
      .and('contain', 'No Records Found');
  }



  jobTitleDropdown() {
    return cy.contains(
      '.oxd-input-group',
      'Job Title',
      { timeout: 20000 }
    )
      .find('.oxd-select-text');
  }



  locationDropdown() {
    return cy.contains(
      '.oxd-input-group',
      'Location',
      { timeout: 20000 }
    )
      .find('.oxd-select-text');
  }


  dropdownOptions() {
    return cy.get(
      '.oxd-select-dropdown',
      { timeout: 20000 }
    );
  }



  searchButton() {
    return cy.get(
      'button[type="submit"]',
      { timeout: 20000 }
    );
  }


  resetButton() {
    return cy.contains(
      'button',
      'Reset',
      { timeout: 20000 }
    );
  }


  clickSearch() {
    this.searchButton()
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }


  clickReset() {
    this.resetButton()
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }



  resultCards() {
    return cy.get(
      '.orangehrm-directory-card',
      { timeout: 20000 }
    );
  }



  openDirectory() {
    this.menuDirectory()
      .should('be.visible')
      .click();

    cy.url()
      .should('include', '/directory');
  }

}

export default new DirectoryPage();