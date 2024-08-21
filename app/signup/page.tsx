'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import constants from '../../constants.json'
const Signup = () => {
  const baseUrl = constants.baseUrl
  const router = useRouter();
  const [state, setState] = useState({
    loading: false,
    user: {
      phone: "",
      email: "",
      name: "",
      password: "",
    },
    errorMessage: "",
  });

  // Data Binding
  const updateInput = (event: { target: { name: any; value: any; }; }) => {
    setState({
      ...state,
      user: {
        ...state.user,
        [event.target.name]: event.target.value,
      },
    });
  };

  // User Signup
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { phone, email, name, password } = state.user;

    setState({ ...state, loading: true, errorMessage: "" });

    try {
      const response = await axios.post(`${baseUrl}/user/register`, {
        phone,
        email,
        name,
        password
      });

      const { error, msg, token } = response.data;

      if (error) {
        setState({ ...state, loading: false, errorMessage: msg });
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: msg,
        });
      } else {
        Cookies.set('token', token, { expires: 7 }); // Save token in cookies for 7 days
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: msg,
        }).then(() => {
          router.push('/login'); // Redirect to login page
        });
      }
    } catch (err) {
      setState({ ...state, loading: false, errorMessage: 'An error occurred during signup' });
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: 'An error occurred during signup',
      });
    }
  };

  const { user, errorMessage, loading } = state;

  return (
    <div className='bg-image relative' id="home-section">
      <div className='arrowOne'></div>
      <div className='radial-banner hidden lg:block'></div>
      <section className="bg-gray dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={submitForm}>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={user.phone}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="+918827094645"
                    onChange={updateInput}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    onChange={updateInput}
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={user.name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                    onChange={updateInput}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={updateInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-blue hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className='arrowSix'></div>
      <div className='arrowSeven'></div>
      <div className='arrowEight'></div>
    </div>
  );
};

export default Signup;
