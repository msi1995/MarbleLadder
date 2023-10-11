describe("Login API", () => {
  it("Logs in with valid credentials", () => {
    // Define the login request payload
    const loginData = {
      email: "lloyd.dg7@gmail.com",
      password: "123",
    };
    cy.request("POST", "/login", loginData).then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Login Successful");
        expect(response.body.token).to.not.be.empty;
      }
    );
  });

  it("Shows an error with invalid credentials", () => {
    // Define the login request payload with invalid credentials
    const invalidLoginData = {
      email: "invalid@example.com",
      password: "wrongpassword",
    };

    // Send a POST request to the login endpoint with invalid credentials
    cy.request({
      method: "POST",
      url: "/login",
      body: invalidLoginData,
      failOnStatusCode: false, // Add this option to prevent the test from failing on non-2xx status codes
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Incorrect email or password");
    });
  });
});
