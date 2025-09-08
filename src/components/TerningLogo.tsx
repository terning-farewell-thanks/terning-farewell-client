interface TerningLogoProps {
  className?: string;
  variant?: 'full' | 'text-only' | 'icon-only';
}

export function TerningLogo({ className, variant = 'full' }: TerningLogoProps) {
  if (variant === 'text-only') {
    return (
      <img 
        src="/lovable-uploads/8facd738-0863-4ac2-9b15-1d70d1159e3c.png" 
        alt="terning" 
        className={`h-8 ${className}`}
      />
    );
  }
  
  if (variant === 'icon-only') {
    return (
      <img 
        src="/lovable-uploads/97fee445-49bc-4323-8e28-e4d9f2d6c973.png" 
        alt="terning logo" 
        className={`h-8 ${className}`}
      />
    );
  }
  
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <img 
        src="/lovable-uploads/97fee445-49bc-4323-8e28-e4d9f2d6c973.png" 
        alt="terning logo" 
        className="h-16 md:h-20 lg:h-24"
      />
      <img 
        src="/lovable-uploads/8facd738-0863-4ac2-9b15-1d70d1159e3c.png" 
        alt="terning" 
        className="h-12 md:h-16 lg:h-20"
      />
    </div>
  );
}