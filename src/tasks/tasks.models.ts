export interface Task {
    id: String;
    title: String;
    description: String;
    status: Status
}
enum Status {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}