// cSpell:word todos
import React, { useEffect, useState } from "react";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSnackbar } from "notistack";
import { TbEdit } from "react-icons/tb/index";
import { MdContentCopy } from "react-icons/md/index";
import { MdDeleteOutline } from "react-icons/md/index";

export type Payment = {
	_id?: string;
	amount: number;
	title: string;
	category: string;
};

import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const auth_token = req.cookies?.auth_token;
	if (!auth_token) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	// call api and check if token is valid
	return { props: {} };
};

const TodoPage = () => {
	type Todo = {
		text: string;
		done: boolean;
	};

	const [data, setData] = useState([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [singleData, setSingleData] = useState<{ _id?: string; title?: string; amount?: number; category?: string }>({});
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);

	const columns: ColumnDef<Payment>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
		},
		{
			accessorKey: "category",
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Category
						<CaretSortIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="lowercase">{row.getValue("category")}</div>,
		},
		{
			accessorKey: "amount",
			header: () => <div className="text-right">Amount</div>,
			cell: ({ row }) => {
				const amount = parseFloat(row.getValue("amount"));

				// Format the amount as a dollar amount
				const formatted = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "INR",
				}).format(amount);

				return <div className="text-right font-medium">{formatted}</div>;
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const payment = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment._id)}>
								<MdContentCopy className="me-2" /> Copy payment ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={async () => await getEditData(payment._id)}>
								<TbEdit className="me-2" /> Edit
							</DropdownMenuItem>
							<DropdownMenuItem onClick={async () => await handleDeleteData(payment._id)}>
								<MdDeleteOutline className="me-2" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	async function getData() {
		await fetch(`${process.env.API_PATH}/expense`)
			.then((response) => response.json())
			.then((response) => {
				response.success && setData(response.data);
			})
			.catch((error) => console.error(error));
	}

	async function getEditData(id: String) {
		await fetch(`${process.env.API_PATH}/expense/${id}`)
			.then((response) => response.json())
			.then((response) => {
				if (response.success) {
					setSingleData(response.data);
					setOpen(true);
				} else {
					return enqueueSnackbar(response.message, { variant: "error" });
				}
			})
			.catch((error) => console.error(error));
	}

	async function handleDeleteData(id: String) {
		await fetch(`${process.env.API_PATH}/expense/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(async (response) => {
				if (response.success) {
					await getData();
					return enqueueSnackbar("Expense deleted successfully", {
						variant: "success",
					});
				} else {
					return enqueueSnackbar(response.message, { variant: "error" });
				}
			})
			.catch((error) => console.error(error));
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		// validate data
		if (!singleData.title || !singleData.amount || !singleData.category) {
			return enqueueSnackbar("Please fill all the fields", {
				variant: "error",
			});
		}
		if (singleData?._id) {
			await fetch(`${process.env.API_PATH}/expense/${singleData._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(singleData),
			})
				.then((response) => response.json())
				.then(async (response) => {
					if (response.success) {
						setSingleData({
							title: "",
							amount: 0,
							category: "",
						});
						closeSnackbar();
						setOpen(false);
						await getData();
						return enqueueSnackbar("Expense updated successfully", {
							variant: "success",
						});
					} else {
						return enqueueSnackbar(response.message, { variant: "error" });
					}
				})
				.catch((error) => console.error(error));
		} else {
			await fetch(`${process.env.API_PATH}/expense/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(singleData),
			})
				.then((response) => response.json())
				.then(async (response) => {
					if (response.success) {
						setSingleData({
							title: "",
							amount: 0,
							category: "",
						});
						closeSnackbar();
						setOpen(false);
						await getData();
						return enqueueSnackbar("Expense created successfully", {
							variant: "success",
						});
					} else {
						return enqueueSnackbar(response.message, { variant: "error" });
					}
				})
				.catch((error) => console.error(error));
		}
	}

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {}, [setData]);

	return (
		<div className="w-screen h-screen p-0 m-0">
			<div className="w-100 mx-auto py-2">
				<header className="p-2 mb-2 rounded flex justify-between items-center container">
					<h1 className="text-3xl font-semibold tracking-tight">Todo App</h1>
					<div className="flex justify-between">
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant="default">Create New</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit profile</DialogTitle>
									<DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="title" className="text-right">
											Title
										</Label>
										<Input
											id="titleCreate"
											className="col-span-3"
											placeholder="I spend x amount on..."
											value={singleData.title || ""}
											onChange={(e) =>
												setSingleData({
													...singleData,
													title: e.target.value,
												})
											}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="amount" className="text-right">
											Amount
										</Label>
										<Input
											id="amountCreate"
											className="col-span-3"
											type="number"
											placeholder="1000"
											value={singleData.amount || ""}
											onChange={(e) =>
												setSingleData({
													...singleData,
													amount: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="category" className="text-right">
											Category
										</Label>
										<Input
											id="categoryCreate"
											className="col-span-3"
											placeholder="Miscellaneous Expense"
											value={singleData.category || ""}
											onChange={(e) =>
												setSingleData({
													...singleData,
													category: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button type="button" onClick={handleSubmit}>
										{singleData?._id ? "Update Expense" : "Create Expense"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</header>
				{/* <div className="w-2/3 mx-auto flex items-center mb-4">
					<input
						className="border-2 border-gray-300 p-2 flex-grow mr-4 rounded"
						type="text"
						value={todo}
						onChange={(e) => setTodo(e.target.value)}
					/>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded"
						onClick={addTodo}
					>
						Add Todo
					</button>
				</div> */}
				{/* <ul>
					{todos.map((todo, index) => (
						<li
							key={index + index}
							className={`border-2 border-gray-300 p-2 mb-2 rounded shadow-lg ${
								todo.done ? "line-through text-gray-500" : ""
							}`}
						>
							{todo.text}
							<button
								className="bg-green-500 text-white px-2 py-1 ml-2 rounded"
								onClick={() => toggleDone(index)}
							>
								Done
							</button>
							<button
								className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
								onClick={() => removeTodo(index)}
							>
								Remove
							</button>
						</li>
					))}
				</ul> */}
			</div>

			<div className="w-2/3 mx-auto">
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter title..."
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TodoPage;
