"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import CryptoJS from "crypto-js"
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
      // 3) Hash the password using crypto-js
      const hashedPassword = CryptoJS.SHA256(password).toString()

      // 3) Update the fetch POST request payload
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_webmail: formattedEmail,
          password: hashedPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect on 200 OK
        router.push("/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
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
                  Don&apos;t have an account? <a href="#" className="underline underline-offset-4 hover:text-primary">Sign up</a>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
