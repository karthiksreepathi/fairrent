import Link from "next/link";
import { FileText } from "lucide-react";
import type { BlogPost } from "@/data/blog-posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] overflow-hidden transition-all duration-300 hover:border-[#c2410c]/20 hover:shadow-md">
        {/* Image Placeholder with Gradient */}
        <div className="h-48 bg-gradient-to-br from-[#c2410c]/10 to-[#0d9488]/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
          <FileText className="w-12 h-12 text-[#c2410c]/30 relative z-10" />
        </div>

        <div className="p-6">
          {/* Category & Read Time */}
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#f5f3ef] text-[#c2410c] text-xs font-semibold rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-[#a8a29e]">
              {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#1c1917] group-hover:text-[#c2410c] transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#57534e] leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-[#e2ddd5]">
            <span className="text-[#c2410c]">
              {new Date(post.publishDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[#c2410c] font-medium group-hover:translate-x-0.5 transition-transform">
              Read more &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
