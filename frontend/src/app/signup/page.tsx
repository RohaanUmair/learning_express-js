'use client'
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [signupUsername, setSignupUsername] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');

    const router = useRouter();


    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();

        axios.post(`${API_URL}/signupUser`, { username: signupUsername, email: signupEmail, password: signupPassword })
            .then((res) => {
                console.log(res);
                router.push('/login');
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                console.log(err.response.data.message);
            })
    };


    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1
                    className="flex font-bold items-center mb-6 text-4xl text-gray-900 dark:text-white"
                >
                    Todo App
                </h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign Up
                        </h1>

                        <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Username"
                                    required={true}
                                    value={signupUsername}
                                    onChange={(e) => setSignupUsername(e.target.value)}
                                    minLength={4}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="email@email.com"
                                    required={true}
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
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
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required={true}
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign Up
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an Account?
                                <Link className='font-medium text-primary-600 hover:underline dark:text-primary-500' href={'/login'}>
                                    Login now
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <Toaster />
        </section>

    )
}
