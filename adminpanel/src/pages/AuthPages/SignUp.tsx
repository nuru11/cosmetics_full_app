import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign up | Snack Admin"
        description="Create an account (optional template page)"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
