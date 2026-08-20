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
  categoryBadge
}`;

export const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(order asc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  thumbnail,
  summary,
  caseStudyImage{
    ...,
    alt
  },
  url,
  publishedAt,
  order
}`;
