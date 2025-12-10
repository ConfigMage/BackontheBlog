# BackontheBlog

A code snippet sharing webapp with a Terminal Minimal design, built for deployment on Vercel with Neon PostgreSQL.

## Features

- Password-protected access
- Blog-style posts with markdown support
- Syntax-highlighted code blocks (optimized for PowerShell, Batch, JSON, YAML, XML)
- Reply system with markdown support
- Author identity selector (ConfigMage / DarkForestMushroom)
- Search functionality
- Dark terminal-inspired theme

## Tech Stack

- Next.js 14+ with App Router
- Tailwind CSS
- Neon PostgreSQL (@neondatabase/serverless)
- react-markdown with rehype-highlight for syntax highlighting

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ConfigMage/BackontheBlog.git
   cd BackontheBlog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example and configure:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `SITE_PASSWORD`: Password for site access (default: `pubg`)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Initialize the database by visiting:
   ```
   http://localhost:3000/api/init
   ```

## Neon PostgreSQL Setup

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Add it to your `.env` file as `DATABASE_URL`

The connection string should look like:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ConfigMage/BackontheBlog)

### Manual Deployment

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `SITE_PASSWORD`: Your chosen site password

5. Deploy

6. After deployment, initialize the database by visiting:
   ```
   https://your-domain.vercel.app/api/init
   ```

### Vercel + Neon Integration

For the easiest setup, use Vercel's Neon integration:

1. In Vercel project settings, go to "Integrations"
2. Search for "Neon" and add the integration
3. This will automatically provision a Neon database and set `DATABASE_URL`

## Database Schema

### Posts Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | VARCHAR(255) | Post title |
| description | TEXT | Optional description |
| content | TEXT | Markdown content |
| author | VARCHAR(50) | Author name |
| created_at | TIMESTAMP | Creation timestamp |

### Replies Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| post_id | INTEGER | Foreign key to posts |
| content | TEXT | Markdown content |
| author | VARCHAR(50) | Author name |
| created_at | TIMESTAMP | Creation timestamp |

## Usage

### Creating Posts

Posts support full markdown including:
- Headers, lists, blockquotes
- Code blocks with syntax highlighting
- Tables (GitHub Flavored Markdown)

Example code block:
~~~markdown
```powershell
Get-Process | Where-Object { $_.CPU -gt 100 } | Sort-Object CPU -Descending
```
~~~

### Supported Languages

The syntax highlighter supports all common languages, with optimizations for:
- PowerShell
- Batch/CMD
- JSON
- YAML
- XML
- And many more (JavaScript, Python, Bash, etc.)

## License

MIT
