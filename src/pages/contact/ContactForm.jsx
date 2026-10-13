import { useRef, useState } from 'react'
import PhoneField from './PhoneField'

// §3.1 right card. The form never submits anywhere: submit is prevented and nothing happens
// (success/error states were not measured on the live site).
const CALENDLY = 'https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold'

// Framer form field: tinted bg + #2222221F ring; focus-within draws an inset 1px #54524E border. No transitions.
const FIELD =
  "relative rounded-[10px] bg-[#FBF9F60D] shadow-[0_0_0_1px_#2222221F] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:border after:border-solid after:border-transparent after:content-[''] focus-within:after:border-[#54524E]"
const INPUT = 'box-border block w-full border-0 bg-transparent p-3 text-[14px] font-normal leading-[1.2em] tracking-normal text-ink outline-none placeholder:text-[#616161]'
const LABEL = 'text-[14px] font-medium leading-5 tracking-[-0.084px] text-[#2C2C2C]'
const CHECK_GLYPH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8 L6.5 10.5 L11.5 5.5' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat`

function Field({ label, children }) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  )
}

export default function ContactForm() {
  const form = useRef(null)
  const [valid, setValid] = useState(false)
  const check = () => setValid(form.current.checkValidity())

  return (
    <div className="box-border flex flex-col gap-6 rounded-[16px] bg-white p-8 md:min-w-0 md:flex-[1_0_0px]" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}>
      <h2 className="font-headline m-0 text-[26px] font-normal leading-[30px] text-ink md:text-[28px] md:leading-8 lg:text-[32px] lg:leading-10">Send us a message</h2>
      <form ref={form} className="flex flex-col gap-6" onInput={check} onChange={check} onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-6">
          <Field label="Name">
            <div className={FIELD}><input type="text" name="Name" placeholder="Your name" required className={INPUT} /></div>
          </Field>
          <Field label="Work Mail">
            <div className={FIELD}><input type="email" name="Email" placeholder="you@company.com" required className={INPUT} /></div>
          </Field>
        </div>
        <Field label="Company Name">
          <div className={FIELD}><input type="text" name="CompanyName" placeholder="Company" required className={INPUT} /></div>
        </Field>
        <div className="flex flex-col gap-2">
          <span className={LABEL}>Phone</span>
          <PhoneField fieldClass={FIELD} />
        </div>
        <Field label="Your Message">
          <div className={FIELD}>
            <textarea name="Message" placeholder="Enter a message" required className={`${INPUT} h-[172px] resize-y`} />
          </div>
        </Field>
        <label className="flex items-start gap-[10px]">
          <span className="relative block size-4 shrink-0">
            <input
              type="checkbox"
              name="Consent"
              required
              className="peer m-0 block size-4 cursor-pointer appearance-none rounded-[4px] bg-white shadow-[0_0_0_1px_#00000014] outline-none checked:bg-[#FAF9F8]"
            />
            <span className="pointer-events-none absolute inset-0 opacity-0 peer-checked:opacity-100" style={{ backgroundColor: '#44423E', WebkitMask: CHECK_GLYPH, mask: CHECK_GLYPH }} />
            <span className="pointer-events-none absolute inset-0 rounded-[4px] border border-solid border-transparent peer-focus:border-[#09f]" />
          </span>
          <span className="text-[12px] leading-4 text-grey-600">I agree that Primefold may process this enquiry in accordance with its Privacy Notice.</span>
        </label>
        <button
          type="submit"
          disabled={!valid}
          className="box-border flex h-10 w-full cursor-pointer items-center justify-center rounded-[100px] border-0 bg-ink p-3 text-[14px] leading-[19.6px] text-white transition-opacity duration-200 ease-[cubic-bezier(.44,0,.56,1)] enabled:hover:opacity-50 disabled:cursor-default disabled:opacity-50"
          style={{ fontFamily: '"Stack Sans Text", "Stack Sans Text Placeholder", sans-serif', fontWeight: 400 }}
        >
          Submit
        </button>
      </form>
      <p className="m-0 text-center text-[12px] font-medium leading-4">
        <span className="text-grey-600">Prefer a call? </span>
        <a href={CALENDLY} target="_blank" rel="noopener" className="text-ink-2 no-underline">Book 20 minutes</a>
      </p>
    </div>
  )
}
