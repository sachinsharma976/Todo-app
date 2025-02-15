'use client';

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import { Table } from '@tanstack/react-table'; // Core table library
import { Button } from '@/components/ui/button'; // Custom button component
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'; // Custom select component

// Props interface for the DataTablePagination component
interface DataTablePaginationProps<TData> {
	table: Table<TData>; // Table instance from @tanstack/react-table
}

// Pagination component for the data table
export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div className='flex items-center justify-between px-2 flex-wrap-reverse gap-y-2'>
			{/* Display selected rows count */}
			<div className='flex-1 text-sm text-muted-foreground whitespace-nowrap me-2'>
				{table.getFilteredSelectedRowModel().rows.length} of{' '}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>

			{/* Pagination controls */}
			<div className='flex items-center lg:space-x-8 flex-wrap-reverse gap-y-2'>
				{/* Rows per page selector */}
				<div className='flex items-center space-x-2 me-4'>
					<p className='text-sm font-medium'>Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`} // Current page size
						onValueChange={(value) => {
							table.setPageSize(Number(value)); // Update page size
						}}
					>
						<SelectTrigger className='h-8 w-[70px]'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Current page info */}
				<div className='flex items-center'>
					<div className='flex w-[100px] items-center md:justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>

					{/* Page navigation buttons */}
					<div className='flex items-center space-x-2'>
						{/* Go to first page */}
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)} // Jump to first page
							disabled={!table.getCanPreviousPage()} // Disable if on the first page
						>
							<span className='sr-only'>Go to first page</span>
							<ChevronsLeft className='h-4 w-4' />
						</Button>

						{/* Go to previous page */}
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.previousPage()} // Go to previous page
							disabled={!table.getCanPreviousPage()} // Disable if on the first page
						>
							<span className='sr-only'>Go to previous page</span>
							<ChevronLeft className='h-4 w-4' />
						</Button>

						{/* Go to next page */}
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.nextPage()} // Go to next page
							disabled={!table.getCanNextPage()} // Disable if on the last page
						>
							<span className='sr-only'>Go to next page</span>
							<ChevronRight className='h-4 w-4' />
						</Button>

						{/* Go to last page */}
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)} // Jump to last page
							disabled={!table.getCanNextPage()} // Disable if on the last page
						>
							<span className='sr-only'>Go to last page</span>
							<ChevronsRight className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
