import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const ErrorMessage = ({
  message,
  retryLabel = 'Retry',
  onRetry,
  onDismiss,
  dismissible = true,
}: ErrorMessageProps) => {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive-foreground shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 text-destructive" />
        <div className="flex-1">
          <p className="font-semibold text-destructive">Something went wrong</p>
          <p className="mt-1 text-muted-foreground">{message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {onRetry ? (
              <Button size="sm" variant="secondary" onClick={onRetry}>
                {retryLabel}
              </Button>
            ) : null}
            {onDismiss ? (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            ) : null}
          </div>
        </div>
        {dismissible && onDismiss ? (
          <button onClick={onDismiss} className="rounded-full p-2 text-muted-foreground hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorMessage;
