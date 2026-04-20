export type Category = 'MicroSaaS' | 'Automação' | 'Finanças' | 'Renda Online'

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string        // ISO 8601: "2024-07-15"
  category: Category
  image: string       // URL ou caminho em /public
  readingTime: string // ex: "8 min de leitura"
  featured?: boolean
}

export interface Post extends PostMeta {
  content: string     // HTML gerado a partir do MDX/MD
}

// Usado para integração futura com CMS/API — basta trocar a fonte em posts.ts
export interface PostsRepository {
  getAll(): Promise<PostMeta[]>
  getBySlug(slug: string): Promise<Post | null>
  getByCategory(category: Category): Promise<PostMeta[]>
}
