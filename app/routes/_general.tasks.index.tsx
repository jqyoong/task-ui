import type { MetaFunction } from '@remix-run/node';
import type { Task } from '@/lib/types/task';

import { useLoaderData, useSearchParams, useNavigate } from '@remix-run/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import loadPageConfig from '@/lib/load-page-config';
import { GetAllTasks } from '@/lib/hooks/apis/tasks';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async () => {
  return {
    error: null,
    env: loadPageConfig(),
  };
};

const PAGE_SIZES = [10, 20, 50, 100];

export default function Tasks() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const params = {
    name: searchParams.get('name') ?? '',
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('page_size')) || 10,
    sort: searchParams.get('sort') ?? '',
  };

  const [searchQuery, setSearchQuery] = useState(params.name);

  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchQuery) {
        prev.set('name', searchQuery);
      } else {
        prev.delete('name');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const { tasksList, isLoadingTasksList, listPagination } = GetAllTasks({
    loaderData,
    name: params.name,
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sort,
  });

  const handleSort = (column: string) => {
    setSearchParams((prev) => {
      const currentSort = prev.get('sort');

      if (!currentSort) {
        prev.set('sort', column);
      } else if (currentSort === column) {
        prev.set('sort', `${column}_desc`);
      } else {
        prev.delete('sort');
      }
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      prev.set('page_size', e.target.value);
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Task Management</h1>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          {isLoadingTasksList ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Task Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('due_date')}
                  >
                    Due Date
                    <span className="ml-1 inline-block">↕</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('created_at')}
                  >
                    Created At
                    <span className="ml-1 inline-block">↕</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {tasksList?.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
            <select
              value={params.pageSize}
              onChange={handlePageSizeChange}
              className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
            {listPagination && (
              <span className="text-sm text-gray-700 dark:text-gray-300 ml-4">
                Showing {(params.page - 1) * params.pageSize + 1} to {Math.min(params.page * params.pageSize, listPagination.total_count)}{' '}
                of {listPagination.total_count} entries
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(params.page - 1)}
              disabled={params.page <= 1}
              className={`px-3 py-1 rounded-md text-sm ${
                params.page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } border dark:border-gray-700`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {params.page > 2 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    1
                  </button>
                  {params.page > 3 && <span className="text-gray-500">...</span>}
                </>
              )}

              {params.page > 1 && (
                <button
                  onClick={() => handlePageChange(params.page - 1)}
                  className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {params.page - 1}
                </button>
              )}

              <button className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-blue-500 text-white">{params.page}</button>

              {params.page < (listPagination?.total_pages ?? 0) && (
                <button
                  onClick={() => handlePageChange(params.page + 1)}
                  className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {params.page + 1}
                </button>
              )}

              {params.page < (listPagination?.total_pages ?? 0) - 1 && (
                <>
                  {params.page < (listPagination?.total_pages ?? 0) - 2 && <span className="text-gray-500">...</span>}
                  <button
                    onClick={() => handlePageChange(listPagination?.total_pages ?? 1)}
                    className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {listPagination?.total_pages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(params.page + 1)}
              disabled={params.page >= (listPagination?.total_pages ?? 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                params.page >= (listPagination?.total_pages ?? 1)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } border dark:border-gray-700`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getStatusStyle = (status: Task['status']) => {
  switch (status) {
    case 'not_urgent':
      return 'bg-green-100 text-green-800';
    case 'due_soon':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
