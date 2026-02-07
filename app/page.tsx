"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck as CheckCircle, Clock, Users, Zap, ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description: "Organize your tasks with intelligent categorization, priorities, and due dates."
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Track time spent on tasks and analyze your productivity patterns."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects and collaborate seamlessly with your team members."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with instant sync across all your devices."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">TodoMaster</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">
                Pricing
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">
                About
              </a>
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-300 cursor-pointer hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
                </Link>
                <Link href="/sign-up">
                <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6">
                  Sign Up
                </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800/50 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 px-2">
                  Features
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 px-2">
                  Pricing
                </a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 px-2">
                  About
                </a>
                <div className="flex flex-col space-y-2 px-2 pt-2 border-t border-gray-800/50">
                <Link href="sign-in">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start">
                    Sign Up
                  </Button>
                </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Master Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}Tasking
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              The most intuitive todo app that adapts to your workflow. 
              Organize, prioritize, and accomplish more with less effort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-4 text-lg transition-all duration-200"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Stay
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}Organized
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to help you manage tasks efficiently and boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already revolutionized how they manage their tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group transition-all duration-200 transform hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-4 text-lg transition-all duration-200"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckCircle className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold">TodoMaster</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Support</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500">
            <p>&copy; 2025 TodoMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}