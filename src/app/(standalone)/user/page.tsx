import VerifyEmailDialog from "@/features/auth/components/verify-email-dialog";
import { getCurrent } from "@/features/auth/queries";
import EditUserForm from "@/features/auth/components/edit-user-form";
import { redirect } from "next/navigation";

export default async function UserPage(){
    const user = await getCurrent();
      if(!user){
        redirect('/sign-in')
      }
      if(!user.emailVerification){
        return <VerifyEmailDialog/>
      }
    return(
        <div className="w-full lg:max-w-xl">
            <EditUserForm  user={user}/>
        </div>
    )
}