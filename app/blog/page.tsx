import { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Renter Blog | Guides, Tips & Tenant Rights",
  description: "Expert guides on rent negotiation, tenant rights, and making smarter housing decisions. Data-driven advice for renters.",
  alternates: { canonical: "https://fairrent.app/blog" },
};

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] mb-4">
              Renter Resources & <span className="text-[#c2410c] font-bold">Guides</span>
            </h1>
            <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
              Data-driven advice on rent negotiation, tenant rights, and making smarter housing decisions.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <span className="px-4 py-2 bg-[#c2410c] text-white text-sm font-medium rounded-full">
              All Posts
            </span>
            {categories.map((cat) => (
              <span key={cat} className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-[#e2ddd5] text-[#57534e] text-sm font-medium rounded-full border border-[#e2ddd5] hover:border-[#c2410c]/30 cursor-pointer transition-colors">
                {cat}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
