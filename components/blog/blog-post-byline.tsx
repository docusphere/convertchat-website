/**
 * Blog post byline — author avatar + name on the left, tag pills on the right.
 * Author names in frontmatter map to avatar images in /public/authors/.
 */

const AUTHOR_AVATARS: Record<string, string> = {
  Frank: "/authors/frank.jpg",
  Carla: "/authors/carla.jpg",
  Maria: "/authors/maria.jpg",
};

function getAvatar(author: string): string {
  const firstName = author.split(" ")[0];
  return AUTHOR_AVATARS[firstName] || "/authors/carla.jpg";
}

export function BlogPostByline({ author, tags, date }: { author: string; tags: string[]; date: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      {/* Left: avatar + author + date */}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getAvatar(author)} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-700">{author}</span>
          <time className="text-xs text-neutral-400">{date}</time>
        </div>
      </div>

      {/* Right: tag pills */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
