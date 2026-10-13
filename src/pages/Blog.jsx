import CTA from '../components/CTA'
import { posts, BLOG_INDEX_META } from './cms/data'
import { Author, IndexHero, useCmsMeta } from './cms/shared'

// Footer newsletter form (CLONE_SPEC §10) at max-width 300 (spec §1.1)
function NewsletterForm() {
  return (
    <form
      className="flex h-12 w-full max-w-[300px] items-center gap-2 rounded-full bg-white py-[6px] pl-4 pr-[6px]"
      style={{ boxShadow: 'inset 0 0 0 1px rgb(226,226,226)' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex h-7 min-w-0 flex-1 items-center overflow-hidden rounded-[10px] p-1">
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          aria-label="Email address"
          className="ft-input h-5 w-full min-w-0 border-0 bg-transparent p-0 font-inter text-[14px] leading-5 text-[rgb(68,66,62)] outline-none"
        />
      </div>
      <button type="submit" className="flex h-9 w-[100px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-ink px-4 py-2 text-[13px] font-medium leading-4 text-white">
        Subscribe
      </button>
    </form>
  )
}

// §1.3 blog card — whole card is one link
function BlogCard({ post }) {
  return (
    <a href={`/blog/${post.slug}`} className="cms-card flex flex-col gap-5 no-underline">
      <div className="cms-ring16 aspect-video w-full">
        <img src={post.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-[#666]">{post.date}</p>
          <h2 className="cms-card-title cms-headline cms-ss m-0 text-[20px] leading-7">{post.title}</h2>
        </div>
        <Author author={post.author} />
      </div>
    </a>
  )
}

export default function Blog() {
  useCmsMeta(BLOG_INDEX_META.title, BLOG_INDEX_META.description)
  return (
    <main className="bg-white">
      <IndexHero
        eyebrow="Blog"
        title="Stay curious."
        lead="Follow what we're building, what we're learning, and where AI-powered decision making is heading."
      >
        <NewsletterForm />
      </IndexHero>
      <section className="w-full px-5">
        <div className="cms-grid">
          {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
        </div>
      </section>
      <CTA />
    </main>
  )
}
