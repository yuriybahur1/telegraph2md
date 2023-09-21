import { useId, useState } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { getApiUrl, getMarkdown } from 'telegraph2md';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
};

const getMetaMd = (meta: object) =>
  '---\n' + JSON.stringify(meta, null, 2) + '\n---\n\n';

export const Form = ({ setMarkdown }: Props) => {
  const urlInputId = useId();

  const checkboxId = useId();

  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState('');

  const [error, setError] = useState<Error | null>(null);

  const [withMeta, setWithMeta] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMarkdown('');

      setError(null);

      setLoading(true);

      const apiUrl = getApiUrl(url);

      const apiData = await fetch(apiUrl).then((r) => r.json());

      const { markdown: contentMarkdown, meta } = getMarkdown(apiData);

      if (withMeta) {
        setMarkdown(getMetaMd(meta) + contentMarkdown);
      } else {
        setMarkdown(contentMarkdown);
      }
    } catch (err) {
      const error = err as Error;

      if (error.message === "Failed to construct 'URL': Invalid URL") {
        setError(new Error('enter valid URL'));
      } else {
        setError(new Error(error.message));
      }

      setMarkdown('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col mb-7">
        <Label
          htmlFor={urlInputId}
          className={clsx({
            'block text-base cursor-pointer mb-2': true,
            'cursor-not-allowed opacity-50': loading,
          })}
        >
          Enter telegra.ph page url
        </Label>
        <Input
          id={urlInputId}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-base mb-5 max-sm:h-11 max-sm:mb-6"
          autoComplete="off"
          disabled={loading}
          autoFocus
        />
        <div className="flex items-center self-end mb-5 max-sm:mb-6">
          <Checkbox
            id={checkboxId}
            checked={withMeta}
            onCheckedChange={(v) => setWithMeta(v as boolean)}
            className="mr-2"
            disabled={loading}
          />
          <Label
            htmlFor={checkboxId}
            className={clsx({
              'font-normal cursor-pointer': true,
              'cursor-not-allowed opacity-50': loading,
            })}
          >
            Generate markdown with page meta (in YAML format)
          </Label>
        </div>
        <Button className="text-base self-end max-sm:h-11" disabled={loading}>
          Generate markdown
        </Button>
      </form>
      {loading && <Loader2 className="w-8 h-8 animate-spin mx-auto" />}
      {error && (
        <div className="text-destructive font-semibold">
          Error: {error.message}
        </div>
      )}
    </>
  );
};
