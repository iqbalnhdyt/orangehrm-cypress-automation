import loginPage from '../pages/LoginPage';
import directoryPage from '../pages/DirectoryPage';

describe('OrangeHRM Directory - POM', () => {

  let loginData;
  let directoryData;


  before(() => {

    cy.fixture('loginData').then((data) => {
      loginData = data;
    });

    cy.fixture('directoryData').then((data) => {
      directoryData = data;
    });

  });



  beforeEach(() => {

    loginPage.visit();

    loginPage.login(
      loginData.validUser.username,
      loginData.validUser.password
    );

    cy.url()
      .should('include', '/dashboard');

    directoryPage.openDirectory();

  });



  it('TC01 - Halaman Directory berhasil dibuka', () => {

    cy.url()
      .should('include', '/directory');

    directoryPage.pageTitle()
      .should('be.visible');

    directoryPage.employeeNameInput()
      .should('be.visible');

    directoryPage.searchButton()
      .should('be.visible');

  });



  it('TC02 - Kolom Employee Name dapat diisi', () => {

    directoryPage.typeEmployeeName(
      directoryData.employee.name
    );

    directoryPage.employeeNameInput()
      .should(
        'have.value',
        directoryData.employee.name
      );

  });



  it('TC03 - Tombol Search dapat digunakan', () => {

    cy.intercept(
      'GET',
      '**/api/v2/directory/employees*'
    ).as('directorySearch');

    directoryPage.clickSearch();

    cy.wait('@directorySearch')
      .then((interception) => {

        expect(interception.request.method)
          .to.eq('GET');

        expect(interception.response.statusCode)
          .to.eq(200);

      });

  });



  it('TC04 - Tombol Reset dapat digunakan', () => {

    directoryPage.typeEmployeeName(
      directoryData.employee.name
    );

    directoryPage.selectFirstEmployeeSuggestion();


    cy.intercept(
      'GET',
      '**/api/v2/directory/employees*'
    ).as('searchDirectory');

    directoryPage.clickSearch();

    cy.wait('@searchDirectory')
      .then((interception) => {

        expect(interception.response.statusCode)
          .to.eq(200);

        const requestUrl = new URL(
          interception.request.url
        );

        expect(
          requestUrl.searchParams.get('nameOrId')
        ).to.eq(
          directoryData.employee.name
        );

      });


    cy.intercept(
      'GET',
      '**/api/v2/directory/employees*'
    ).as('resetDirectory');

    directoryPage.clickReset();

    cy.wait('@resetDirectory')
      .then((interception) => {

        expect(interception.request.method)
          .to.eq('GET');

        expect(interception.response.statusCode)
          .to.eq(200);

        const requestUrl = new URL(
          interception.request.url
        );

        expect(
          requestUrl.searchParams.has('nameOrId')
        ).to.eq(false);

      });


    directoryPage.employeeNameInput()
      .should('have.value', '');

  });



  it(
    'TC05 - Pencarian Directory berhasil menampilkan data',
    () => {

      cy.intercept(
        'GET',
        '**/api/v2/directory/employees*'
      ).as('directoryList');

      directoryPage.clickSearch();

      cy.wait('@directoryList')
        .then((interception) => {

          expect(interception.request.method)
            .to.eq('GET');

          expect(interception.response.statusCode)
            .to.eq(200);

        });


      directoryPage.resultCards()
        .should(
          'have.length.greaterThan',
          0
        );

    }
  );



  it(
    'TC06 - Pencarian Employee yang tidak terdaftar',
    () => {

      directoryPage.typeEmployeeName(
        directoryData.invalidEmployee.name
      );


      directoryPage.autocompleteNoRecords()
        .should('be.visible')
        .and(
          'contain',
          'No Records Found'
        );

    }
  );

  

  it('TC07 - Field Job Title tersedia dan aktif', () => {

    directoryPage.jobTitleDropdown()
      .should('be.visible')
      .and(
        'have.class',
        'oxd-select-text--active'
      )
      .and(
        'contain',
        '-- Select --'
      );

  });



  it('TC08 - Field Location tersedia dan aktif', () => {

    directoryPage.locationDropdown()
      .should('be.visible')
      .and(
        'have.class',
        'oxd-select-text--active'
      )
      .and(
        'contain',
        '-- Select --'
      );

  });

});