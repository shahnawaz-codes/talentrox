import { UserButton } from "@clerk/clerk-react";
import React from "react";

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl text-blue-700">Clerk React Example</h1>
      <button className="btn btn-secondary">Test</button> <UserButton />
    </div>
  );
};

export default Home;
