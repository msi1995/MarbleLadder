describe("Login API", () => {
    // it("Registers for an account", () => {
    //   // Define the login request payload
    //   const signupData = {
    //     email: "cypress.dg7@gmail.com",
    //     password: "password",
    //     username: "msiCypress"
    //   };
    //   cy.request("POST", "/register", signupData).then(
    //     (response) => {
    //       expect(response.status).to.equal(201);
    //       expect(response.body.message).to.equal("User Created Successfully");
    //     }
    //   );
    // });
  
    it("Throws an error if the email is already in use", () => {
        const takenEmailData = {
          email: "lloyd.dg7@gmail.com",
          password: "password",
          username: "veryUnique"
        };
      
        cy.request({
          method: "POST",
          url: "/register",
          body: takenEmailData,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(500);
          expect(response.body.message).to.equal("Account with that email already exists");
        });
      });
      
      it("Throws an error if the username is taken", () => {
        const takenUsernameData = {
          email: "asdf444@gmail.com",
          password: "password",
          username: "msi"
        };
      
        cy.request({
          method: "POST",
          url: "/register",
          body: takenUsernameData,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(500);
          expect(response.body.message).to.equal("That username is taken");
        });
    })

  });