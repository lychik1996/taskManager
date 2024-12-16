import UserButton from "@/components/user-button";
import { getCurrent } from "@/features/auth/action";
import CreateWorkSpaceForm from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
 
  if(!user){
    redirect("/sign-in")
  }
  return (
    <div>
      <CreateWorkSpaceForm />
    </div>
  );
}
