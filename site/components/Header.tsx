import { ThemeToggler } from '@/components/ThemeToggler';
import { GithubLink } from '@/components/GithubLink';
import { HeaderLogo } from '@/components/HeaderLogo';

export const Header = () => (
  <header className="flex items-center justify-between pb-5 border-b mb-7 max-sm:flex-col max-sm:items-start">
    <HeaderLogo />
    <div className="flex items-center max-sm:self-end">
      <GithubLink />
      <ThemeToggler />
    </div>
  </header>
);
