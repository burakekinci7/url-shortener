import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { createShortUrl, extractErrorMessage } from "../../lib/api";
import type { ShortUrl } from "../../types";

interface Props {
  onCreated?: (url: ShortUrl) => void;
  compact?: boolean;
}

function isLikelyUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlShortenerForm({ onCreated, compact = false }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortUrl | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL to shorten.");
      return;
    }
    if (!isLikelyUrl(trimmed)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const created = await createShortUrl({ originalUrl: trimmed, expiresAt: null });
      setResult(created);
      setUrl("");
      onCreated?.(created);
      toast.success("Short link created");
    } catch (err) {
      const msg = extractErrorMessage(err, "Could not shorten URL");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            name="originalUrl"
            type="text"
            inputMode="url"
            placeholder="https://example.com/your-long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={error}
            disabled={loading}
            className={compact ? "" : "py-3 text-base"}
          />
        </div>
        <Button
          type="submit"
          loading={loading}
          size={compact ? "md" : "lg"}
          className={compact ? "" : "sm:px-8"}
        >
          Shorten
        </Button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-gray-500">Your short link</p>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-base font-medium text-indigo-700 hover:text-indigo-800"
              >
                {result.shortUrl}
              </a>
              <p className="mt-1 truncate text-xs text-gray-500">{result.originalUrl}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(result.shortUrl)}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="secondary" size="sm">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
