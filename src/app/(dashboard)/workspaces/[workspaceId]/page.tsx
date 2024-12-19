import { getCurrent } from "@/features/auth/action";
import { redirect } from "next/navigation";

export default async function WorkspaceId (){
      const user = await getCurrent();
      if(!user){
        redirect("/sign-in")
      }
    return(
        <div>Workspace Id</div>
    )
}