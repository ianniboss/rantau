import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { focusRing } from '@/lib/ui';

const footerLink = `flex min-h-[44px] items-center rounded-md py-2 text-sm text-ink-muted transition-colors hover:text-ink ${focusRing}`;

export const Footer = () => (
  <footer className="mt-auto border-t border-line bg-panel" data-testid="footer">
    <div className="mx-auto grid max-w-7xl grid-cols-2 items-start gap-x-6 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:px-8">
      <div className="col-span-2 md:col-span-1">
        <p className="font-heading text-lg font-extrabold text-ink">Rantau</p>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Connecting Malaysian students across France — events, admin guides, community and city hubs.
        </p>
      </div>
      <nav aria-label="Footer explore" className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-ink">Explore</p>
        <Link to="/events" className={footerLink}>Events</Link>
        <Link to="/resources" className={footerLink}>Resources</Link>
        <Link to="/community" className={footerLink}>Community</Link>
        <Link to="/cities" className={footerLink}>Cities</Link>
      </nav>
      <nav aria-label="Official portals" className="min-w-0">
        <p className="mb-2 text-sm font-semibold text-ink">Official portals</p>
        <a href="https://www.caf.fr" target="_blank" rel="noreferrer" className={footerLink}>CAF</a>
        <a href="https://etudiant-etranger.ameli.fr" target="_blank" rel="noreferrer" className={footerLink}>Ameli (students)</a>
        <a href="https://www.campusfrance.org/en" target="_blank" rel="noreferrer" className={footerLink}>Campus France</a>
        <a href="https://www.jpa.gov.my" target="_blank" rel="noreferrer" className={footerLink}>JPA</a>
      </nav>
      <div className="col-span-2 border-t border-line pt-6 text-sm text-ink-muted md:col-span-3">
        <p className="inline-flex items-center gap-1.5">
          Built with <Heart size={14} className="text-my-red" /> by Ian Hafiz, Toulouse
        </p>
        <p className="mt-2">BUT Informatique · IUT Paul Sabatier · JPA scholar</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Rantau. Not affiliated with any government body.</p>
      </div>
    </div>
  </footer>
);
