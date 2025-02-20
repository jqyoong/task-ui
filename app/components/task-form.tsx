import { type Task } from '@/lib/types/task';

import { useState } from 'react';
import { TextInput, Textarea, Button, Stack, Group, Badge } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CalendarIcon } from '@radix-ui/react-icons';

interface TaskFormProps {
  task: Pick<Task, 'name' | 'description' | 'due_date' | 'status'>;
  onSubmit: (values: TaskFormProps['task']) => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, onSubmit, isSubmitting }: TaskFormProps) {
  const [values, setValues] = useState(task);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Badge {...getStatusBadgeProps(task.status)}>{task.status.replace('_', ' ')}</Badge>
        <TextInput
          label="Task Name"
          required
          value={values.name}
          onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter task name"
        />

        <Textarea
          label="Description"
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={4}
        />

        <DatePickerInput
          label="Due Date"
          value={values.due_date}
          onChange={(date) => setValues((prev) => ({ ...prev, due_date: date }))}
          leftSection={<CalendarIcon className="w-4 h-4" />}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick a date"
        />

        <Group>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting} color="blue">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" color="gray" onClick={() => setValues(initialValues)}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

const getStatusBadgeProps = (status: Task['status']) => {
  switch (status) {
    case 'not_urgent':
      return { color: 'green' };
    case 'due_soon':
      return { color: 'yellow' };
    case 'overdue':
      return { color: 'red' };
    default:
      return { color: 'gray' };
  }
};
