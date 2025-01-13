interface TaskHistoriesProps{
    taskHistories:any
}
export default function TaskHistories({taskHistories}:TaskHistoriesProps){
    console.log(taskHistories)
    return(
        <div>
            {JSON.stringify(taskHistories)}
        </div>
    )
}