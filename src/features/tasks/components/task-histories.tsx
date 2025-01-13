interface TaskHistoriesProps{
    taskHistories:any
}
export default function TaskHistories({taskHistories}:TaskHistoriesProps){
    return(
        <div>
            {JSON.stringify(taskHistories)}
        </div>
    )
}