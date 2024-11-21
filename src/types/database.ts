export interface IUser {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface IProject {
    id: string;
    title: string;
    description: string;
    priority: number;
    startDate: Date;
    dueDate: Date;
    lead: IUser;
    members: { info: IUser }[];
}



export enum TaskStatus { 
    TO_DO = "TO_DO",
    ON_PROGRESS = "ON_PROGRESS",
    COMPLETED = "COMPLETED",
}

export interface ITask {
    _id: string;
    name: string;
    description: string;
    projectId: string;
    priority: Number;
    status: TaskStatus;
    startDate: Date;
    dueDate: Date;
    module?: string;
    assignee?: IUser;
    reporter: IUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
