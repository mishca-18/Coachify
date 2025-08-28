import { SignIn } from '@clerk/nextjs';
import React from 'react';

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/onboarding" 
        afterSignUpUrl="/onboarding" 
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
};

export default SignInPage;