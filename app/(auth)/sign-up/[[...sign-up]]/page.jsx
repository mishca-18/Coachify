// app/(auth)/sign-up/[[...sign-up]]/page.jsx
import { SignUp } from '@clerk/nextjs';
import React from 'react';

// Define AuthLayout in the same file
const AuthLayout = ({ children }) => {
  return <div className="flex justify-center pt-8 mt-10 mb-12">{children}</div>;
};

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignInUrl="/onboarding"
        afterSignUpUrl="/onboarding"
        forceRedirectUrl="/onboarding"
      />
    </AuthLayout>
  );
};

export default SignUpPage;