import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false>;

function getSQL() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  created_at: string;
}

export interface Reply {
  id: number;
  post_id: number;
  content: string;
  author: string;
  created_at: string;
}

export async function initializeDatabase() {
  const db = getSQL();
  await db`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      author VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS replies (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      author VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await db`
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)
  `;

  await db`
    CREATE INDEX IF NOT EXISTS idx_replies_post_id ON replies(post_id)
  `;
}

export async function getPosts(search?: string): Promise<Post[]> {
  const db = getSQL();
  if (search && search.trim()) {
    const searchPattern = `%${search.trim()}%`;
    const result = await db`
      SELECT id, title, description, content, author, created_at::text
      FROM posts
      WHERE title ILIKE ${searchPattern} OR content ILIKE ${searchPattern}
      ORDER BY created_at DESC
    `;
    return result as unknown as Post[];
  }

  const result = await db`
    SELECT id, title, description, content, author, created_at::text
    FROM posts
    ORDER BY created_at DESC
  `;
  return result as unknown as Post[];
}

export async function getPost(id: number): Promise<Post | null> {
  const db = getSQL();
  const result = await db`
    SELECT id, title, description, content, author, created_at::text
    FROM posts
    WHERE id = ${id}
  `;
  const posts = result as unknown as Post[];
  return posts[0] || null;
}

export async function createPost(title: string, description: string, content: string, author: string): Promise<Post> {
  const db = getSQL();
  const result = await db`
    INSERT INTO posts (title, description, content, author)
    VALUES (${title}, ${description}, ${content}, ${author})
    RETURNING id, title, description, content, author, created_at::text
  `;
  const posts = result as unknown as Post[];
  return posts[0];
}

export async function getReplies(postId: number): Promise<Reply[]> {
  const db = getSQL();
  const result = await db`
    SELECT id, post_id, content, author, created_at::text
    FROM replies
    WHERE post_id = ${postId}
    ORDER BY created_at ASC
  `;
  return result as unknown as Reply[];
}

export async function createReply(postId: number, content: string, author: string): Promise<Reply> {
  const db = getSQL();
  const result = await db`
    INSERT INTO replies (post_id, content, author)
    VALUES (${postId}, ${content}, ${author})
    RETURNING id, post_id, content, author, created_at::text
  `;
  const replies = result as unknown as Reply[];
  return replies[0];
}
