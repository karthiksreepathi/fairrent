import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPostBySlug, getRecentBlogPosts } from "@/data/blog-posts";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data";
import { Shield } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://fairrent.app/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.publishDate,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRecentBlogPosts(3).filter((p) => p.slug !== post.slug).slice(0, 2);

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-[#1c1917] mt-8 mb-3">{line.replace("### ", "")}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-[#1c1917] mt-10 mb-4">{line.replace("## ", "")}</h2>;
      if (line.startsWith("- **")) {
        const parts = line.replace("- **", "").split("**");
        return (
          <li key={i} className="flex items-start gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#c2410c] rounded-full mt-2 flex-shrink-0" />
            <span className="text-[#57534e]"><strong className="text-[#1c1917]">{parts[0]}</strong>{parts[1]}</span>
          </li>
        );
      }
      if (line.startsWith("- ")) return (
        <li key={i} className="flex items-start gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-[#c2410c] rounded-full mt-2 flex-shrink-0" />
          <span className="text-[#57534e]">{line.replace("- ", "")}</span>
        </li>
      );
      if (line.trim() === "") return <div key={i} className="h-4" />;
      const boldRendered = line.split(/\*\*(.*?)\*\*/).map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="text-[#1c1917]">{part}</strong> : part
      );
      return <p key={i} className="text-[#57534e] leading-relaxed mb-3">{boldRendered}</p>;
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${post.slug}` },
            ])
          ),
        }}
      />

      <article className="bg-[#faf9f7] min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e] mb-8">
            <Link href="/" className="hover:text-[#c2410c] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#c2410c] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#1c1917] font-medium line-clamp-1">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#f5f3ef] text-[#c2410c] text-xs font-semibold rounded-full border border-[#c2410c]/30">{post.category}</span>
              <span className="text-sm text-[#a8a29e]">{post.readTime} min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-[#57534e]">{post.excerpt}</p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#e2ddd5]">
              <div className="w-10 h-10 bg-[#f5f3ef] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-[#c2410c]">FR</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1c1917]">{post.author}</div>
                <div className="text-xs text-[#a8a29e]">
                  {new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose-custom">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-[#e2ddd5]">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white shadow-sm border border-[#e2ddd5] text-[#a8a29e] text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-[#0d9488]/20 p-6 text-center">
            <h3 className="text-xl font-bold text-[#1c1917] mb-2">Ready to Check Your Rent?</h3>
            <p className="text-sm text-[#57534e] mb-4">Use our free tool to see if you are overpaying.</p>
            <Link href="/rent-checker" className="bg-[#c2410c] text-white font-semibold rounded-xl hover:bg-[#c2410c] transition-all shadow-sm hover:shadow-md px-6 py-2.5 text-sm inline-flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Check Now
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-[#1c1917] mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] hover:shadow-md hover:border-[#c2410c]/30 rounded-xl p-4 transition-all">
                    <span className="text-xs text-[#c2410c] font-medium">{rp.category}</span>
                    <h4 className="font-semibold text-[#1c1917] mt-1 line-clamp-2">{rp.title}</h4>
                    <p className="text-xs text-[#a8a29e] mt-2">{rp.readTime} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
