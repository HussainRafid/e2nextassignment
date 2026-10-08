interface MessageType {
    title?:string,
    message?:string
}

export default function NoResult(
    {title = 'Oops An error Has Occurred', message = 'Could not find any result'}: 
    MessageType){
    return <div className="py-15">
        <div className="flex gap-2 flex-col">
            <div className="flex ">
                <i className="fa-solid fa-square-xmark text-4xl text-[var(--primary)]"></i>
            </div>
            <h1 className="text-3xl font-semibold">{title}</h1>
        </div>
        <p className="text-base opacity-75 mt-1">{message}</p>
    </div>
}