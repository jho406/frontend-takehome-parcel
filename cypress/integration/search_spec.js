const feature = describe
const scenario = it

feature('The search page', () => {
  scenario('A user visiting for the first time', () => {
    cy.visit('/')

    cy.get('.container')
      .should((el) => {
        expect(el).to.contain.text('There are no items saved yet.')
      })

    cy.get('.search__input--faux')
      .should((el) => {
        expect(el).to.exist
      })
  })

  scenario('A user re-visiting after saving gems', () => {
    const savedGems = {
      foo: {id: 'foo', name:'rails', description: 'Rails is fun'}
    }

    cy.visit('/')
    window.localStorage.setItem('savedGems', JSON.stringify(savedGems))
    cy.reload()

    cy.get('.container')
      .should((el) => {
        expect(el).to.not.contain.text('There are no items saved yet.')
        expect(el).to.contain.text('remove')
        expect(el).to.contain.text('Rails is fun')
      })
  })

  scenario('A user clicking the faux search input', () => {
    cy.server()
    cy.route('GET', '/api/v1/*', [])

    cy.visit('/')
    cy.get('.search__input--faux')
      .focus()

    cy.get('.search-modal')
      .should((el) => {
        expect(el).to.contain.text('Start searching!')
      })
  })

  scenario('A user searching but with no results!', () => {
    cy.server()
    cy.route('GET', '/api/v1/*', [])

    cy.visit('/')
    cy.get('.search__input--faux')
      .focus()
      .get('.search__input')
      .type('rails')
      .wait(1000)

    cy.get('.search-modal')
      .should((el) => {
        expect(el).to.contain.text('No results yet!')
      })
  })

  scenario('A user searching for gems that exists', () => {
    cy.server()
    cy.fixture('search.json').as('search')
    cy.route('GET', 'http://localhost:3000/api/v1/search.json*', '@search')

    cy.visit('/')
    cy.get('.search__input--faux')
      .focus()
      .get('.search__input')
      .type('rails')
      .get('.search-modal')
      .should((el) => {
        expect(el).to.contain.text('rails')
        expect(el).to.contain.text('sprockets-rails')
      })
  })

  scenario('A user saving a gem from their search result', () => {
    cy.server()
    cy.fixture('search.json').as('search')
    cy.route('GET', '/api/v1/*', '@search')

    cy.visit('/')
    cy.get('.search__input--faux')
      .focus()
      .get('.search__input')
      .type('rails')
      .wait(1000)
      .get('.search__result').first()
      .click()
      .get('.search__result__check')
      .should((el) => {
        expect(el).to.be.checked
      })

    cy.get('.saved-gems')
      .should((el) => {
        expect(el).to.contain.text('rails')
      })
  })

  scenario('A user removing savedGems', () => {
    const savedGems = {
      foo: {id: 'foo', name:'rails', description: 'Rails is fun'}
    }

    cy.visit('/')
    window.localStorage.setItem('savedGems', JSON.stringify(savedGems))
    cy.reload()

    cy.get('.saved-gems')
      .should((el) => {
        expect(el).to.contain.text('Rails is fun')
      })

    cy.get('.saved-gems__item__remove-link')
      .click()

    cy.get('.saved-gems')
      .should((el) => {
        expect(el).to.not.contain.text('Rails is fun')
        expect(window.localStorage.getItem('savedGems')).to.be.null
      })
  })
})
