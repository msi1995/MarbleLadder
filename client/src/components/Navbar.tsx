import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { handleLogout } from "../utils/utils";

export const Navbar = () => {
  const cookies = new Cookies();
  const token = cookies.get("MarbleToken");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleSignoutClick = () => {
    handleLogout(navigate, cookies);
  };

  useEffect(() => {
    // Burger menus
    const burger = document.querySelector(".navbar-burger");
    const menu = document.querySelector(".navbar-menu");

    if (burger && menu) {
      burger.addEventListener("click", () => {
        menu.classList.contains("hidden")
          ? menu.classList.remove("hidden")
          : menu.classList.add("hidden");
      });
    }

    // close
    const close = document.querySelector(".navbar-close");
    const backdrop = document.querySelector(".navbar-backdrop");

    if (close) {
      close.addEventListener("click", () => {
        menu?.classList.toggle("hidden");
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => {
        menu?.classList.add("hidden");
      });
    }
  }, []);

  //localstorage needs to remove username if token is expired, otherwise makes it seem like user is logged in still.
  useEffect(() => {
    if (!token) localStorage.clear();
  }, []);

  return (
    <>
      <nav className="fixed w-full z-50 select-none px-4 py-4 flex justify-between items-center bg-black opacity-90">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "text-2xl text-white font-bold"
              : "text-2xl text-pink-500 hover:text-pink-300"
          }
        >
          Welcome{username && `, ${username}!`}
        </NavLink>
        <div className="xl:hidden">
          <button className="navbar-burger flex items-center text-white p-3">
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 xl:flex xl:mx-auto xl:flex xl:items-center xl:w-auto xl:space-x-6">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "text-sm text-white font-bold"
                  : "text-sm text-gray-400 hover:text-gray-500"
              }
            >
              Home
            </NavLink>
          </li>
          <li className="text-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <NavLink
              to={"/ladder"}
              className={({ isActive }) =>
                isActive
                  ? "text-sm text-white font-bold"
                  : "text-sm text-gray-400 hover:text-gray-500"
              }
            >
              1v1 Gem Hunt Ladder
            </NavLink>
          </li>
          <li className="text-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <NavLink
              to={"/gem-hunt-records"}
              className={({ isActive }) =>
                isActive
                  ? "text-sm text-white font-bold"
                  : "text-sm text-gray-400 hover:text-gray-500"
              }
            >
              Solo Gem Hunt Records
            </NavLink>
          </li>
          <li className="text-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <NavLink
              to={"/about"}
              className={({ isActive }) =>
                isActive
                  ? "text-sm text-white font-bold"
                  : "text-sm text-gray-400 hover:text-gray-500"
              }
            >
              About
            </NavLink>
          </li>
          <li className="text-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <NavLink
              to={"/contact"}
              className={({ isActive }) =>
                isActive
                  ? "text-sm text-white font-bold"
                  : "text-sm text-gray-400 hover:text-gray-500"
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {token ? (
          <button
            onClick={() => handleSignoutClick()}
            className='hidden xl:inline-block xl:ml-auto xl:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"'
          >
            Sign out
          </button>
        ) : (
          <NavLink
            to={"/login"}
            className="hidden xl:inline-block xl:ml-auto xl:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
          >
            Sign In
          </NavLink>
        )}
        <NavLink
          to={"/register"}
          className="hidden xl:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
        >
          Sign Up
        </NavLink>
      </nav>
      <div className="navbar-menu relative z-50 hidden">
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-3/5 max-w-sm py-6 px-6 bg-black opacity-90 overflow-y-auto">
          <div className="flex items-center mb-8 justify-end">
            <button className="navbar-close">
              <svg
                className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
              <li className="mb-1">
                <NavLink
                  to={"/"}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-white rounded"
                >
                  Home
                </NavLink>
              </li>
              <li className="mb-1">
                <NavLink
                  to={"/ladder"}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-white rounded"
                >
                  1v1 Gem Hunt Ladder
                </NavLink>
              </li>
              <li className="mb-1">
                <NavLink
                  to={"/gem-hunt-records"}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-white rounded"
                >
                  Solo Gem Hunt Records
                </NavLink>
              </li>
              <li className="mb-1">
                <NavLink
                  to={"/about"}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-white rounded"
                >
                  About
                </NavLink>
              </li>
              <li className="mb-1">
                <NavLink
                  to={"/contact"}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-white rounded"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              {token ? (
                <button
                  className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl"
                  onClick={() => handleSignoutClick()}
                >
                  Sign Out
                </button>
              ) : (
                <NavLink
                  to={"/login"}
                  className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl"
                >
                  Sign in
                </NavLink>
              )}
              <NavLink
                to={"/register"}
                className="block px-4 py-2 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl"
              >
                Sign Up
              </NavLink>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
