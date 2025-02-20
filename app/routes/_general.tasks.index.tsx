import type { MetaFunction } from '@remix-run/node';
import type { Task } from '@/lib/types/task';

import { useLoaderData, useSearchParams, useNavigate } from '@remix-run/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Table, Container, Title, TextInput, Button, Group, Badge, LoadingOverlay, Pagination, Select, Text } from '@mantine/core';

import loadPageConfig from '@/lib/load-page-config';
import { GetAllTasks } from '@/lib/hooks/apis/tasks';

export const meta: MetaFunction = () => {
  return [{ title: 'Tasks Management' }];
};

export const loader = async () => {
  return {
    error: null,
    env: loadPageConfig(),
  };
};

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

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set('page_size', newPageSize?.toString() ?? '10');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <Container size="xl" mt="2rem">
      <Title order={2} mb="lg">
        Task Management
      </Title>

      <Group mb="lg">
        <TextInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          leftSection={<MagnifyingGlassIcon className="w-4 h-4" />}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Group>

      <LoadingOverlay visible={isLoadingTasksList} overlayProps={{ blur: 2 }} />
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Task Name</Table.Th>
            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('due_date')}>
              Due Date {params.sort.includes('due_date') && (params.sort.includes('_desc') ? '↓' : '↑')}
            </Table.Th>
            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
              Created At {params.sort.includes('created_at') && (params.sort.includes('_desc') ? '↓' : '↑')}
            </Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tasksList?.map((task) => (
            <Table.Tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
              <Table.Td>{task.name}</Table.Td>
              <Table.Td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</Table.Td>
              <Table.Td>{new Date(task.created_at).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Badge {...getStatusBadgeProps(task.status)}>{task.status.replace('_', ' ')}</Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="lg">
        <Group>
          <span>Show</span>
          <Select
            value={params.pageSize.toString()}
            onChange={(value) => handlePageSizeChange(Number(value))}
            data={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
            ]}
            style={{ width: 100 }}
          />
          <span>entries</span>
          {listPagination && (
            <Text size="sm" c="dimmed">
              Showing {(params.page - 1) * params.pageSize + 1} to {Math.min(params.page * params.pageSize, listPagination.total_count)} of{' '}
              {listPagination.total_count} entries
            </Text>
          )}
        </Group>

        <Pagination value={params.page} onChange={handlePageChange} total={listPagination?.total_pages ?? 1} withEdges />
      </Group>
    </Container>
  );
}
