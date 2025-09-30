"use client";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { Todo } from "@/generated/prisma";
import { useDebounceValue } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Plus,
  Trash2,
  CircleCheck as CheckCircle,
  Circle,
  User,
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader as Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";

const Dashboard = () => {
  const { user } = useUser();

  const [error, setError] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm] = useDebounceValue(searchTerm, 300);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

  const fetchTodos = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/todos?page=${page}&search=${debounceSearchTerm}`
        );

        if (!response.ok) {
          throw new Error("Failed to load todos");
        }

        const data = await response.json();
        console.log("Data:", data);
        setTodos(data.todos);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    },
    [debounceSearchTerm]
  );

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription");

      if (!response.ok) {
        throw new Error("Unable to fetch subscription");
      }

      const data = await response.json();
      setSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) return;

    try {
      setAddingTodo(true);
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.error);
        setError(data.error);
      }

      setNewTodoTitle("");
      await fetchTodos(currentPage);
    } catch (error) {
      console.log("Error adding todo:", error);
    } finally {
      setAddingTodo(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Unable to delete Todo");
        throw new Error("Unable to delete Todo");
      }

      await fetchTodos(currentPage);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdateTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        setError("Unable to update Todo");
        throw new Error("Unable to update Todo");
      }

      await fetchTodos(currentPage);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTodo(newTodoTitle);
  };

  const handlePageChange = (page: number) => {
    fetchTodos(page);
  };

  useEffect(() => {
    fetchTodos(1);
    fetchSubscriptionStatus();
  }, [fetchTodos]);

  useEffect(() => {
    if (debounceSearchTerm !== undefined) {
      fetchTodos(1);
    }
  }, [debounceSearchTerm, fetchTodos]);

 // Accept either a string or Date
const formatDate = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Alert
            variant="destructive"
            className="max-w-md w-full bg-gray-900 border border-red-700 text-red-200 shadow-xl rounded-lg"
          >
            <button
              onClick={() => setError("")}
              className="absolute top-2 right-2 text-red-300 hover:text-red-500"
              aria-label="Close"
            >
              <X strokeWidth={1.25} />
            </button>
            <AlertDescription className="text-base text-red-100">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold">TodoMaster</h1>
                <p className="text-sm text-gray-400">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {subscribed && (
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  Pro Member
                </Badge>
              )}
              {!subscribed && (
                <Link href="/subscribe">
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
                    Free Member
                  </Badge>
                </Link>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                {user?.imageUrl && (
                  <Image
                    src={user.imageUrl}
                    width={25}
                    height={25}
                    alt="User"
                    className="rounded-full"
                  />
                )}

                <span>
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
              <SignOutButton signOutOptions={{ redirectUrl: "/sign-in" }}>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-4 cursor-pointer">
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || "there"}! 👋
          </h2>
          <p className="text-gray-400">
            Manage your tasks and stay productive with TodoMaster.
          </p>
        </div>

        {/* Add Todo Form */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-400" />
              <span>Add New Todo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <Input
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={addingTodo}
              />
              <Button
                type="submit"
                disabled={addingTodo || !newTodoTitle.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer"
              >
                {addingTodo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Todo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Total: {todos.length} todos</span>
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-4 mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-400">Loading todos...</span>
            </div>
          ) : todos.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  {searchTerm ? "No todos found" : "No todos yet"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Add your first todo to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card
                key={todo.id}
                className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {todo.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle onClick={() => handleUpdateTodo(todo.id)} className="h-5 w-5 text-gray-400 cursor-pointer" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-medium ${
                            todo.completed
                              ? "text-gray-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {formatDate(todo.createdAt)}</span>
                          </div>
                          {todo.updatedAt !== todo.createdAt && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Updated: {formatDate(todo.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteTodo(todo.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages && parseInt(totalPages) > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {Array.from(
                { length: parseInt(totalPages) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={
                    currentPage === page
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                  }
                  size="sm"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= parseInt(totalPages)}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
