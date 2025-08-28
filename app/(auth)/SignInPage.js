import { SignIn } from '@clerk/nextjs';
import AuthLayout from '@/components/AuthLayout';

const SignInPage = () => {
  return (
    <AuthLayout>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/onboarding"
        afterSignUpUrl="/onboarding"
      />
    </AuthLayout>
  );
};

export default SignInPage;