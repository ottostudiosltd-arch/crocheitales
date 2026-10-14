import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <span className="font-handwriting text-6xl text-brand-dustyRose">
        Lost a stitch? ♡
      </span>
      <h1 className="text-4xl sm:text-5xl font-serif text-brand-burgundy font-normal">
        404 — Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-brand-text-muted max-w-md">
        The thread got a little tangled, and the page you are looking for doesn't seem to exist.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Crochei Tales Home
        </Button>
      </Link>
    </div>
  );
};
