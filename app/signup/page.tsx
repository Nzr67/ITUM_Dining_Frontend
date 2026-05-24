import SignupForm from "@/components/SignupForm"

export default function SignupPage() {

    return (
        <main className="min-h-screen flex items-center justify-center">

            <div className="w-full max-w-md">

                <h1 className="text-4xl font-bold mb-6">
                    Create Account
                </h1>

                <SignupForm />

            </div>

        </main>
    )
}