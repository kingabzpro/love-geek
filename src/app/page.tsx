import Link from 'next/link';
import { Ghost, ArrowRight } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/swipe');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
        <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Ghost className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">GeekMatch</h1>
        <p className="text-lg text-gray-600 mb-8 font-medium">Find your player 2.</p>
        
        <div className="space-y-4">
          <Link href="/sign-in" className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-semibold group">
            Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/sign-up" className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors font-semibold">
            Create Account
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
}