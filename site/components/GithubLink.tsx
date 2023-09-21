import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export const GithubLink = () => (
  <Button variant="outline" size="icon" className="mr-4" asChild>
    <a
      href="http://github.com/yuriybahur1/telegraph2md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github className="w-[1.2rem] h-[1.2rem]" />
    </a>
  </Button>
);
