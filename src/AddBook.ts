export class InvalidUrl extends Error {}

export function isGoogleBook(url: string): boolean {
  return url.includes("google.com/books");
}

export function extractVolumeIDFrom(url: string): string {
  const match = url.match("edition/[^/]+/([^?]*)")
  if (!match || !match[1]) throw new InvalidUrl(url)
  return match[1]
}

type GoogleBook = {
  volumeInfo: {
    title: string
    authors: string[]
    imageLinks: {
      small: string
    }
  }
}

type FrontmatterValue = string | string[]
type Frontmatter = Record<string, FrontmatterValue>

export class Book {
  static async from_google_books(id: string): Promise<Book> {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
    return this.parse_google_book(await response.json() as GoogleBook)
  }

  static parse_google_book(details: GoogleBook): Book {
    const volumeInfo = details.volumeInfo;
    return new Book({
      title: volumeInfo.title,
      authors: volumeInfo.authors,
      cover: volumeInfo.imageLinks.small.replace("http://", "https://"),
    })
  }

  title: string
  authors: string[]
  cover: string | undefined
  url: string | undefined
  constructor({ title, authors, cover, url }: { title: string } & Partial<{
    authors: string[]
    cover: string
    url: string
  }>) {
    this.title = title
    this.authors = authors || []
    this.cover = cover
    this.url = url
  }

  markdown() {
    const frontmatter: Frontmatter = { Authors: this.authors.map((author) => `[[${author}]]`) }
    if (this.cover) frontmatter["Cover"] = `![Cover](${this.cover})`
    if (this.url) frontmatter["url"] = this.url
    return new MarkdownFile({ file_name: `${this.title}.md`, frontmatter })
  }
}

export class MarkdownFile {
  file_name: string
  frontmatter: Frontmatter
  constructor({ file_name, frontmatter }: {
    file_name: string
    frontmatter: Frontmatter
  }) {
    this.file_name = file_name
    this.frontmatter = frontmatter
  }

  toString() {
    return "---\n" + Object.entries(this.frontmatter).map(
      (e) => this.frontmatterEntryString(e)
    ).join("\n") + "\n---\n"
  }

  frontmatterEntryString([key, value]: [string, FrontmatterValue]) {
    if (value instanceof Array)
      return `${key}:\n${this.frontmatterArray(value)}`
    else
      return `${key}: "${value}"`
  }

  frontmatterArray(value: string[]) {
    return value.map((v) => `  - "${v}"`).join("\n")
  }
}
