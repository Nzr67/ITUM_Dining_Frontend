"use client"
import { supabase } from '@/lib/supabase'
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SignupForm({
                               className,
                               ...props
                           }: React.ComponentProps<"form">) {
    const [, setDivision] = useState("")

    // Email state
    const [email, setEmail] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [emailError, setEmailError] = useState('')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@itum\.mrt\.ac\.lk$/

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Password state
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [passwordError, setPasswordError] = useState('')

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)

        if (value === '') {
            setIsEmailValid(true)
            setEmailError('')
            return
        }

        if (!emailRegex.test(value)) {
            setIsEmailValid(false)
            setEmailError('Must be a valid student email (e.g., index@itum.mrt.ac.lk)')
        } else {
            setIsEmailValid(true)
            setEmailError('')
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        validatePasswords(value, confirmPassword)
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPassword(value)
        validatePasswords(password, value)
    }

    const validatePasswords = (pass: string, confirmPass: string) => {
        if (pass === '') {
            setIsPasswordValid(true)
            setPasswordError('')
            return
        }

        if (pass.length < 8 || pass.length > 12) {
            setIsPasswordValid(false)
            setPasswordError('Password must be between 8 and 12 characters.')
            return
        }

        if (confirmPass !== '' && pass !== confirmPass) {
            setIsPasswordValid(false)
            setPasswordError('Passwords do not match.')
            return
        }

        setIsPasswordValid(true)
        setPasswordError('')
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!emailRegex.test(email) || password.length < 8 || password.length > 12 || password !== confirmPassword) {
            return
        }

        console.log("Form data valid! Creating user account...")
    }

    const isFormInvalid = !isEmailValid || !isPasswordValid || !email || !password || !confirmPassword

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-3xl font-bold">ITUM DINING</h1>
                    <h2 className="text-xl">Create your account</h2>
                    <p className="text-sm text-balance text-muted-foreground">
                        Fill in the form below to create your account
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input id="firstname" type="text" placeholder="Nishal" required aria-label="First Name" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input id="lastname" type="text" placeholder="Silva" required aria-label="Last Name" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="division">Division</Label>
                    <Select onValueChange={(value) => setDivision(value)}>
                        <SelectTrigger id="division" aria-label="Division">
                            <SelectValue placeholder="Select a division" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="chemicalEngineeringTechnology">Chemical Engineering Technology</SelectItem>
                            <SelectItem value="civilEngineeringTechnology">Civil Engineering Technology</SelectItem>
                            <SelectItem value="electricalEngineeringTechnology">Electrical Engineering Technology</SelectItem>
                            <SelectItem value="electronicTelecommunicationEngineeringTechnology">Electronic & Telecommunication Engineering Technology</SelectItem>
                            <SelectItem value="informationTechnology">Information Technology</SelectItem>
                            <SelectItem value="marineTechnology">Marine Technology</SelectItem>
                            <SelectItem value="mechanicalEngineeringTechnology">Mechanical Engineering Technology</SelectItem>
                            <SelectItem value="nauticalStudies">Nautical Studies</SelectItem>
                            <SelectItem value="polymerTechnology">Polymer Technology</SelectItem>
                            <SelectItem value="textileClothingTechnology">Textile & Clothing Technology</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Web Mail</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="index@itum.mrt.ac.lk"
                        pattern="^[a-zA-Z0-9._%+-]+@itum\.mrt\.ac\.lk$"
                        required
                        aria-label="Web Mail"
                        className={cn(!isEmailValid && "border-destructive focus-visible:ring-destructive")}
                    />
                    {!isEmailValid ? (
                        <p className="text-xs font-medium text-destructive">{emailError}</p>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            We&apos;ll use this to contact you. We will not share your email with anyone else.
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative flex items-center">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            minLength={8}
                            maxLength={12}
                            required
                            aria-label="Password"
                            className={cn(
                                "pr-10",
                                !isPasswordValid && passwordError.includes('between') && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Must be between 8 and 12 characters long.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative flex items-center">
                        <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            aria-label="Confirm Password"
                            className={cn(
                                "pr-10",
                                !isPasswordValid && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {!isPasswordValid ? (
                        <p className="text-xs font-medium text-destructive">{passwordError}</p>
                    ) : (
                        <p className="text-xs text-muted-foreground">Please confirm your password.</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isFormInvalid}>
                    Create Account
                </Button>

            </div>
        </form>
    )
}