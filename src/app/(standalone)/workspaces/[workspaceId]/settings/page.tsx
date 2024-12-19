import { getCurrent } from "@/features/auth/action";
import { getWorkspace } from "@/features/workspaces/action";
import EditWorkSpaceForm from "@/features/workspaces/components/edit-workspace-form ";

import { redirect } from "next/navigation";

interface WorkSpaceIdSettingsPageProps {
    params: {
        workspaceId: string;
    }
}

export default async function WorkSpaceIdSettingsPage({ params }: WorkSpaceIdSettingsPageProps) {
    const {workspaceId} = await params;
    const user = await getCurrent();

    if (!user) redirect("/sign-in");

    const initialValues = await getWorkspace({ workspaceId: workspaceId});
    
    if (!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
           <EditWorkSpaceForm initialValues={initialValues} />
        </div>
    );
}