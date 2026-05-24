"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

    return (
        <form className={cn("flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
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
                            <SelectItem value="electronic&telecommunicationEngineeringTechnology">Electronic Engineering Technology</SelectItem>
                            <SelectItem value="informationTechnology">Information Technology</SelectItem>
                            <SelectItem value="marineTechnology">Marine Technology</SelectItem>
                            <SelectItem value="Marine">Chemical Engineering Technology</SelectItem>
                            <SelectItem value="mechanicalEngineeringTechnology">Mechanical Engineering Technology</SelectItem>
                            <SelectItem value="nauticalStudies">Nautical Studies</SelectItem>
                            <SelectItem value="polymerTechnology">Polymer Technology</SelectItem>
                            <SelectItem value="textile&ClothingTechnology">Textile & Clothing Technology</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Web Mail</Label>
                    <Input id="email" type="email" placeholder="index@itum.mrt.ac.lk" required aria-label="Web Mail" />
                    <p className="text-xs text-muted-foreground">
                        We&apos;ll use this to contact you. We will not share your email with anyone else.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required aria-label="Password" />
                    <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters long.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required aria-label="Confirm Password" />
                    <p className="text-xs text-muted-foreground">Please confirm your password.</p>
                </div>

                <Button type="submit">Create Account</Button>
            </div>
        </form>
    )
}