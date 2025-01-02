"use client"
import ResponsiveModal from "@/components/responsive-modal";
import { useEditTaskModal } from "../hooks/use-edit-task-modal"

import EditTaskFormWrapper from "./edit-task-form-wrapper";


export default function EditTaskModal(){
    const {taskId, close} = useEditTaskModal();
    if(!taskId){
      return null
    }
    
    return(
      <ResponsiveModal open={!!taskId} onOpenChange={close}>
        {taskId && (
          <EditTaskFormWrapper onCancel={close} id={taskId}/>
        )}
      </ResponsiveModal>
    )
}