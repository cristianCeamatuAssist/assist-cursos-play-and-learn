'use client';

import { Pagination } from '@/components/admin/Pagination';
import { SearchInput } from '@/components/admin/SearchInput';
import { UsersTable } from '@/components/admin/UsersTable';
import { Priority, Status } from '@/generated/prisma';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  startDate: Date;
  endDate: Date | null;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  projects: Project[];
};

type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  projects: {
    id: string;
    title: string;
    description: string | null;
    status: Status;
    priority: Priority;
    startDate: string;
    endDate: string | null;
  }[];
};

type PaginationData = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse search params with defaults
  const page = useMemo(() => Number(searchParams.get('page') || '1'), [searchParams]);
  const search = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const sortBy = useMemo(() => searchParams.get('sortBy') || 'createdAt', [searchParams]);
  const sortOrder = useMemo(() => (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc', [searchParams]);
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized query parameters that will only change when the actual values change
  const queryParams = useMemo(() => ({
    page,
    search,
    sortBy,
    sortOrder
  }), [page, search, sortBy, sortOrder]);

  // Fetch users with current filters
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Construct URL with search params
      const url = new URL('/api/users', window.location.origin);
      url.searchParams.append('page', queryParams.page.toString());
      url.searchParams.append('sortBy', queryParams.sortBy);
      url.searchParams.append('sortOrder', queryParams.sortOrder);
      
      if (queryParams.search) {
        url.searchParams.append('search', queryParams.search);
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      // Transform dates from strings to Date objects
      const transformedUsers = data.users.map((user: ApiUser) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        projects: user.projects.map((project) => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
        })),
      }));
      
      setUsers(transformedUsers);
      setPagination(data.pagination);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Initial data fetching - only runs once
  useEffect(() => {
    if (!isInitialized) {
      fetchUsers();
    }
  }, [fetchUsers, isInitialized]);

  // Subsequent data fetching - runs when query params change (but not on first render)
  useEffect(() => {
    if (isInitialized) {
      fetchUsers();
    }
  }, [fetchUsers, isInitialized, queryParams]);

  // Update URL without triggering a navigation (to avoid re-renders)
  const updateSearchParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Use replace to avoid adding a new history entry for each change
    router.replace(`?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSearch = useCallback((value: string) => {
    updateSearchParams({ search: value, page: '1' }); // Reset to page 1 on new search
  }, [updateSearchParams]);

  const handleSort = useCallback((column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    updateSearchParams({ sortBy: column, sortOrder: newSortOrder });
  }, [sortBy, sortOrder, updateSearchParams]);

  const handlePageChange = useCallback((newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  }, [updateSearchParams]);

  // Show loading spinner only on initial load or when actively loading and has data
  const showLoading = (!isInitialized) || (isLoading && users.length === 0);
  const showEmptyState = isInitialized && !isLoading && users.length === 0;
  const showContent = isInitialized && users.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        
        {/* Search and filters */}
        <div className="mb-6">
          <SearchInput
            defaultValue={search}
            placeholder="Search by name or email..."
            onSearch={handleSearch}
            className="max-w-md"
          />
        </div>
        
        {/* Loading state */}
        {showLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {/* Users table */}
        {showContent && (
          <div className="space-y-4">
            <UsersTable
              users={users}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {/* Empty state */}
        {showEmptyState && (
          <div className="bg-white p-8 rounded-md border text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
} 