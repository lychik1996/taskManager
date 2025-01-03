import { useQueryState, parseAsBoolean, parseAsString, parseAsStringEnum } from 'nuqs';
import { useEffect } from 'react';
import { TaskStatus } from '../types';



export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'create-task',
    parseAsBoolean.withDefault(false)
  );

  const [isStatus, setIsStatus] = useQueryState(
    "status-task",
    parseAsStringEnum(Object.values(TaskStatus) as TaskStatus[])
  )
  useEffect(()=>{
    if(!isOpen){
      setIsStatus(null)
    }
  },[isOpen,setIsStatus]);
  
  const open = (status:TaskStatus | null =null) => {
    setIsStatus(status);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };
  return {
    isStatus,
    isOpen,
    open,
    close,
    setIsOpen,
  };
};