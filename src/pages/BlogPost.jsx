import { useParams } from 'react-router-dom'
import CTA from '../components/CTA'
import NotFound from './NotFound'
import { posts, POST_DESCRIPTION } from './cms/data'
import { Author, useCmsMeta } from './cms/shared'
import RichText from './cms/RichText'

// §3 blog post template
function Post({ post }) {
  useCmsMeta(post.docTitle, POST_DESCRIPTION)
  return (
    <main className="bg-white">
      <section className="mx-auto flex max-w-[840px] flex-col items-center gap-[60px] px-5 pt-[156px]">
        <header className="flex w-full flex-col gap-6">
          <h1 className="cms-title-48 cms-headline cms-ff-full text-ink">{post.h1}</h1>
          <div className="h-px w-full bg-[rgb(235,235,235)]" />
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-end">
            <div className="md:min-w-0 md:flex-1">
              <Author author={post.author} />
            </div>
            <time className="text-[14px] leading-5 tracking-[-0.084px] text-[#666] md:text-right">
              Last updated: {post.lastUpdated}
            </time>
          </div>
        </header>
        <div className="cms-ring16 aspect-video w-full">
          <img src={post.banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <RichText blocks={post.blocks} />
      </section>
      <CTA />
    </main>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  return post ? <Post key={post.slug} post={post} /> : <NotFound />
}
