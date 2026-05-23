import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BarChart3, Copy, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { deleteUrl, extractErrorMessage } from "../../lib/api";
import type { ShortUrl } from "../../types";

interface Props {
  urls: ShortUrl[];
  onChanged: () => void;
}

function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function UrlList({ urls, onChanged }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Could not copy");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this short link? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteUrl(id);
      toast.success("Link deleted");
      onChanged();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete link"));
    } finally {
      setDeletingId(null);
    }
  }

  if (urls.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm text-gray-600">
          No links yet. Create your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Short URL</th>
              <th className="px-4 py-3 font-medium">Original</th>
              <th className="px-4 py-3 font-medium">Clicks</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {urls.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a
                    href={u.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    /{u.shortCode}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <span title={u.originalUrl}>{truncate(u.originalUrl, 50)}</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{u.clickCount}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link to={`/dashboard/stats/${u.id}`}>
                      <Button variant="ghost" size="sm" title="View stats">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Copy short URL"
                      onClick={() => handleCopy(u.shortUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete"
                      loading={deletingId === u.id}
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-gray-100 md:hidden">
        {urls.map((u) => (
          <li key={u.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <a
                  href={u.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-medium text-indigo-600"
                >
                  /{u.shortCode}
                </a>
                <p className="mt-1 truncate text-xs text-gray-500">{u.originalUrl}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {u.clickCount} clicks · {formatDate(u.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link to={`/dashboard/stats/${u.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  <BarChart3 className="h-4 w-4" /> Stats
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => handleCopy(u.shortUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                loading={deletingId === u.id}
                onClick={() => handleDelete(u.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
