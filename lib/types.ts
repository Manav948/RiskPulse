export interface Project {
  id: string;
  name: string;
  deadlineDays: number;
  commitsLast7Days: number;
  taskCompletionRate: number;
  openBugs: number;
}
