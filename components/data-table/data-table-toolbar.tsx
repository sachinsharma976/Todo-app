'use client';

import { Table } from '@tanstack/react-table'; // Core table library
import { X } from 'lucide-react'; // Icon for reset button
import { Button } from '@/components/ui/button'; // Custom button component
import { Input } from '@/components/ui/input'; // Custom input component
import { DataTableViewOptions } from './data-table-view-options'; // View options component
import { DataTableFacetedFilter } from './data-table-faceted-filter'; // Faceted filter component

// Props interface for the DataTableToolbar component
interface DataTableToolbarProps<TData> {
  table: Table<TData>; // Table instance from @tanstack/react-table
}

// Toolbar component for the data table
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // Check if any filters are applied
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      {/* Left section: Filters and search input */}
      <div className="flex flex-1 items-center space-x-2">
        {/* Search input for filtering by title */}
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Faceted filter for completed status */}
        {table.getColumn('completed') && (
          <DataTableFacetedFilter
            column={table.getColumn('completed')}
            title="Status"
            options={[
              { label: 'Completed', value: 'true' },
              { label: 'Pending', value: 'false' },
            ]}
          />
        )}

        {/* Reset filters button (visible only when filters are applied) */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right section: View options (e.g., column visibility) */}
      <DataTableViewOptions table={table} />
    </div>
  );
}