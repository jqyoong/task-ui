import type { MetaFunction } from '@remix-run/node';

import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Button, Container, Group, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { TaskForm } from '@/components/task-form';

import loadPageConfig from '@/lib/load-page-config';
import { CreateNewTask } from '@/lib/hooks/apis/tasks';

export const meta: MetaFunction = () => {
  return [{ title: 'New Task' }];
};

export const loader = async () => {
  return {
    env: loadPageConfig(),
  };
};

export default function TaskDetail() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addTask } = CreateNewTask({ loaderData });

  const handleSubmit = async (values: { name: string; description: string; due_date: Date | null }) => {
    try {
      setIsSubmitting(true);
      await addTask(values.name, values.description, values.due_date?.toISOString());
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Task created successfully',
      });
      return navigate('/tasks');
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to update task',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Container mt="2rem">
      <Group mb="2rem" justify="space-between">
        <Title order={2}>Edit Task</Title>
        <Button variant="outline" color="gray" onClick={() => navigate('/tasks')}>
          Back
        </Button>
      </Group>

      <TaskForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Container>
  );
}
