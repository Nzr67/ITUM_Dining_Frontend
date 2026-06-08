"use client"

import Link from "next/link"
import * as React from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [studentId, setStudentId] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/"

  const domain = "@itum.mrt.ac.lk"

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    // 1) Check if the studentId (studentWebmail state) contains an '@' symbol
    if (studentId.includes("@")) {
      setError("Please enter only your Student ID (e.g. 24it0123/23it0123)")
      setIsLoading(false)
      return
    }

    // 2) Create a formattedEmail variable
    const formattedEmail = `${studentId}${domain}`

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formattedEmail,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user info and token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("access_token", data.access_token)
        // Redirect on 200 OK
        router.push("/")
      } else {
        setError(data.detail || "Login failed")
      }
    } catch {
      setError("Could not connect to the server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <Link 
          href={from}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-zinc-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <CardHeader className="pt-12">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your student ID to sign in to your ITUM webmail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {error && (
                <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm font-medium">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="student-id">Webmail</FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    id="student-id"
                    type="text"
                    placeholder="studentid"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={isLoading}
                    className="pr-[110px]"
                  />
                  <span className="absolute right-3 text-sm text-muted-foreground pointer-events-none select-none">
                    {domain}
                  </span>
                </div>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </Field>
              <Field>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Login"}
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don&apos;t have an account? <Link href="/signup?from=/login" className="underline underline-offset-4 hover:text-primary">Sign up</Link>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
