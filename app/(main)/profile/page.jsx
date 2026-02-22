import { getUserProfile } from "@/actions/user";
import { industries } from "@/data/industries";
import { redirect } from "next/navigation";
import OnboardingForm from "@/app/(main)/onboarding/_components/onboarding-form";

export const metadata = {
  title: "Profile | Sensai",
  description: "Update your career profile and settings",
};

export default async function ProfilePage() {
  const user = await getUserProfile();

  // If the user doesn't exist in the database, force them to onboarding
  if (!user) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto py-10 px-4 max-w-4xl">
      <OnboardingForm industries={industries} initialData={user} />
    </div>
  );
}