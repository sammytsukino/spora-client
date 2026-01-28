const Section = ({ 
  variant = 'default', 
  className = '', 
  children,
  containerized = true
}) => {
  const variants = {
    hero: 'h-screen',
    full: 'h-screen',
    large: 'h-[80vh]',
    medium: 'h-[60vh]',
    default: 'py-20 md:py-32',
    compact: 'py-12 md:py-16'
  };

  const content = containerized ? (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
      {children}
    </div>
  ) : children;

  return (
    <section className={`w-full ${variants[variant]} ${className}`}>
      {content}
    </section>
  );
};

export default Section;

