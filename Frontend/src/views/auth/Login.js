// src/pages/Login.js

import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Alert } from "../../helper/notification";

export default function Login() {
  const { login, error, clearError } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (error) {
      switch (error) {
        case 400:
          setMessage("Username or password is required");
          break;
        case 404:
          setMessage("User does not exist");
          break;
        case 401:
          setMessage("Invalid User Credentials");
          break;
        default:
          setMessage("Something went wrong");
      }
    } else {
      setMessage("");
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const credentials = { email, password };

    setLoading(true);
    clearError(); // Clear any previous error before attempting login
    try {
      const userData = await login(credentials);
      const userRole = userData.user.userRole;

      switch (userRole) {
        case "student":
          history.push("/student/dashboard");
          break;
        case "admin":
          history.push("/admin/dashboard");
          break;
        case "teacher":
          history.push("/teacher/dashboard");
          break;
        case "hod":
          history.push("/hod/dashboard");
          break;
        default:
          history.push("/");
      }
    } catch (err) {
      // Error handled by login function
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="container mx-auto px-4 mt-8">
      <div className="flex content-center items-center justify-center">
        <div className="w-full lg:w-4/12 px-4 mt-1">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            {message && <Alert message={message} />}
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-black">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h6 className="text-blueGray-500 text-lg font-bold">
                  Sign in with credentials
                </h6>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    name="email"
                    required
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    name="password"
                    required
                  />
                </div>
                <div className="text-center mt-6">
                  {loading ? (
                    <button disabled type="button" className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150">
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-wrap mt-6 relative items-center justify-center">
            <div className="w-4/6">
              <a
                href="#project"
                onClick={(e) => e.preventDefault()}
                className="text-blueGray-200 text-center"
              >
                <h5>Forgot password?</h5>
              </a>
            </div>
            {/* Uncomment the below lines if you want to add a link for creating a new account */}
            {/* <div className="w-1/2 text-right">
              <Link to="/auth/register" className="text-blueGray-200">
                <small>Create new account</small>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
