export enum Status {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export class CreateMemorizationDto {
    target: string;
    scope: string;
    status?: Status;
    progress?: number;
    startTime: Date;
    duration: string;
    priority?: Priority;
}