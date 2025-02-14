'use client';

import { ColumnDef } from '@tanstack/react-table'; // Type for table columns
import { Todo } from '@/lib/store/services/todos'; // Todo type
import { Checkbox } from '@/components/ui/checkbox'; // Checkbox component
import { DataTableColumnHeader } from './data-table-column-header'; // Custom header component
import { DataTableRowActions } from './data-table-row-actions'; // Row actions component

// Columns for the public todos table
export const publicTodoColumns: ColumnDef<Todo>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false, // Disable sorting for this column
		enableHiding: false, // Disable hiding for this column
	},
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' />
		),
		cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
		enableSorting: false, // Disable sorting for this column
		enableHiding: false, // Disable hiding for this column
	},
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Title' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2'>
					<span className='max-w-[500px] truncate font-medium'>
						{row.getValue('title')}
					</span>
				</div>
			);
		},
	},
	{
		id: 'completed',
		accessorFn: (row) => row.completed, // Accessor function for the completed status
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex w-[100px] items-center'>
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
							row.getValue('completed')
								? 'bg-green-100 text-green-800' // Style for completed todos
								: 'bg-yellow-100 text-yellow-800' // Style for pending todos
						}`}
					>
						{row.getValue('completed') ? 'Completed' : 'Pending'}
					</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const status = row.getValue(id) as boolean; // Cast the value to boolean
			return value.includes(status.toString()); // Convert boolean to string and check inclusion
		},
	},
];

// Columns for the private todos table (extends public columns)
export const privateTodoColumns: ColumnDef<Todo>[] = [
	...publicTodoColumns, // Include all public columns
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />, // Add row actions for private todos
	},
];
