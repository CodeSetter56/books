"use client"
import Signin from "./Signin";

function Page() {
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

      {/* Right Side: Signin Component */}
      {/* Removed items-center and justify-center to allow h-full to work */}
      <div className="w-full grow flex items-center justify-center p-10 flex-col">
    <div className="w-full max-w-md p-8 rounded-3xl bg-secondary border border-border shadow-xl">

        <Signin />
        <p className="text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <span className="text-primary font-bold cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
    </div>
      </div>
    </div>
  );
}

export default Page;
