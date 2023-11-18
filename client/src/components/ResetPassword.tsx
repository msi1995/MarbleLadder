import { FormEvent, useEffect, useState } from "react";
import { BASE_ROUTE } from "../App";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState<string>("");
  const [alternateText, setAlternateText] = useState<string>("Token is invalid or has expired.")
  const [searchParams, setSearchParams] = useSearchParams();
  const [resetAllowed, setResetAllowed] = useState<boolean>(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    checkToken();
  }, []);

  const handleSubmitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!Boolean(newPassword) || (newPassword !== confirmedNewPassword)){
      alert("Passwords don't match or were invalid.")
      return;
    }
    const res = await fetch(BASE_ROUTE + "/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email?.toLowerCase(),
        token: token,
        password: newPassword,
        confirmedPassword: confirmedNewPassword
      }),
    });

    if (res.status === 201) {
      setResetAllowed(false);
      setAlternateText("Password reset.")
    }
  };

  const checkToken = async () => {
    const res = await fetch(BASE_ROUTE + "/check-reset-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email?.toLowerCase(),
        token: token,
      }),
    });

    if (res.status === 200) {
      setResetAllowed(true);
    }
  };

  return (
    <div className="flex pt-16 h-screen w-screen relative overflow-x-hidden justify-center items-center">
      <div className="text-white bg-black sm:px-24 sm:py-16 px-8 py-6 rounded-md bg-black-opacity-90">
        {resetAllowed ? (
          <>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Password Reset
              </h2>
              <p className="mt-2 sm:text-lg text-md leading-8 sm:px-24 text-white">
                Enter a new password.
              </p>
            </div>
            <form
              onSubmit={handleSubmitNewPassword}
              className="mx-auto z-20 mt-12 max-w-2xl"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-1">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-white "
                  >
                    Password<span className="text-red-600"> *</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      name="password"
                      id="password"
                      autoComplete="none"
                      className="block w-full sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-white "
                  >
                    Confirm Password<span className="text-red-600"> *</span>
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="password"
                      value={confirmedNewPassword}
                      onChange={(e) => setConfirmedNewPassword(e.target.value)}
                      name="password"
                      id="password"
                      autoComplete="none"
                      className="block w-full sm:border-0 border-solid border-2 border-slate-500 rounded-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div></div>
              </div>
              <div className="mt-12 flex flex-row space-x-12 justify-center">
                <button
                  type="submit"
                  className="block w-3/4 rounded-md bg-pink-400 hover:bg-pink-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update Password
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>{alternateText}</div>
        )}
      </div>
    </div>
  );
};
