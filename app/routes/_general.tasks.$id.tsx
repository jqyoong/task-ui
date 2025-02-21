import type { MetaFunction } from '@remix-run/node';

import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Button, Container, Group, LoadingOverlay, Title } from '@mantine/core';

import loadPageConfig from '@/lib/load-page-config';
import { GetTaskById, UpdateTaskById } from '@/lib/hooks/apis/tasks';
import { TaskForm } from '@/components/task-form';

export const meta: MetaFunction = () => {
  return [{ title: 'Task Details' }];
};

export const loader = async () => {
  return {
    env: loadPageConfig(),
  };
};

export default function TaskDetail() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id = '' } = params;

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      return navigate('/tasks');
    }
  }, [id, navigate]);

  const { task, isLoadingTask, refreshTask } = GetTaskById({
    loaderData,
    id,
  });

  const { updateTask } = UpdateTaskById({ loaderData });

  const handleSubmit = async (values: { name: string; description: string; due_date: Date | null }) => {
    try {
      setIsSubmitting(true);
      await updateTask(id, values.name, values.description, values.due_date?.toISOString());
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Task updated successfully',
      });
      await refreshTask();
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
      <LoadingOverlay visible={isLoadingTask} overlayProps={{ blur: 2 }} />
      <Group mb="2rem" justify="space-between">
        <Title order={2}>Edit Task</Title>
        <Button variant="outline" color="gray" onClick={() => navigate('/tasks')}>
          Back
        </Button>
      </Group>

      {task && (
        <TaskForm
          task={{
            ...task,
            due_date: task.due_date ? new Date(task.due_date) : null,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Container>
  );
}
