import { SignUpForm } from "@/components/auth/signup-form"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerUser } from "@/lib/auth"
import Footer from "@/components/footer"
import Header from "@/components/header"
import TopBar from "@/components/top-bar"

export default async function SignUpPage() {
  const user = await getServerUser()

  // Redirect to profile if already signed in
  if (user && !user?.isAdmin) {
    redirect("/profile")
  }
  if (user && user?.isAdmin) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="">
          <TopBar/>
          <Header/>
    <div className="container mx-auto flex my-20 flex-col items-center justify-center px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
    </div>
  )
}
