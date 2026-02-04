const Section = ({ 
  variant = 'default', 
  className = '', 
  children,
  containerized = true
}) => {
  const variants = {
    hero: 'h-screen',
    full: 'min-h-screen',
    large: 'h-[80vh]',
    medium: 'h-[60vh]',
    default: 'py-20 md:py-32',
    compact: 'py-12 md:py-16',
    flush: '',
  };

  const content = containerized ? (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
      {children}
    </div>
  ) : children;

  const sectionClass = variant === 'hero'
    ? `w-full ${variants[variant]} min-h-0 flex flex-col ${className}`.trim()
    : `w-full ${variants[variant]} ${className}`.trim();

  return (
    <section className={sectionClass}>
      {content}
    </section>
  );
};

export default Section;

