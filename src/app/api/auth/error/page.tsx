import { Suspense } from 'react';
import { redirect } from 'next/navigation';

interface ErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const error = searchParams.error;

  // Redirect to login after 5 seconds
  setTimeout(() => {
    redirect('/login');
  }, 5000);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.';
      case 'EmailSignin':
        return 'Unable to send email. Please try again.';
      case 'OAuthSignin':
        return 'Error signing in with OAuth provider.';
      case 'OAuthCallback':
        return 'Error during OAuth callback.';
      case 'OAuthCreateAccount':
        return 'Could not create account with OAuth provider.';
      case 'EmailCreateAccount':
        return 'Could not create account with email.';
      case 'Callback':
        return 'Error during authentication callback.';
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-gray-900">
            Authentication Error
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {error ? getErrorMessage(error) : 'An unexpected error occurred during authentication.'}
          </p>

          <div className="mt-6">
            <p className="text-xs text-gray-500">
              You will be redirected to the login page in 5 seconds...
            </p>
          </div>

          <div className="mt-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
