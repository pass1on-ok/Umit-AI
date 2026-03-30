import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  variant?: 'page' | 'inline';
  className?: string;
}

const LoadingSpinner = ({ text, variant = 'inline', className = '' }: LoadingSpinnerProps) => {
  const wrapperClass = variant === 'page'
    ? 'min-h-[220px] w-full flex flex-col items-center justify-center gap-3 text-center'
    : 'inline-flex items-center gap-2';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      {text ? <span className="text-sm text-muted-foreground">{text}</span> : null}
    </div>
  );
};

export default LoadingSpinner;
