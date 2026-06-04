import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { useAuth } from '@/src/contexts/AuthContext';

export function VerifyEmailPage() {
  const { user, resendVerificationEmail, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setResending(true);
    try {
      await resendVerificationEmail();
      setMessage('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send email.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setError(null);
    setMessage(null);
    setChecking(true);
    try {
      const verified = await refreshUser();
      if (verified) {
        navigate('/', { replace: true });
        return;
      }
      setMessage('Email not verified yet. Click the link in your inbox, then try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not refresh status.');
    } finally {
      setChecking(false);
    }
  };

  if (!user) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle="Sign in to continue email verification."
      >
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-indigo-600 px-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Go to sign in
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="For security, verified business clients must confirm their email before accessing the portal."
    >
      <Card className="shadow-md">
        <CardContent className="pt-6 space-y-4 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-indigo-600" aria-hidden="true" />
          <p className="text-sm text-slate-600">
            We sent a verification link to <strong>{user.email}</strong>. Open the link, then
            return here and confirm.
          </p>

          {message && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <Button
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleCheckVerified}
            disabled={checking}
          >
            {checking ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Checking…
              </>
            ) : (
              "I've verified my email"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending…' : 'Resend verification email'}
          </Button>

          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Sign out and use a different account
          </button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
