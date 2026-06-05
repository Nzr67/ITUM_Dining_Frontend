"use client"

import Link from "next/link"
import * as React from "react"
import { useState } from "react"
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [division, setDivision] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ studentId?: string; password?: string; confirmPassword?: string; general?: string }>({})

  const domain = "@itum.mrt.ac.lk"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const newErrors: { studentId?: string; password?: string; confirmPassword?: string } = {}

    if (studentId.includes("@")) {
      newErrors.studentId = "Please enter only your Student ID (e.g. 24it0123)"
    }

    if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password must be between 8 and 12 characters."
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        const formattedEmail = `${studentId}${domain}`
        
        const response = await fetch("http://localhost:8000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email: formattedEmail,
            password: password,
            division: division
          }),
        })

        const data = await response.json()

        if (response.ok) {
          alert("Account created successfully!")
          router.push("/login")
        } else {
          setErrors({ general: data.detail || "Signup failed. Please try again." })
        }
      } catch (error) {
        setErrors({ general: "Could not connect to the server." })
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  return (
    <Card {...props} className="relative">
      <Link 
        href={from}
        className="absolute left-4 top-4 p-2 rounded-full hover:bg-zinc-100 transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <CardHeader className="pt-12">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {errors.general && (
              <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm font-medium">
                {errors.general}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
            </div>
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
              {errors.studentId ? (
                <p className="text-sm font-medium text-destructive mt-1">{errors.studentId}</p>
              ) : (
                <FieldDescription>
                  Enter your student ID to use your ITUM webmail.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="division">Select Your Division</FieldLabel>
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger className="w-full" disabled={isLoading}>
                  <SelectValue placeholder="Select your division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chemical">Chemical Engineering Technology</SelectItem>
                  <SelectItem value="civil">Civil Engineering Technology</SelectItem>
                  <SelectItem value="electrical">Electrical, Electronic & Telecommunication Engineering Technology</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="marine">Marine Technology</SelectItem>
                  <SelectItem value="mechanical">Mechanical Engineering Technology</SelectItem>
                  <SelectItem value="nautical">Nautical Studies</SelectItem>
                  <SelectItem value="polymer">Polymer Technology</SelectItem>
                  <SelectItem value="textile">Textile & Clothing Technology</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-sm font-medium text-destructive mt-1">{errors.password}</p>
              ) : (
                <FieldDescription>
                  Must be between 8 and 12 characters long.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive mt-1">{errors.confirmPassword}</p>
              )}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <div className="flex flex-col items-center gap-4 mt-4">
              <Button type="submit" className="w-full sm:w-auto px-8" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login?from=/signup" className="underline hover:text-primary">Sign in</Link>
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
