// §2.3 Trust image cards. The WebGL wave shader is replaced by its fallback PNG (static); card 2's
// shader container is rotate(180deg).
const SHADER_FALLBACK = '/assets/5V8gmDlH6VshGL3t6Yw2BakE8M.png'

const CARDS = [
  {
    title: 'Answers you can rely on',
    // Placeholder prose of matching length (spec records structure only: 2 sentences, ~30 words, 3 lines @1440).
    body: 'Placeholder text standing in for the live copy about traceable answers and how uncertain results are handled. A second neutral sentence keeps the length, line count and layout of the original paragraph.',
    overlay: 'linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,.9) 69.43%, #000 100%)',
    rotate: false,
  },
  {
    title: 'Data that stays yours',
    body: 'Your documents and the data extracted from them are stored on servers in Germany, built to GDPR requirements.',
    overlay: 'linear-gradient(rgba(255,255,255,0) 0%, rgba(0,0,0,.9) 69.43%, #000 100%)',
    rotate: true,
  },
]

export default function TrustCards() {
  return (
    <section className="mx-auto box-border w-full max-w-container px-5 pb-[88px] pt-6">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-4 md:grid-cols-2">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="relative h-[435px] overflow-clip rounded-[16px] bg-white"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}
          >
            <div className={`absolute inset-0 ${c.rotate ? 'rotate-180' : ''}`} aria-hidden="true">
              <img src={SHADER_FALLBACK} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[249px]" style={{ background: c.overlay }} aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 md:p-10">
              <h3 className="font-headline m-0 text-[20px] font-normal leading-7 text-white">{c.title}</h3>
              <p className="m-0 text-[14px] leading-5 tracking-[-0.084px] text-track">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
