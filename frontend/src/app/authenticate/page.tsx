import Rightside from "./Rightside";

function Page() {
  // Use state instead of a regular variable


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
        <Rightside />
      </div>
    </div>
  );
}

export default Page;
