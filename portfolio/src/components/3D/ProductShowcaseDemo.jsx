import { lazy, Suspense } from 'react';
import ProductShowcase from './ProductShowcase';
import LoadingFallback from './LoadingFallback';

// Lazy load the 3D showcase for better performance
const LazyProductShowcase = lazy(() => Promise.resolve({ default: ProductShowcase }));

/**
 * Demo component to showcase 3D cereal boxes
 * This can be integrated into the Featured section
 */
export default function ProductShowcaseDemo() {
  // Sample project data - replace with your actual projects
  const sampleProjects = [
    {
      id: 'project-1',
      title: 'FEATURED',
      accentColor: '#F0544F',
      description: 'My flagship project',
    },
    {
      id: 'project-2',
      title: 'SKILLS',
      accentColor: '#1FA9A4',
      description: 'Technical expertise',
    },
    {
      id: 'project-3',
      title: 'INGREDIENTS',
      accentColor: '#F4C542',
      description: 'Detailed breakdown',
    },
    {
      id: 'project-4',
      title: 'CONTACT',
      accentColor: '#2F6FED',
      description: 'Get in touch',
    },
  ];

  const handleProjectClick = (project, index) => {
    console.log('Project clicked:', project, index);
    // You can navigate to project details or open a modal here
  };

  return (
    <div className="w-full">
      <Suspense fallback={<LoadingFallback />}>
        <LazyProductShowcase
          projects={sampleProjects}
          onProjectClick={handleProjectClick}
          accentColor="#F0544F"
        />
      </Suspense>
    </div>
  );
}

