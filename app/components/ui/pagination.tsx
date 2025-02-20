interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

export function Pagination({
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
        <span className="text-sm text-gray-700 dark:text-gray-300 ml-4">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage <= 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          } border dark:border-gray-700`}
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {currentPage > 2 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                1
              </button>
              {currentPage > 3 && <span className="text-gray-500">...</span>}
            </>
          )}

          {currentPage > 1 && (
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {currentPage - 1}
            </button>
          )}

          <button className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-blue-500 text-white">{currentPage}</button>

          {currentPage < totalPages && (
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 rounded-md text-sm border dark:border-gray-700 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          } border dark:border-gray-700`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// import * as React from 'react';
// import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// import { cn } from '@/lib/utils';

// const TooltipProvider = TooltipPrimitive.Provider;

// const Tooltip = TooltipPrimitive.Root;

// const TooltipTrigger = TooltipPrimitive.Trigger;

// const TooltipContent = React.forwardRef<
//   React.ElementRef<typeof TooltipPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
// >(({ className, sideOffset = 4, ...props }, ref) => (
//   <TooltipPrimitive.Content
//     ref={ref}
//     sideOffset={sideOffset}
//     className={cn(
//       'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
//       className
//     )}
//     {...props}
//   />
// ));
// TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
