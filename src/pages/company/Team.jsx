import Eyebrow from '../../components/shared/Eyebrow'
import './team.css'

const A = '/assets/pages/company/'

// spec A3 — CMS order
const MEMBERS = [
  ['Vlatko', 'Head of GTM', '3zbWLtUigaimRPvHa17qjHrSo.jpg'],
  ['Sascha', 'CTO', 'A7Zab1F86r1LurCg6qIYp3yuDfk.png'],
  ['Karin', 'Head of Operations', 'RRRMo8VEDPhgXGP0eDSa9hfF79Y.jpg'],
  ['Leon', 'Co-CEO', '6h8EguiMMITYb9BMDmhVQXkfK8s.png'],
  ['Kolja', 'Co-CEO', 'h63PIXKy2FbcuS3xvlLNCOqdPJE.png'],
  ['Sören', 'Design Engineer', '5NjsgQTPDgQ22BuwjoC7zeK6Wh4.png'],
  ['Bonnie', 'Head of R&D', 'xq7luLsfgY19ghf6ZBb5IJARos.png'],
  ['Sina', 'Head of CX', 'zhGcLxBS5x03ufEDXGoKd3glfLA.jpg'],
  ['Dominik', 'Fullstack Engineer', 'HLubUcaF5PkYUUdao5a1rbVrFlQ.jpg'],
  ['Hasnain', 'Fullstack Engineer', 'uOQue07cY4YYexGJZLdTuFYFo.jpg'],
  ['Oxana', 'Quality Assurance Specialist', 'b4NgR6Stsk2NnqPDsiywkcp0qk.jpg'],
  ['Sarah', 'Lead Engineer', '5XYAbfBnho3Vgmn3T7dy4CGFk0.png'],
]

function Card({ name, role, img, hidden }) {
  return (
    <li className="mr-5 flex shrink-0 flex-col gap-3" aria-hidden={hidden || undefined}>
      <div className="h-[200px] w-[200px] overflow-clip rounded-xl md:h-[240px] md:w-[240px]" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.08)' }}>
        <img src={`${A}${img}`} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-col gap-1 text-[14px] font-medium leading-5 tracking-[-0.084px]">
        <p className="m-0 text-black">{name}</p>
        <p className="m-0 text-grey-550">{role}</p>
      </div>
    </li>
  )
}

export default function Team() {
  return (
    <section className="flex w-full flex-col items-center gap-8 bg-white pb-[88px] md:gap-14">
      <div className="w-full max-w-[1320px] px-5 pt-20 md:pt-[88px]">
        <div className="flex max-w-[620px] flex-col gap-4">
          <Eyebrow>Team</Eyebrow>
          <h2 className="t-h2 m-0">Who you’ll be working with.</h2>
        </div>
      </div>
      <div className="w-full max-w-[1320px] px-5">
        {/* Framer Ticker: 40px/s leftward, gap 20 (as margin so -50% is exactly one copy), no hover slow-down, no edge mask */}
        <ul className="pf-team-ticker m-0 flex w-max list-none p-0">
          {MEMBERS.map(([n, r, i]) => <Card key={n} name={n} role={r} img={i} />)}
          {MEMBERS.map(([n, r, i]) => <Card key={`${n}-dup`} name={n} role={r} img={i} hidden />)}
        </ul>
      </div>
    </section>
  )
}
