import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
const BLOGS_QUERY = `*[
  _type == "blog"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;
const options = { next: { revalidate: 30 } };
export default async function BlogPage() {
  const blogs = await client.fetch<SanityDocument[]>(BLOGS_QUERY, {}, options);
  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Blogs</h1>
      <ul className="flex flex-col gap-y-4">
        {blogs.map((blog) => (
          <li className="hover:underline" key={blog._id}>
            <Link href={`/blog/${blog.slug.current}`}>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p>{new Date(blog.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}