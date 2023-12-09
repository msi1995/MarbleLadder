import { FormEvent, useState } from "react";
import { BASE_ROUTE } from "../App";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !confirmedPassword || !displayName) {
      alert("Please fill out all required fields.");
      return;
    }
    if (password !== confirmedPassword) {
      alert("Passwords don't match.");
      return;
    }
    if(!email.match(emailRegex)){
      alert("Enter a valid email address.");
      return;
    }
    if(!(displayName.length >= 2)){
      alert("Display name must be at least 2 characters.");
      return;
    }
    if(!(password.length >= 6)){
      alert("Password must be at least 6 characters.");
      return;
    }

    const res = await fetch(BASE_ROUTE + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
        username: displayName,
      }),
    });

    if (res.status === 201) {
      navigate("/login");
    } else {
      const data = await res.json();
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="flex sm:pt-0 pt-28 px-4 h-screen justify-center items-center">
      <div className="max-h-full text-white bg-black opacity-90 sm:px-24 sm:pb-16 px-8 py-6 rounded-md bg-black-opacity-90 overflow-y-auto">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Register
            </h2>
            <p className="mt-2 sm:text-lg text-md leading-8">
              Email, password, and a username!
            </p>
            <p className="mt-2 sm:text-lg text-md leading-8">
              Only your display name will be publicly visible.
            </p>
            {errorMessage !== "" && (
              <p className="mt-2 sm:text-xl text-md leading-8 text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
          <form
            onSubmit={handleRegisterSubmit}
            className="mx-auto z-20 mt-8 max-w-2xl"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-1">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 "
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
                    className="block w-full rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6"
                >
                  Password<span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    autoComplete="password"
                    className="block w-full rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6"
                >
                  Confirm Password<span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="password"
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    name="confirmPassword"
                    id="confirassword"
                    autoComplete="password"
                    className="block w-full rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6"
                >
                  Display Name (no spaces)<span className="text-red-600"> *</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value.replace(/[\s-]/g, ''))}
                    name="displayName"
                    id="displayName"
                    maxLength={14}
                    className="block w-full rounded-md px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-row space-x-12 justify-center">
              <button
                type="submit"
                className="block w-4/5 rounded-md bg-pink-400 hover:bg-pink-500 px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};
