describe('Homepage responds', () => {
  it('Ensures the site is responding', () => {
    cy.visit("http://localhost:3000")
  })
})