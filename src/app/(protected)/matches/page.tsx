import { getMatches } from '@/actions/match';

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h1>
      
      {matches.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p>No matches yet. Keep swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {matches.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}