import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePromise(promise: Promise<unknown>) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}
