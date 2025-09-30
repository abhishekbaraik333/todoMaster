"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CircleCheck as CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (error) {
      if(error instanceof Error){
        console.log(JSON.stringify(error, null, 2));
        setError(error.message);
      }
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      console.log(result);

      if (result.status !== "complete") {
        console.log(JSON.stringify(result, null, 2));
      }

      if (result.status === "complete") {
        console.log(result);

        await setActive({ session: result.createdSessionId });
        try {    
          const response = await fetch("/api/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailAddress,
              clerkId: result.createdUserId, // Get this from Clerk API response
            }),
          });
        } catch (error) {
          console.log("Error creating user");
          
        }
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      if(error instanceof Error){
        console.log(JSON.stringify(error, null, 2));
        setError(error.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <CheckCircle className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold">TodoMaster</span>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {!pendingVerification
                ? "Create Your Account"
                : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {!pendingVerification
                ? "Join TodoMaster and start organizing your tasks"
                : `We've sent a verification code to ${emailAddress}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!pendingVerification ? (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-300 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-11 pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/20 border-red-800 text-red-300"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Create Account
                </Button>
              </form>
            ) : (
              <form onSubmit={onPressVerify} className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-300 font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-11 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/20 border-red-800 text-red-300"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Verify Email
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Didn&apos;t receive the code?
                    <button
                      type="button"
                      onClick={() => setPendingVerification(false)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center pt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* CAPTCHA Widget */}
        <div id="clerk-captcha"></div>

        {/* Additional links */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
