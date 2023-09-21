import Link from 'next/link';

const NotFound = () => (
  <>
    <h1 className="text-2xl font-bold text-destructive mb-3">Not found</h1>
    <Link href="/" className="underline">
      To home
    </Link>
  </>
);

export default NotFound;
