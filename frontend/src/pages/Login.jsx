import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Page } from '@/components/Page';
import { useAuth } from '@/hooks/useAuth';
import { friendlyError } from '@/lib/format';
import { btnPrimary, errorCls, inputCls, labelCls } from '@/lib/ui';

export const AuthShell = ({ title, subtitle, children, footer }) => (
  <Page className="max-w-md" testId="auth-page">
    <div className="rounded-2xl border border-line bg-panel p-6 shadow-card sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-2 w-8 rounded-full bg-my-blue" /><span className="h-2 w-4 rounded-full bg-my-red" /><span className="h-2 w-2 rounded-full bg-my-yellow" />
      </div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
      <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
    </div>
  </Page>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (v) => {
    try {
      await login(v.email.trim(), v.password);
      toast.success('Welcome back!');
      navigate(state?.from || '/', { replace: true });
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <AuthShell title="Log in" subtitle="Good to see you again." footer={<>New here? <Link to="/signup" data-testid="go-to-signup-link" className="font-semibold text-my-blue underline dark:text-my-yellow">Create an account</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" data-testid="login-email-input" className={inputCls} autoComplete="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input type="password" data-testid="login-password-input" className={inputCls} autoComplete="current-password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className={errorCls}>{errors.password.message}</p>}
        </div>
        <button data-testid="login-submit-button" disabled={isSubmitting} className={`${btnPrimary} w-full`}>{isSubmitting ? 'Logging in…' : 'Log in'}</button>
      </form>
    </AuthShell>
  );
}
