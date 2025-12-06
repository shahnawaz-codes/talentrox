import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
} from "@clerk/clerk-react";
import React from "react";

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn afterSignInUrl="/problems"  />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
