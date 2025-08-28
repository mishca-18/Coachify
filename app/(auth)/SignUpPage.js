import { SignUp } from '@clerk/nextjs';
import AuthLayout from '@/components/AuthLayout';

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUp
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/onboarding"
        afterSignUpUrl="/onboarding"
        forceRedirectUrl="/onboarding"
      />
    </AuthLayout>
  );
};

export default SignUpPage;