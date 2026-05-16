import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Admin Sign In | Cosmetics Admin"
        description="Sign in to manage products and catalog"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
