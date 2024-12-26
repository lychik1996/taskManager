import { getCurrent } from "@/features/auth/queries"
import EditProjectForm from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps{
    params:{
        projectId:string
    }
}

export default async function ProjectIdSettingsPage({params}:ProjectIdSettingsPageProps){
    const {projectId} = await params;
    const user = await getCurrent();
    if(!user) redirect("/sign-in");
    const initialVaues = await getProject({
        projectId
    });

    return(
        <div className="w-full lg:max-w-xl"><EditProjectForm initialValues={initialVaues}/></div>
    )
}