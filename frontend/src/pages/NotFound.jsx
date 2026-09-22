import { Compass } from 'lucide-react';
import { Page } from '@/components/Page';
import { EmptyState } from '@/components/EmptyState';

export default function NotFound() {
  return (
    <Page className="max-w-2xl" testId="not-found-page">
      <EmptyState icon={Compass} title="Page not found" message="Looks like you wandered off the map. Let's get you back." actionLabel="Go home" actionTo="/" testId="not-found" />
    </Page>
  );
}
