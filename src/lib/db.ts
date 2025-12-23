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

export interface Attachment {
  id: number;
  post_id: number | null;
  reply_id: number | null;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
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

  await db`
    CREATE TABLE IF NOT EXISTS attachments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_type VARCHAR(100),
      file_size INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await db`
    CREATE INDEX IF NOT EXISTS idx_attachments_post_id ON attachments(post_id)
  `;

  await db`
    CREATE INDEX IF NOT EXISTS idx_attachments_reply_id ON attachments(reply_id)
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

export async function createAttachment(
  fileName: string,
  fileUrl: string,
  fileType: string,
  fileSize: number,
  postId?: number,
  replyId?: number
): Promise<Attachment> {
  const db = getSQL();
  const result = await db`
    INSERT INTO attachments (post_id, reply_id, file_name, file_url, file_type, file_size)
    VALUES (${postId ?? null}, ${replyId ?? null}, ${fileName}, ${fileUrl}, ${fileType}, ${fileSize})
    RETURNING id, post_id, reply_id, file_name, file_url, file_type, file_size, created_at::text
  `;
  const attachments = result as unknown as Attachment[];
  return attachments[0];
}

export async function getAttachmentsByPostId(postId: number): Promise<Attachment[]> {
  const db = getSQL();
  const result = await db`
    SELECT id, post_id, reply_id, file_name, file_url, file_type, file_size, created_at::text
    FROM attachments
    WHERE post_id = ${postId}
    ORDER BY created_at ASC
  `;
  return result as unknown as Attachment[];
}

export async function getAttachmentsByReplyId(replyId: number): Promise<Attachment[]> {
  const db = getSQL();
  const result = await db`
    SELECT id, post_id, reply_id, file_name, file_url, file_type, file_size, created_at::text
    FROM attachments
    WHERE reply_id = ${replyId}
    ORDER BY created_at ASC
  `;
  return result as unknown as Attachment[];
}

export async function getAttachmentsForPost(postId: number): Promise<{ postAttachments: Attachment[], replyAttachments: Map<number, Attachment[]> }> {
  const db = getSQL();

  const postAttachmentsResult = await db`
    SELECT id, post_id, reply_id, file_name, file_url, file_type, file_size, created_at::text
    FROM attachments
    WHERE post_id = ${postId} AND reply_id IS NULL
    ORDER BY created_at ASC
  `;

  const replyAttachmentsResult = await db`
    SELECT a.id, a.post_id, a.reply_id, a.file_name, a.file_url, a.file_type, a.file_size, a.created_at::text
    FROM attachments a
    JOIN replies r ON a.reply_id = r.id
    WHERE r.post_id = ${postId}
    ORDER BY a.created_at ASC
  `;

  const replyAttachments = new Map<number, Attachment[]>();
  for (const attachment of replyAttachmentsResult as unknown as Attachment[]) {
    const replyId = attachment.reply_id!;
    if (!replyAttachments.has(replyId)) {
      replyAttachments.set(replyId, []);
    }
    replyAttachments.get(replyId)!.push(attachment);
  }

  return {
    postAttachments: postAttachmentsResult as unknown as Attachment[],
    replyAttachments
  };
}
