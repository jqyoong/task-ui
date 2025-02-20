export interface Task extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  status: 'not_urgent' | 'due_soon' | 'overdue';
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;
