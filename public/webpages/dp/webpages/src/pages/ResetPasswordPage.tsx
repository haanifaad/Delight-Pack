import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { AuthFormField } from '@/src/components/auth/AuthFormField';
import { useAuth } from '@/src/contexts/AuthContext';

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your business email and we will send you a secure reset link."
    >
      <Card className="shadow-md">
        <CardContent className="pt-6">
          {success ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
              <p className="text-sm text-slate-600">
                If an account exists for <strong>{email}</strong>, you will receive a password
                reset email shortly. Check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <AuthFormField
                id="email"
                label="Business email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                required
                disabled={submitting}
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>

              <p className="text-center text-sm text-slate-500">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
