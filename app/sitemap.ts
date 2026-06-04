import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jazguide.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/add-company`, lastModified: new Date(), priority: 0.7 },
  ]

  const { data: companies } = await supabase
    .from('companies')
    .select('id, created_at')
    .eq('status', 'approved')

  const companyPages = (companies || []).map((c) => ({
    url: `${baseUrl}/companies/${c.id}`,
    lastModified: new Date(c.created_at),
    priority: 0.8,
  }))

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, created_at')

  const jobPages = (jobs || []).map((j) => ({
    url: `${baseUrl}/jobs/${j.id}`,
    lastModified: new Date(j.created_at),
    priority: 0.8,
  }))

  return [...staticPages, ...companyPages, ...jobPages]
}