"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/services/taskApi";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { TaskCard } from "./taskCard";
import toast from "react-hot-toast";

export type Tasks = {
  id: string;
  description: string;
  status: "pending" | "completed";
  task: string;
};

export function TaskTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskMutation();
  const { data: tasks, isLoading, error } = useGetTasksQuery({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isForModification, setIsForModification] = React.useState(false);
  const [openDrawers, setOpenDrawers] = React.useState<Record<string, boolean>>(
    {}
  );
  const [newTaskForm, setNewTaskForm] = React.useState({
    task: "",
    description: "",
  });
  const [isAddTaskDrawerOpen, setIsAddTaskDrawerOpen] = React.useState(false);

  const handleDeleteTask = async (id: string) => {
    try {
      console.log("Deleting task with ID:", id);
      const response = await deleteTask(id);

      if ("data" in response) {
        console.log("Delete successful:", response.data);
        toast.success("Task deleted successfully");
      } else if ("error" in response) {
        console.error("Delete API error:", response.error);
        const errorMessage =
          "error" in response &&
          response.error &&
          typeof response.error === "object" &&
          "data" in response.error &&
          response.error.data &&
          typeof response.error.data === "object" &&
          "message" in response.error.data
            ? response.error.data.message
            : "Unknown error";

        toast.error(`Failed to delete task: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleToggleStatus = async (task: Tasks) => {
    try {
      // Toggle the status between 'pending' and 'completed'
      const newStatus = task.status === "pending" ? "completed" : "pending";

      console.log(`Toggling task status from ${task.status} to ${newStatus}`, {
        taskId: task.id,
      });

      await updateTaskStatus({
        id: task.id,
        title: task.task,
        description: task.description,
        status: newStatus,
      });

      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error("Error toggling task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleRowClick = (rowId: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [rowId]: true,
    }));
  };

  const handleDrawerClose = (rowId: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [rowId]: false,
    }));

    setIsForModification(false);
  };

  const columns: ColumnDef<Tasks>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: string = row.getValue("status");

        return (
          <div className="flex items-center gap-2">
            <div
              className={`capitalize ${
                status === "completed" ? "text-green-600 font-medium" : ""
              }`}
            >
              {status}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "task",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const task: string = row.getValue("task");
        const status: string = row.getValue("status");
        const isCompleted = status === "completed";

        return (
          <div className="w-full">
            <div
              className={`truncate ${
                isCompleted ? "line-through text-gray-500" : ""
              }`}
              title={task}
              style={{
                maxWidth: "100%",
                display: "block",
              }}
            >
              {task}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <div className="text-right">Description</div>,
      cell: ({ row }) => {
        const description: string = row.getValue("description");

        return (
          <div className="text-right font-medium w-full relative">
            <div
              className="truncate"
              title={description}
              style={{
                maxWidth: "200px",
                display: "block",
              }}
            >
              {description}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setIsForModification(true);
                    handleRowClick(row.id);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleStatus(task)}>
                  {task.status === "pending"
                    ? "Mark as Completed"
                    : "Mark as Pending"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable<Tasks>({
    data: tasks || [],
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

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 768; // md breakpoint

      if (isMobile) {
        // On mobile, only show essential columns
        setColumnVisibility({
          select: false,
          task: true,
          status: true,
          description: false,
          actions: true,
        });
      } else if (isTablet) {
        // On tablet, show more columns but maybe hide some
        setColumnVisibility({
          select: false,
          task: true,
          status: true,
          description: true,
          actions: true,
        });
      } else {
        // On desktop, show all columns
        setColumnVisibility({
          select: true,
          task: true,
          status: true,
          description: true,
          actions: true,
        });
      }
    };

    // Set initial visibility
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setColumnVisibility]);

  return (
    <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/4 mx-auto px-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("task")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("task")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "description"
                          ? "w-[200px]"
                          : header.id === "task"
                          ? "w-28 md:w-32 lg:w-36 xl:w-[150px]"
                          : header.id === "status"
                          ? "w-20 md:w-24 lg:w-28 xl:w-[100px]"
                          : header.id === "select"
                          ? "w-10 md:w-12 lg:w-14 xl:w-[50px]"
                          : header.id === "actions"
                          ? "w-16 md:w-18 lg:w-20 xl:w-[80px]"
                          : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <Drawer
                    open={openDrawers[row.id]}
                    onOpenChange={(isOpen) => {
                      setOpenDrawers((prev) => ({ ...prev, [row.id]: isOpen }));
                      if (!isOpen) {
                        setIsForModification(false);
                      }
                    }}
                  >
                    <DrawerTrigger asChild>
                      <TableRow
                        onClick={() => {
                          setIsForModification(false);
                          handleRowClick(row.id);
                        }}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={
                              cell.column.id === "description"
                                ? "w-[200px] max-w-[200px] overflow-hidden"
                                : cell.column.id === "task"
                                ? "w-28 md:w-32 lg:w-36 xl:w-[150px] overflow-hidden"
                                : cell.column.id === "status"
                                ? "w-20 md:w-24 lg:w-28 xl:w-[100px]"
                                : cell.column.id === "select"
                                ? "w-10 md:w-12 lg:w-14 xl:w-[50px]"
                                : cell.column.id === "actions"
                                ? "w-16 md:w-18 lg:w-20 xl:w-[80px]"
                                : ""
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </DrawerTrigger>
                    <DrawerContent className="flex items-center justify-center">
                      <TaskCard
                        task={row.getValue("task")}
                        description={row.getValue("description")}
                        status={row.getValue("status")}
                        onAdd={() => handleDrawerClose(row.id)}
                        isModification={isForModification}
                        id={row.original.id}
                      />
                    </DrawerContent>
                  </Drawer>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Drawer open={isAddTaskDrawerOpen} onOpenChange={setIsAddTaskDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="secondary" size="lg" className="w-full">
            Add Task
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex items-center justify-center">
          <TaskCard
            task={newTaskForm.task}
            description={newTaskForm.description}
            status="pending"
            onAdd={() => {
              setIsAddTaskDrawerOpen(false);

              setNewTaskForm({ task: "", description: "" });
            }}
            newTask={true}
            isModification={false}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function Tasks() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-2 sm:p-4 md:p-6">
      <TaskTable />
    </div>
  );
}
