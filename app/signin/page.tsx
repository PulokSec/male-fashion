import { SignInForm } from "@/components/auth/signin-form"
import { getServerUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default async function SignInPage() {
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
      <div className="mx-auto flex flex-col justify-center space-y-6 w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to sign in to your account</p>
        </div>
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
      <Footer/>
    </div>
  )
}
