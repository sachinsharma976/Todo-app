'use client';

import { Column } from '@tanstack/react-table'; // Type for table columns
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from 'lucide-react'; // Icons for sorting and hiding
import { cn } from '@/lib/utils'; // Utility function for class names
import { Button } from '@/components/ui/button'; // UI button component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Dropdown menu components

// Props for the DataTableColumnHeader component
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>; // Column object from react-table
  title: string; // Title of the column
}

// Component to render a column header with sorting and hiding options
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  // If the column cannot be sorted, render the title without dropdown
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        {/* Dropdown trigger (button with sorting icon) */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {/* Show sorting icon based on current sort state */}
            {column.getIsSorted() === 'desc' ? (
              <SortDesc className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <SortAsc className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown menu content */}
        <DropdownMenuContent align="start">
          {/* Sort ascending option */}
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>

          {/* Sort descending option */}
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Hide column option */}
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}