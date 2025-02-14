'use client';

import * as React from 'react';
import { Column } from '@tanstack/react-table'; // Type for table columns
import { Check, PlusCircle } from 'lucide-react'; // Icons for filter UI
import { cn } from '@/lib/utils'; // Utility function for class names
import { Badge } from '@/components/ui/badge'; // Badge component for selected filters
import { Button } from '@/components/ui/button'; // UI button component
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'; // Command components for filter dropdown
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // Popover components for dropdown
import { Separator } from '@/components/ui/separator'; // Separator component

// Props for the DataTableFacetedFilter component
interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>; // Column object from react-table
  title?: string; // Title of the filter
  options: {
    label: string; // Display label for the filter option
    value: string; // Value of the filter option
    icon?: React.ComponentType<{ className?: string }>; // Optional icon for the filter option
  }[];
}

// Component to render a faceted filter dropdown
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues(); // Get unique values for the column
  const selectedValues = new Set(column?.getFilterValue() as string[]); // Track selected filter values

  return (
    <Popover>
      {/* Popover trigger (button to open the filter dropdown) */}
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {/* Show selected filters as badges */}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {/* Popover content (filter dropdown) */}
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} /> {/* Search input for filters */}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty> {/* Show if no results */}
            <CommandGroup>
              {/* Render filter options */}
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value); // Check if option is selected
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // Toggle selection of the filter option
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      // Update the column filter value
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    {/* Checkbox for selected options */}
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    {/* Icon for the filter option */}
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span> {/* Filter option label */}
                    {/* Show count of unique values for the option */}
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Clear filters option */}
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)} // Clear all filters
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}