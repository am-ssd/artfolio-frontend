export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  name,
  location,
  availability,
  email,
  telegram,
  discord,
  heroHeadline,
  heroHighlight,
  heroSubtext,
  categoryBadge,
  heroTopLeft{
    ...,
    alt
  },
  heroTopRight{
    ...,
    alt
  },
  heroBottomLeft{
    ...,
    alt
  },
  heroBottomRight{
    ...,
    alt
  },
  contactImage{
    ...,
    alt
  }
}`;

export const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(order asc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "categoryId": category._ref,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  thumbnail,
  summary,
  caseStudyImages[]{
    _key,
    ...,
    alt
  },
  caseStudyImage{
    ...,
    alt
  },
  url,
  publishedAt,
  order
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc, title asc) {
  _id,
  title,
  "slug": coalesce(slug.current, _id),
  description,
  backgroundImage{
    ...,
    alt,
    "url": asset->url
  },
  order
}`;
