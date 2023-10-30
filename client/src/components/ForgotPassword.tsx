import { useState } from "react";
import { BASE_ROUTE } from "../App";
import { useNavigate } from "react-router-dom";
export const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  const handleResetSubmit = async (event: any) => {
    event.preventDefault();
    if (!email) {
      alert("Please fill out all required fields.");
      return;
    }

    const res = await fetch(BASE_ROUTE + "/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (res.status === 200) {
      setResetEmailSent(true);

    } else {
      console.log("error")
    }
  };

  return (
    <div className="flex pt-16 h-screen w-screen relative overflow-x-hidden justify-center items-center">
      <div className="text-white bg-black sm:px-24 sm:py-16 px-8 py-6 rounded-md bg-black-opacity-90">
        {!resetEmailSent ? (
        <>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Password Reset
            </h2>
            <p className="mt-2 sm:text-lg text-md leading-8 sm:px-24 text-white">
              Enter the email associated with the account.
            </p>
            {/* <p className="mt-2 sm:text-xl text-lg leading-8 sm:px-24 text-red-600">
              {errorMessage}
            </p> */}
          </div>
          <form
            onSubmit={handleResetSubmit}
            className="mx-auto z-20 mt-12 max-w-2xl"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-1">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-white "
                >
                  Email address<span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
              </div>
            </div>
            <div className="mt-12 flex flex-row space-x-12 justify-center">
              <button
                type="submit"
                className="block w-3/4 rounded-md bg-pink-400 hover:bg-pink-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send Reset Email
              </button>
            </div>
          </form>
        </>) : (<div>Reset email sent.</div>)}
      </div>
    </div>
  );
};
