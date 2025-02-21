import { type BadgeProps } from '@mantine/core';
import { type Task } from './types/task';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePromise(promise: Promise<unknown>) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}

export const getStatusBadgeColor = (status: Task['status']): BadgeProps['color'] => {
  switch (status) {
    case 'not_urgent':
      return 'green';
    case 'due_soon':
      return 'yellow';
    case 'overdue':
      return 'red';
    default:
      return 'gray';
  }
};
