import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/services/taskApi";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onAdd: () => void;
  task: string;
  description: string;
  status?: "pending" | "completed";
  isModification: boolean;
  newTask?: boolean;
  id?: string;
};

export const TaskCard: React.FC<Props> = ({
  onAdd,
  task: initialTask,
  description: initialDescription,
  status = "pending",
  isModification,
  newTask,
  id,
}) => {
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [task, setTask] = React.useState(initialTask);
  const [description, setDescription] = React.useState(initialDescription);
  const [taskStatus, setTaskStatus] = React.useState<"pending" | "completed">(status);

  React.useEffect(() => {
    setTask(initialTask);
    setDescription(initialDescription);
    setTaskStatus(status);
  }, [initialTask, initialDescription, status]);

  const handleAddTask = async (task: string, description: string) => {
    try {
      await createTask({ title: task, description });
      toast.success("Task created successfully");
    
      onAdd();
    } catch (err) {
      console.log(err);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (id: string, task: string, description: string, status: "pending" | "completed") => {
    if (!id) {
      console.error("Cannot update task: No task ID provided");
      toast.error("Failed to update task: No ID provided");
      return;
    }
    
    try {
      console.log("Updating task with ID:", id, "Status:", status);
      const response = await updateTask({ 
        id, 
        title: task, 
        description, 
        status 
      });
      
      if ('data' in response) {
        console.log("Update successful:", response.data);
        toast.success("Task updated successfully");
      } else if ('error' in response) {
        console.error("Update API error:", response.error);
        toast.error("Server error updating task");
      }
      
      onAdd();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isModification ? "Update Task" : (newTask ? "Create Task" : "Your Task")}</CardTitle>
        <CardDescription>
          {isModification
            ? "Update your task details"
            : newTask 
              ? "Create a new task with name and description"
              : "Task details"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Task</Label>
              <Input
                disabled={(!isModification && !newTask) || false}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                id="name"
                placeholder="Name of your task"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Description</Label>
              <Textarea
                className="max-w-xs overflow-y-auto max-h-[100px]"
                disabled={(!isModification && !newTask) || false}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type your description here."
              />
            </div>
            {(isModification || !newTask) && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  disabled={!isModification && !newTask}
                  value={taskStatus}
                  onValueChange={(value: "pending" | "completed") => setTaskStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      {(isModification || newTask) && (
        <CardFooter className="flex justify-between">
          <Button 
            onClick={() => {
              console.log("Button clicked, newTask:", newTask, "isModification:", isModification, "id:", id);
              if (newTask) {
                handleAddTask(task, description);
              } else if (isModification && id) {
                handleUpdateTask(id, task, description, taskStatus);
              }
            }} 
            variant="default"
          >
            {isModification ? "Update" : "Add"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
