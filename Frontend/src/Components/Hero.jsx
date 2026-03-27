import React from 'react';

const Hero = ({ children, full = false, backgroundImage, overlay = true }) => {
  return (
    <section
      className={`relative flex items-center justify-center bg-cover bg-center ${
        full ? 'min-h-screen' : 'min-h-[60vh]'
      }`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative z-10 container mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

export default Hero;