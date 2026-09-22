import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer = () => (
  <footer className="mt-auto border-t border-line bg-panel" data-testid="footer">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <p className="font-heading text-lg font-extrabold text-ink">Rantau</p>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Connecting Malaysian students across France — events, admin guides, community and city hubs.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <p className="font-semibold text-ink">Explore</p>
          <Link to="/events" className="block text-ink-muted hover:text-ink">Events</Link>
          <Link to="/resources" className="block text-ink-muted hover:text-ink">Resources</Link>
          <Link to="/community" className="block text-ink-muted hover:text-ink">Community</Link>
          <Link to="/cities" className="block text-ink-muted hover:text-ink">Cities</Link>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-ink">Official portals</p>
          <a href="https://www.caf.fr" target="_blank" rel="noreferrer" className="block text-ink-muted hover:text-ink">CAF</a>
          <a href="https://etudiant-etranger.ameli.fr" target="_blank" rel="noreferrer" className="block text-ink-muted hover:text-ink">Ameli (students)</a>
          <a href="https://www.campusfrance.org/en" target="_blank" rel="noreferrer" className="block text-ink-muted hover:text-ink">Campus France</a>
          <a href="https://www.jpa.gov.my" target="_blank" rel="noreferrer" className="block text-ink-muted hover:text-ink">JPA</a>
        </div>
      </div>
      <div className="text-sm text-ink-muted md:text-right">
        <p className="inline-flex items-center gap-1.5">
          Built with <Heart size={14} className="text-my-red" /> by Ian Hafiz, Toulouse
        </p>
        <p className="mt-2">BUT Informatique · IUT Paul Sabatier · JPA scholar</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Rantau. Not affiliated with any government body.</p>
      </div>
    </div>
  </footer>
);
