import { PortableText, type SanityDocument } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import Link from "next/link";
const BLOG_QUERY = `*[_type == "blog" && slug.current == $slug][0]`;
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
const options = { next: { revalidate: 30 } };
export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const blog = await client.fetch<SanityDocument>(BLOG_QUERY, await params, options);
  const blogImageUrl = blog.image1
    ? urlFor(blog.image1)?.width(550).height(310).url()
    : null;
const blogImageUrl2 = blog.image2
    ? urlFor(blog.image2)?.width(550).height(310).url()
    : null;
  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/blog" className="hover:underline">
        ← Back to blogs
      </Link>
      {blogImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blogImageUrl}
          alt={blog.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      {blogImageUrl2 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blogImageUrl2}
          alt={blog.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{blog.title}</h1> 
      <div className="prose">
        <p>Published: {new Date(blog.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(blog.body) && <PortableText value={blog.body} />}
      </div>
    </main>
  );
}
