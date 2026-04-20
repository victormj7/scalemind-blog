import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind.blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/blog`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/sobre`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contato`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: 'weekly',
    priority:        0.8,
  }))

  return [...staticRoutes, ...postRoutes]
}
