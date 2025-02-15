'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'; // Dropdown trigger component
import { Table } from '@tanstack/react-table'; // Core table library
import { Settings2 } from 'lucide-react'; // Settings icon
import { Button } from '@/components/ui/button'; // Custom button component
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'; // Custom dropdown menu components

// Props interface for the DataTableViewOptions component
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>; // Table instance from @tanstack/react-table
}

// View options component for toggling column visibility
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      {/* Dropdown trigger button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Render checkboxes for each column that can be toggled */}
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide() // Filter columns that can be hidden
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()} // Check if the column is visible
              onCheckedChange={(value) => column.toggleVisibility(!!value)} // Toggle visibility
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}