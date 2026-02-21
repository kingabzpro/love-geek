import { ensureUserInDb } from '@/lib/user-sync';
import { updateProfile } from '@/actions/profile';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Ghost } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await ensureUserInDb();

  // If already completed, go to swipe page
  if (user?.profileCompleted) {
    redirect('/swipe');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center absolute inset-0 z-[100] h-full overflow-auto">
      {/* Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between p-4 mb-4">
        <div className="flex items-center space-x-2">
          <Ghost className="w-8 h-8 text-indigo-600" />
          <span className="font-bold text-xl text-indigo-600">GeekMatch</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl mt-4 mx-4">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Complete Profile</h2>
          <p className="mt-2 text-sm text-gray-600">Let's set up your player stats.</p>
        </div>
        
        <form action={updateProfile} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={user?.name || ''}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="E.g., Master Chief"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={user?.bio || ''}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="What games are you currently playing?"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={user?.imageUrl || ''}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com/your-avatar.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">Leave blank to keep your current avatar.</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Profile & Start Swiping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}