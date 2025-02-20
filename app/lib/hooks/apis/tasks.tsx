import { type ApiLoader } from '@/lib/types/api-loader';
import { type Task } from '@/lib/types/task';
import { type Pagination } from '@/lib/types/pagination';

import { notifications } from '@mantine/notifications';
import { useState, useEffect, useCallback } from 'react';

import API from '@/lib/api';

const GetAllTasks = ({
  loaderData,
  name,
  page,
  pageSize,
  sort,
}: {
  loaderData: ApiLoader;
  name: string;
  page: number;
  pageSize: number;
  sort: string;
}) => {
  const defaultPagination = { total_count: 0, total_pages: 1, current_page: 1, page_size: 10 };

  const [isLoadingTasksList, setIsLoadingTasksList] = useState(false);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [listPagination, setListPagination] = useState<Pagination>(defaultPagination);

  const fetchData = useCallback(async () => {
    const api = new API(loaderData?.env);
    setIsLoadingTasksList(true);
    try {
      const [error, tasksResponse] = await api.get({
        path: '/api/v1/tasks',
        config: {
          headers: {},
        },
        qs: {
          name,
          page,
          page_size: pageSize,
          sort: sort ? (sort.endsWith('_desc') ? sort : `${sort}_asc`) : '',
        },
      });

      if (error) {
        setTasksList([]);
        setListPagination(defaultPagination);
        notifications.show({
          color: 'red',
          title: 'Error',
          message: error?.response?.data?.message || error?.message,
        });
      }

      const tasks = tasksResponse?.data?.collections;
      const pagination = tasksResponse?.data?.pagination;

      if (tasks) {
        setTasksList(tasks);
      }

      if (pagination) {
        setListPagination(pagination);
      }

      setIsLoadingTasksList(false);
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Could not load tasks',
      });
      setIsLoadingTasksList(false);
      setTasksList([]);
      setListPagination(defaultPagination);
    }
  }, [loaderData?.env]);

  const refreshTasksList = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, loaderData.env]);

  return { tasksList, listPagination, isLoadingTasksList, refreshTasksList };
};

const GetTaskById = ({ loaderData, id }: { loaderData: ApiLoader; id: string }) => {
  const api = new API(loaderData?.env);

  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [task, setTask] = useState<Task | null>(null);

  const fetchData = async () => {
    setIsLoadingTask(true);
    try {
      const [error, taskResponse] = await api.get({
        path: `/api/v1/tasks/${id}`,
        config: {
          headers: {},
        },
      });

      if (error) {
        setTask(null);
        notifications.show({
          color: 'red',
          title: 'Error',
          message: error?.response?.data?.message || error?.message,
        });
      }

      const task = taskResponse?.data?.task;

      if (task) {
        setTask(task);
      }
      setIsLoadingTask(false);
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Could not load task',
      });
      setIsLoadingTask(false);
      setTask(null);
    }
  };

  const refreshTask = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [loaderData?.env, id]);

  return { task, isLoadingTask, refreshTask };
};

const CreateNewTask = ({ loaderData }: { loaderData: ApiLoader }) => {
  const api = new API(loaderData?.env);

  const addTask = async (name: string, description: string, due_date: string) => {
    const [error, response] = await api.post({
      path: `/api/v1/tasks/new`,
      payload: {
        name,
        description,
        due_date,
      },
      config: {
        headers: {},
      },
    });

    if (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      notifications.show({
        color: 'red',
        title: 'Error',
        message: errorMessage,
      });
      return {
        newTask: null,
        error: errorMessage,
      };
    }

    const newTask = response?.data?.task;

    return {
      newTask,
      error: null,
    };
  };

  return { addTask };
};

const UpdateTaskById = ({ loaderData }: { loaderData: ApiLoader }) => {
  const api = new API(loaderData?.env);

  const updateTask = async (id: string, name?: string, description?: string, due_date?: string) => {
    const [error, response] = await api.put({
      path: `/api/v1/tasks/${id}`,
      payload: {
        name,
        description,
        due_date,
      },
      config: {
        headers: {},
      },
    });

    if (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      notifications.show({
        color: 'red',
        title: 'Error',
        message: errorMessage,
      });
      return {
        task: null,
        error: errorMessage,
      };
    }

    const task = response?.data?.task;

    return {
      task,
      error: null,
    };
  };

  return { updateTask };
};

export { GetAllTasks, GetTaskById, CreateNewTask, UpdateTaskById };
