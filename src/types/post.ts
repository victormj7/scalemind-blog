export type Category = 'MicroSaaS' | 'Automação' | 'Finanças' | 'Renda Online'

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string        // ISO 8601: "2024-07-15" — nunca futuro
  updatedAt?: string  // opcional: data de atualização
  category: Category
  image: string
  readingTime: string
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
