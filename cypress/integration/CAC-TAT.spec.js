/// <reference types="Cypress" />

describe ('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Teste 01 testo muito longo para ver como fica lá meu amigo, tão grande que vamos ver escrever' 

        cy.clock() //concela o relatório para o momento do teste

        cy.get('#firstName').type('Francisco')
        cy.get('#lastName').type('Martins')
        cy.get('#email').type('franciscom@teste.com')
        cy.get('#open-text-area').type(longText, { delay:0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(3000) // avança o relório pelo tempo passado
        cy.get('.success').should('be.not.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        const emailErrado = 'email.email.com'

        cy.get('#firstName').type('Francisco')
        cy.get('#lastName').type('Martins')
        cy.get('#email').type(emailErrado)
        cy.get('#open-text-area').type('Teste email fail')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') 
    })

    it('campo telefone recebe apenas numeros', function() {
        cy.get('#phone').type('abcxpto')

        cy.should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Francisco')
        cy.get('#lastName').type('Martins')
        cy.get('#email').type('francisco@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Nao preeche telefone obrigatório')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
          .type('Francisco')
          .should('have.value','Francisco')
          .clear()
          .should('have.value', '')
        
       cy.get('#lastName')
         .type('Martins')
         .should('have.value', 'Martins')
         .clear()
         .should('have.value', '')
        
       cy.get('#email')
         .type('francisco@teste.com')
         .should('have.value', 'francisco@teste.com')
         .clear()
         .should('have.value', '')
    

       cy.get('#phone')
         .type('1234567890')
         .should('have.value', '1234567890')
         .clear()
         .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.get('#phone-checkbox').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"')
          .check()
          .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
          })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')  
          .check() 
          .should('be.checked')
          .last()
          .uncheck()
          .should('be.not.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json')
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('@sampleFile')
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
          .invoke('removeAttr','target')
          .click()

        cy.get('#title').should('be.visible','CAC TAT - Política de privacidade')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')

      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function() {
      const longText = Cypress._.repeat('0123456789', 20)  // lodash para criar testo grande repetindo

      cy.get('#open-text-area')
        .invoke('val', longText) // passando a variável no "valor" do text-area
        .should('have.value', longText)
    })

    it('faz uma requisição HTTP', function() {
      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')

        .should(function(response) {
          //console.log(response)
          const { status, statusText, body } = response
          expect(status).to.equal(200)
          expect(statusText).to.equal('OK')
          expect(body).to.include('CAC TAT')
        })
     })

     it('encontra o gato escondido', function() {
      cy.get('#cat')
        .invoke('show')
        .should('be.visible')
      cy.get('#title')
        .invoke('text', 'CAT TAT')
      cy.get('#subtitle')
        .invoke('text', 'Easter Egg Cat')
     })

})