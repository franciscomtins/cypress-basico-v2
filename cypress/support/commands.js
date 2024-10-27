Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Martins')
    cy.get('#email').type('franciscom@teste.com')
    cy.get('#open-text-area').type('testando função customizada')
    cy.contains('button', 'Enviar').click()
})