describe('Site is functioning', () => {
  it('Ensures the site is responding', () => {
    cy.visit("http://localhost:3000")
  })
})