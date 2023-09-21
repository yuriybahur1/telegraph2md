'use client';

import { Button } from '@/components/ui/button';

type Props = {
  error: Error;
  reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => (
  <>
    <h1 className="text-2xl font-bold text-destructive mb-3">
      Error: {error.message}
    </h1>
    <Button onClick={reset} className="text-base max-sm:h-11">
      Try again
    </Button>
  </>
);

export default ErrorPage;
