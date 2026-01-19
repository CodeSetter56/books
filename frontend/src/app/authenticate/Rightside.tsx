"use client";

import Signup from './Signup';
import Signin from './Signin';
import { useState } from 'react';

export default function Rightside() {

      const [isNewUser, setIsNewUser] = useState(false);

  const changeform = () => {
    setIsNewUser((prev) => !prev); // Toggle the state
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-secondary border border-border shadow-xl">
      {isNewUser ? (
        <>
          <Signup />
          <p className="text-center text-sm text-text-muted mt-4">
            Already have an account?{" "}
            <span
              onClick={changeform}
              className="text-primary font-bold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </>
      ) : (
        <>
          <Signin />
          <p className="text-center text-sm text-text-muted mt-4">
            Don't have an account?{" "}
            <span
              onClick={changeform}
              className="text-primary font-bold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </>
      )}
    </div>
  );
}
