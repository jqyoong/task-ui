import { type Task } from '@/lib/types/task';

import { Form } from '@remix-run/react';
import { useState } from 'react';
import { TextInput, Textarea, Button, Stack, Group, Badge } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CalendarIcon } from '@radix-ui/react-icons';

import { getStatusBadgeColor } from '@/lib/utils';

interface TaskFormProps {
  task?: Partial<Pick<Task, 'name' | 'description' | 'due_date' | 'status'>>;
  isSubmitting?: boolean;
  onSubmit: (values: Required<Pick<Task, 'name' | 'description' | 'due_date'>>) => void;
}

const defaultValues = {
  name: '',
  description: '',
  due_date: null,
};

export function TaskForm({ task, isSubmitting, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState({
    ...defaultValues,
    ...task,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: values.name,
      description: values.description ?? '',
      due_date: values.due_date,
    });
  };

  const handleReset = () => {
    if (task) {
      setValues({
        ...defaultValues,
        ...task,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap="md">
        {task?.status && <Badge color={getStatusBadgeColor(task.status)}>{task.status.replace('_', ' ')}</Badge>}

        <TextInput
          label="Task Name"
          required
          value={values.name}
          onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter task name"
        />

        <Textarea
          label="Description"
          value={values.description ?? ''}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={4}
        />

        <DatePickerInput
          label="Due Date"
          value={values.due_date ? new Date(values.due_date) : null}
          onChange={(date) => setValues((prev) => ({ ...prev, due_date: date }))}
          leftSection={<CalendarIcon className="w-4 h-4" />}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick a date"
          clearable
        />

        <Group>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting} color="blue">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>

          {task && (
            <Button type="button" variant="outline" color="gray" onClick={handleReset}>
              Cancel
            </Button>
          )}
        </Group>
      </Stack>
    </Form>
  );
}
