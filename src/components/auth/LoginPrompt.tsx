// components/auth/LoginPrompt.tsx
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

export const LoginPrompt = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl text-gray-700 font-bold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to add a new food place. Please login or create an account to continue.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => router.push('/auth/signin')}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

