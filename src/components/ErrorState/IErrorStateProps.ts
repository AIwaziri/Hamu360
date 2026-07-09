export interface IErrorStateProps {
  /** @default 'Something went wrong' */
  title?: string;
  description?: string;
  /** Omit to render with no retry action — e.g. for a page-level failure the user can't self-service by retrying (a permissions error). */
  onRetry?: () => void;
  className?: string;
}
