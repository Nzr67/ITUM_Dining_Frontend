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
import { Eye, EyeOff } from "lucide-react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9]+@itum\.mrt\.ac\.lk$/
    return regex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format. Use indexNumber@itum.mrt.ac.lk"
    }

    if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password must be between 8 and 12 characters."
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully", { firstName, lastName, email, password })
      // Proceed with signup logic
      alert("Account created successfully!")
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="index@itum.mrt.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email ? (
                <p className="text-sm font-medium text-destructive mt-1">{errors.email}</p>
              ) : (
                <FieldDescription>
                  We will not share your email with anyone else.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="division">Select Your Division</FieldLabel>
              <Select>
                <SelectTrigger className="w-full">
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
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              <Button type="submit" className="w-full sm:w-auto px-8">
                Create Account
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <a href="/Login" className="underline hover:text-primary">Sign in</a>
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
