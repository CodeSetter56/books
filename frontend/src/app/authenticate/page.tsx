"use client";
import { useState } from "react"; // Import useState
import Signin from "./Signin";
import Signup from "./Signup";

function Page() {
  // Use state instead of a regular variable
  const [isNewUser, setIsNewUser] = useState(false);

  const changeform = () => {
    setIsNewUser((prev) => !prev); // Toggle the state
  };

  return (
    <div className="flex flex-col md:flex-row w-full grow">
      {/* Left Side: Welcome Text */}
      <div className="w-full grow flex items-center justify-center">
        <div className="p-10 flex flex-col gap-4">
          <div className="text-4xl text-center md:text-8xl md:text-left text-primary leading-tight">
            Welcome to Elib!
          </div>
          <div className="text-sm md:text-xl font-light italic text-text text-center md:text-left">
            Sign in to get started
          </div>
        </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full grow flex items-center justify-center p-10 flex-col">
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
      </div>
    </div>
  );
}

export default Page;
