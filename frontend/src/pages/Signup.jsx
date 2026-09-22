import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthShell } from './Login';
import { useAuth } from '@/hooks/useAuth';
import { CITY_NAMES, YEARS } from '@/lib/constants';
import { friendlyError } from '@/lib/format';
import { btnPrimary, errorCls, inputCls, labelCls } from '@/lib/ui';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { city: 'Toulouse', yearOfStudy: 1 } });

  const onSubmit = async (v) => {
    try {
      await signup({ ...v, email: v.email.trim(), name: v.name.trim(), university: v.university.trim(), course: v.course.trim() });
      toast.success(`Selamat datang, ${v.name.trim().split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <AuthShell title="Join Rantau" subtitle="Free for Malaysian students in France." footer={<>Already have an account? <Link to="/login" data-testid="go-to-login-link" className="font-semibold text-my-blue underline dark:text-my-yellow">Log in</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="signup-form">
        <div>
          <label className={labelCls}>Full name</label>
          <input data-testid="signup-name-input" className={inputCls} placeholder="Ian Hafiz" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" data-testid="signup-email-input" className={inputCls} autoComplete="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input type="password" data-testid="signup-password-input" className={inputCls} autoComplete="new-password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
          {errors.password && <p className={errorCls}>{errors.password.message}</p>}
        </div>
        <div>
          <label className={labelCls}>University</label>
          <input data-testid="signup-university-input" className={inputCls} placeholder="IUT Paul Sabatier" {...register('university', { required: 'University is required' })} />
          {errors.university && <p className={errorCls}>{errors.university.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>City</label>
            <select data-testid="signup-city-input" className={inputCls} {...register('city', { required: true })}>{CITY_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label className={labelCls}>Year of study</label>
            <select data-testid="signup-year-input" className={inputCls} {...register('yearOfStudy')}>{YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}</select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Course</label>
          <input data-testid="signup-course-input" className={inputCls} placeholder="BUT Informatique" {...register('course', { required: 'Course is required' })} />
          {errors.course && <p className={errorCls}>{errors.course.message}</p>}
        </div>
        <button data-testid="signup-submit-button" disabled={isSubmitting} className={`${btnPrimary} w-full`}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
}
