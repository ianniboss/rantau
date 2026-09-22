import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Bookmark, Calendar, FileText, MessagesSquare, LogOut, Pencil, MapPin, GraduationCap, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Page } from '@/components/Page';
import { EventCard } from '@/components/EventCard';
import { ResourceCard } from '@/components/ResourceCard';
import { PostCard } from '@/components/PostCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { CITY_NAMES, ROLE_LABELS, YEARS } from '@/lib/constants';
import { fetchEventsBy, fetchEventsByIds, fetchPostsBy, fetchResourcesBy, fetchUser, updateUser } from '@/lib/db';
import { friendlyError, initials, formatDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, btnSecondary, inputCls, labelCls, pillCls } from '@/lib/ui';

const EditForm = ({ profile, onDone }) => {
  const { refreshProfile } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { ...profile, instagram: profile.socialLinks?.instagram || '', linkedin: profile.socialLinks?.linkedin || '', website: profile.socialLinks?.website || '' } });
  const submit = async (v) => {
    try {
      await updateUser(profile.uid, { name: v.name.trim(), university: v.university.trim(), city: v.city, yearOfStudy: Number(v.yearOfStudy), course: v.course.trim(), socialLinks: { instagram: v.instagram.trim(), linkedin: v.linkedin.trim(), website: v.website.trim() } });
      await refreshProfile();
      toast.success('Profile updated');
      onDone();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2" data-testid="profile-edit-form">
      <div><label className={labelCls}>Name</label><input data-testid="profile-name-input" className={inputCls} {...register('name', { required: true })} /></div>
      <div><label className={labelCls}>University</label><input data-testid="profile-university-input" className={inputCls} {...register('university', { required: true })} /></div>
      <div><label className={labelCls}>City</label><select data-testid="profile-city-input" className={inputCls} {...register('city')}>{CITY_NAMES.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div><label className={labelCls}>Year of study</label><select data-testid="profile-year-input" className={inputCls} {...register('yearOfStudy')}>{YEARS.map((y) => <option key={y} value={y}>{`Year ${y}`}</option>)}</select></div>
      <div className="sm:col-span-2"><label className={labelCls}>Course</label><input data-testid="profile-course-input" className={inputCls} {...register('course', { required: true })} /></div>
      <div><label className={labelCls}>Instagram</label><input data-testid="profile-instagram-input" className={inputCls} placeholder="@handle" {...register('instagram')} /></div>
      <div><label className={labelCls}>LinkedIn</label><input data-testid="profile-linkedin-input" className={inputCls} placeholder="https://linkedin.com/in/…" {...register('linkedin')} /></div>
      <div className="sm:col-span-2"><label className={labelCls}>Website</label><input data-testid="profile-website-input" className={inputCls} placeholder="https://" {...register('website')} /></div>
      <div className="flex gap-2 sm:col-span-2">
        <button data-testid="profile-save-button" disabled={isSubmitting} className={btnPrimary}>Save changes</button>
        <button type="button" onClick={onDone} className={btnSecondary}>Cancel</button>
      </div>
    </form>
  );
};

const TABS = [
  { id: 'saved', label: 'Saved events', icon: Bookmark, ownOnly: true },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'posts', label: 'Posts', icon: MessagesSquare },
];

export default function Profile() {
  const { uid: paramUid } = useParams();
  const { user, profile: ownProfile, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isOwn = !paramUid || paramUid === user?.uid;
  const uid = isOwn ? user?.uid : paramUid;
  const [tab, setTab] = useState(isOwn ? 'saved' : 'events');
  const [editing, setEditing] = useState(false);

  const { data: fetched, isLoading } = useQuery({ queryKey: ['user', uid], queryFn: () => fetchUser(uid), enabled: !!uid && !isOwn });
  const profile = isOwn ? ownProfile : fetched;

  const saved = useQuery({ queryKey: ['savedEvents', uid, ownProfile?.savedEvents], queryFn: () => fetchEventsByIds(ownProfile?.savedEvents || []), enabled: isOwn && tab === 'saved' });
  const events = useQuery({ queryKey: ['userEvents', uid], queryFn: () => fetchEventsBy(uid), enabled: !!uid && tab === 'events' });
  const resources = useQuery({ queryKey: ['userResources', uid], queryFn: () => fetchResourcesBy(uid), enabled: !!uid && tab === 'resources' });
  const posts = useQuery({ queryKey: ['userPosts', uid], queryFn: () => fetchPostsBy(uid), enabled: !!uid && tab === 'posts' });

  if (!isOwn && isLoading) return <Page testId="profile-page"><div className="skeleton h-40 rounded-2xl" /><ListSkeleton count={3} /></Page>;
  if (!profile) return <Page testId="profile-page"><EmptyState title={isOwn ? 'Finish setting up your profile' : 'Profile not found'} message={isOwn ? "We couldn't load your profile document. Try logging out and back in." : 'This user may not exist.'} actionLabel="Go home" actionTo="/" /></Page>;

  const visibleResources = (resources.data || []).filter((r) => isOwn || r.status === 'approved');
  const content = {
    saved: { q: saved, items: saved.data || [], empty: ['No saved events', 'Tap "Save event" on any event to keep it here.', '/events', 'Browse events'], render: (e) => <EventCard event={e} /> },
    events: { q: events, items: events.data || [], empty: [isOwn ? "You haven't organised anything yet" : 'No events organised', isOwn ? 'Your events will be listed here.' : '', isOwn ? '/events/new' : null, 'Create an event'], render: (e) => <EventCard event={e} /> },
    resources: { q: resources, items: visibleResources, empty: ['No resources shared', isOwn ? 'Upload a guide or template to help others.' : '', isOwn ? '/resources/new' : null, 'Submit resource'], render: (r) => <ResourceCard resource={r} /> },
    posts: { q: posts, items: posts.data || [], empty: ['No posts yet', isOwn ? 'Start a discussion on the community board.' : '', isOwn ? '/community/new' : null, 'Write a post'], render: (p) => <PostCard post={p} />, list: true },
  }[tab];

  return (
    <Page testId="profile-page">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-card">
        <div className="hero-gradient h-24 sm:h-32" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-2xl bg-my-yellow font-heading text-2xl font-extrabold text-[#010066] ring-4 ring-panel">{initials(profile.name)}</span>
              <div className="pb-1">
                <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl" data-testid="profile-name">{profile.name}</h1>
                <span className="inline-flex rounded-full bg-my-blue/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow" data-testid="profile-role">{ROLE_LABELS[profile.role] || 'Student'}</span>
              </div>
            </div>
            {isOwn && (
              <div className="flex gap-2">
                <button data-testid="edit-profile-button" onClick={() => setEditing((e) => !e)} className={btnSecondary}><Pencil size={15} /> Edit profile</button>
                <button data-testid="logout-button" onClick={async () => { await logout(); qc.clear(); navigate('/'); toast.success('Logged out'); }} className={btnSecondary}><LogOut size={15} /> Log out</button>
              </div>
            )}
          </div>
          {editing && isOwn ? (
            <div className="mt-6"><EditForm profile={profile} onDone={() => setEditing(false)} /></div>
          ) : (
            <div className="mt-5 grid gap-2 text-sm text-ink-muted sm:grid-cols-2" data-testid="profile-details">
              <p className="flex items-center gap-2"><GraduationCap size={15} /> {profile.course} · Year {profile.yearOfStudy}</p>
              <p className="flex items-center gap-2"><MapPin size={15} /> {profile.university}, {profile.city}</p>
              {profile.joinedDate && <p>Joined {formatDate(profile.joinedDate, 'MMMM yyyy')}</p>}
              {Object.values(profile.socialLinks || {}).some(Boolean) && (
                <p className="flex flex-wrap items-center gap-3">
                  <Link2 size={15} />
                  {profile.socialLinks.instagram && <span>{profile.socialLinks.instagram}</span>}
                  {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
                  {profile.socialLinks.website && <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="underline">Website</a>}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" data-testid="profile-tabs">
        {TABS.filter((t) => isOwn || !t.ownOnly).map((t) => (
          <button key={t.id} data-testid={`profile-tab-${t.id}`} onClick={() => setTab(t.id)} className={`${pillCls(tab === t.id)} inline-flex items-center gap-1.5`}><t.icon size={14} /> {t.label}</button>
        ))}
      </div>
      <div className="mt-6">
        {content.q.isLoading ? <ListSkeleton count={3} image={!content.list} cols={content.list ? 'grid-cols-1' : undefined} /> : content.items.length === 0 ? (
          <EmptyState title={content.empty[0]} message={content.empty[1]} actionLabel={content.empty[2] ? content.empty[3] : undefined} actionTo={content.empty[2]} testId={`profile-${tab}-empty`} />
        ) : (
          <StaggerGrid className={content.list ? 'grid grid-cols-1 gap-4' : undefined} testId={`profile-${tab}-list`}>
            {content.items.map((item) => <StaggerItem key={item.id} hover={!content.list}>{content.render(item)}</StaggerItem>)}
          </StaggerGrid>
        )}
      </div>
      {!isOwn && user && <p className="mt-8 text-sm text-ink-muted"><Link to="/profile" className="underline">Back to my profile</Link></p>}
    </Page>
  );
}
