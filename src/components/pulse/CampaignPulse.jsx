import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/pulse.css';

/*
  Campaign Pulse v27 — four container/hierarchy treatments, switchable
  from the demo pill (STYLE A–D) alongside the six day-states:
    A Panel  — status lead + "Today at Benable" heading + merged card (feed | pace)
    B Banner — everything in one warm tinted digest container
    C Rail   — pulse in a slim right rail beside Invited Creators
    D Open   — borderless timeline on the page bg, pace as stat chips
  Research grounding: ../../../brand-dashboard-liveliness/research-brief.md
*/

const DAYS = [
  {
    day: 1,
    scrubLabel: 'Day 1 · Launch',
    headline: 'Your campaign is live — we’re out scouting your creators. 🔍',
    updated: 'Updated 20 minutes ago',
    feed: [
      { time: '4:41 pm', emoji: '📈', tone: 'win', text: 'Your shortlist is looking strong — final vetting happens tomorrow morning.' },
      { time: '1:15 pm', emoji: '💌', tone: 'busy', text: 'Reached out to our top picks to check availability and product fit.' },
      { time: '10:32 am', emoji: '👀', tone: 'busy', text: 'Katie hand-reviewed 31 profiles — 12 made the shortlist.' },
      { time: '9:04 am', emoji: '🤖', tone: 'busy', text: 'Scanned 214 creator profiles against your brief.' },
    ],
    race: { you: 8, them: 2, caption: 'Day 1 — most brands are still writing the brief. Yours is already in the field.', chip: '🚀 Ahead before day one is over' },
    forYou: [],
    upNext: [
      { emoji: '✨', text: 'Your creator shortlist lands for review', eta: 'in ~2 days' },
      { emoji: '💌', text: 'Invites go out the moment you approve', eta: 'right after your review' },
    ],
  },
  {
    day: 3,
    scrubLabel: 'Day 3 · Creators ready',
    headline: '6 creators are ready for your review! 🎉',
    updated: 'Updated 1 hour ago',
    feed: [
      { time: '2:20 pm', emoji: '🎁', tone: 'win', text: 'Your creator lineup is polished and waiting in the review tab.' },
      { time: '11:48 am', emoji: '🔬', tone: 'busy', text: 'Benny ran engagement checks on all 6 — everyone is above 4.2%.' },
      { time: '10:05 am', emoji: '🧪', tone: 'busy', text: 'Matched each creator to the products they’ll love most.' },
      { time: '9:12 am', emoji: '☕️', tone: 'busy', text: 'Katie did a final pass over the shortlist with fresh eyes.' },
    ],
    race: { you: 18, them: 5, caption: 'Day 3 and your shortlist is ready. <strong>Industry average: day 12.</strong>', chip: '🚀 Shortlist 9 days ahead of average' },
    forYou: [
      { emoji: '🎉', text: '6 creators are waiting for your review', cta: 'Review creators' },
    ],
    upNext: [
      { emoji: '💌', text: 'Invites out within hours of your approvals', eta: 'same day' },
      { emoji: '📦', text: 'Product picks + shipping as creators accept', eta: 'this week' },
    ],
  },
  {
    day: 9,
    scrubLabel: 'Day 9 · Cooking',
    headline: 'Nothing you need to do — your campaign is cooking nicely. 🍳',
    updated: 'Updated 2 hours ago',
    feed: [
      { time: '4:10 pm', emoji: '📦', tone: 'busy', text: 'Maya’s package cleared the Memphis hub — arriving Thursday.' },
      { time: '1:36 pm', emoji: '🧴', tone: 'win', text: 'Nia picked her hero product. “I’ve wanted to try this one forever” — good sign.' },
      { time: '11:20 am', emoji: '🔁', tone: 'busy', text: 'Lena had to bow out (family thing) — we’re already vetting 3 stand-ins. Nothing to do yet.' },
      { time: '9:15 am', emoji: '👋', tone: 'busy', text: 'Nudged 2 creators to confirm their delivery windows.' },
    ],
    race: { you: 34, them: 12, caption: 'Day 9 — a typical agency would <strong>still be negotiating contracts</strong>. Your products are already in the mail.', chip: '🚀 2.8× faster than a typical campaign' },
    forYou: [],
    upNext: [
      { emoji: '📦', text: 'All packages delivered', eta: 'by Thursday' },
      { emoji: '🔁', text: 'Replacement picks for Lena', eta: 'within 48h — we’ll ping you' },
      { emoji: '🎬', text: 'First creators start filming', eta: 'this weekend' },
    ],
  },
  {
    day: 16,
    scrubLabel: 'Day 16 · First content',
    headline: 'The first content is in — and it’s gorgeous. 🎬',
    updated: 'Updated 34 minutes ago',
    feed: [
      { time: '3:55 pm', emoji: '✨', tone: 'win', text: 'Jade submitted a 34s reel — Katie’s note: “the light in this one is unreal”.' },
      { time: '2:02 pm', emoji: '🎬', tone: 'win', text: 'Priya submitted her before/after story set.' },
      { time: '12:40 pm', emoji: '🗓', tone: 'busy', text: 'Maya scheduled her shoot for Saturday — fingers crossed on weather.' },
      { time: '10:15 am', emoji: '🤳', tone: 'busy', text: 'Nia posted a behind-the-scenes teaser to her stories.' },
    ],
    race: { you: 58, them: 24, caption: 'First content on day 16. <strong>Industry average: day 41.</strong>', chip: '🚀 First content 25 days early' },
    forYou: [
      { emoji: '🎬', text: '2 new videos are ready for a look', cta: 'Watch the first cuts' },
    ],
    upNext: [
      { emoji: '📣', text: 'First posts go live once you approve', eta: '~2 days after approval' },
      { emoji: '🎥', text: '3 more creators film this week', eta: 'submissions by Sunday' },
    ],
  },
  {
    day: 22,
    scrubLabel: 'Day 22 · Going live',
    headline: '3 posts are live and your links are out in the wild! 📣',
    updated: 'Updated 12 minutes ago',
    feed: [
      { time: '3:12 pm', emoji: '📈', tone: 'win', text: 'Nia’s reel passed 12.4k views — her best-performing post this month.' },
      { time: '1:05 pm', emoji: '📣', tone: 'win', text: 'Sofia’s TikTok went live — we pinged you the second it did.' },
      { time: '11:30 am', emoji: '🔗', tone: 'busy', text: 'Jade added her link to bio + pinned comment.' },
      { time: '9:45 am', emoji: '🛰', tone: 'busy', text: 'We’re watching tags on IG & TikTok so nothing slips by.' },
    ],
    race: { you: 80, them: 31, caption: 'Day 22 — you’re moving about <strong>2.6× faster</strong> than a typical campaign.', chip: '🚀 2.6× faster than a typical campaign' },
    forYou: [
      { emoji: '💬', text: 'Nia’s reel is taking off — a brand comment goes a long way', cta: 'Open the post' },
    ],
    upNext: [
      { emoji: '⏰', text: 'Maya’s post goes live', eta: 'Thursday' },
      { emoji: '🏁', text: 'Campaign wrap + your content library', eta: 'in 8 days' },
    ],
  },
  {
    day: 30,
    scrubLabel: 'Day 30 · Wrap',
    headline: 'That’s a wrap — 6 creators, 9 posts, 47k views. 🥳',
    updated: 'Updated just now',
    feed: [
      { time: '4:30 pm', emoji: '🏆', tone: 'win', text: 'Top post: Nia’s reel — 18.9k views, 6.1% engagement.' },
      { time: '2:15 pm', emoji: '🔗', tone: 'win', text: 'Your links were tapped 1,142 times across all posts.' },
      { time: '11:00 am', emoji: '💌', tone: 'busy', text: 'Thank-you notes sent to all 6 creators on your behalf.' },
      { time: '9:30 am', emoji: '📦', tone: 'busy', text: 'All content files collected and added to your library.' },
    ],
    race: { you: 100, them: 45, caption: 'Wrapped in 30 days. <strong>Industry average: 67 days.</strong>', chip: '🚀 Wrapped 37 days early' },
    forYou: [
      { emoji: '🥂', text: 'Your campaign wrap-up is ready', cta: 'See the wrap-up' },
      { emoji: '🔁', text: 'Loved someone? Book them for round two', cta: 'Rehire favorites' },
    ],
    upNext: [
      { emoji: '🚀', text: 'Campaign #2 — same crew or fresh faces', eta: 'whenever you’re ready' },
    ],
  },
];

const VARIANTS = [
  { key: 'A', name: 'Panel' },
  { key: 'B', name: 'Banner' },
  { key: 'D', name: 'Pulse tab' },
  { key: 'E', name: 'Rail wide' },
  { key: 'F', name: 'Rail left' },
  { key: 'H', name: 'Status band' },
];

const RAIL_VARIANTS = ['E', 'F'];
const RAIL_HOST_VARIANTS = ['E', 'F', 'H'];

// Survive remounts (the captured-HTML subtree can wipe and re-mount the block).
let persistedIdx = 2; // open on Day 9 — the "dead middle" is the thesis
let persistedVariant = 'A';

function Feed({ scene, compact }) {
  return (
    <div className={compact ? 'cp-feed cp-feed--compact' : 'cp-feed'}>
      {scene.feed.map((f, i) => (
        <div key={f.text} className={`cp-feed-item cp-feed-item--${f.tone}`} style={{ animationDelay: `${0.06 * i}s` }}>
          <div className="cp-feed-icon">{f.emoji}</div>
          <div>
            <div className="cp-feed-time">{f.time}</div>
            <div className="cp-feed-text">{f.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaceBars({ scene }) {
  return (
    <>
      <div className="cp-race-meta">
        <span>Your campaign</span>
        <span className="cp-race-day">day {scene.day}</span>
      </div>
      <div className="cp-track">
        <div className="cp-fill cp-fill--you" style={{ width: `${scene.race.you}%` }} />
      </div>
      <div className="cp-race-meta">
        <span>Industry average</span>
      </div>
      <div className="cp-track">
        <div className="cp-fill cp-fill--them" style={{ width: `${scene.race.them}%` }} />
      </div>
      <p className="cp-race-caption" dangerouslySetInnerHTML={{ __html: scene.race.caption }} />
    </>
  );
}

function PaceFooter({ scene }) {
  return (
    <div className="cp-sec-footer">
      <div className="cp-sec-footer-row">
        <span className="cp-sec-pace-text">{scene.race.chip}</span>
        <span className="cp-sec-pace-day">day {scene.day} of 30</span>
      </div>
      <div className="cp-track cp-track--mini">
        <div className="cp-fill cp-fill--you" style={{ width: `${scene.race.you}%` }} />
      </div>
    </div>
  );
}

function Lead({ scene, small }) {
  return (
    <div className={small ? 'cp-lead cp-lead--small' : 'cp-lead'}>
      <h2 className="cp-lead-headline">{scene.headline}</h2>
      <span className="cp-lead-updated">{scene.updated}</span>
    </div>
  );
}

// D: whether the injected "Pulse" tab is the open tab
let persistedPulseTab = true;

export default function CampaignPulse() {
  const [idx, setIdx] = useState(persistedIdx);
  const [variant, setVariant] = useState(
    VARIANTS.some((v) => v.key === persistedVariant) ? persistedVariant : 'D',
  );
  const [pulseOpen, setPulseOpen] = useState(persistedPulseTab);
  const [tabBarEl, setTabBarEl] = useState(null);
  const rootRef = useRef(null);
  const scene = DAYS[idx];

  useEffect(() => { persistedIdx = idx; }, [idx]);
  useEffect(() => { persistedVariant = variant; }, [variant]);
  useEffect(() => { persistedPulseTab = pulseOpen; }, [pulseOpen]);

  // D: inject a "Pulse" tab into the captured tab bar; captured tabs close it
  useEffect(() => {
    if (variant !== 'D') { setTabBarEl(null); return; }
    setPulseOpen(true);
    const wrap = rootRef.current?.parentElement;
    const column = wrap?.classList.contains('cp-host') ? wrap.parentElement : wrap;
    const bar = column?.querySelector('.workflow-dashboard-tab')?.parentElement || null;
    setTabBarEl(bar);
    const close = (e) => {
      if (e.target.closest('.workflow-dashboard-tab') && !e.target.closest('.cp-ptab')) setPulseOpen(false);
    };
    bar?.addEventListener('click', close);
    return () => bar?.removeEventListener('click', close);
  }, [variant]);

  // D: while the Pulse tab is open, hide the Dashboard tab's own content
  useEffect(() => {
    const wrap = rootRef.current?.parentElement;
    const column = wrap?.classList.contains('cp-host') ? wrap.parentElement : wrap;
    if (!column) return;
    column.classList.toggle('cp-tab-mode', variant === 'D' && pulseOpen);
    return () => column.classList.remove('cp-tab-mode');
  }, [variant, pulseOpen]);

  // Variant C turns the page's main column into a two-column grid (content | rail).
  // The pulse mounts inside a dedicated .cp-host wrapper, so the grid goes on
  // that wrapper's parent and the wrapper itself becomes the rail grid-child.
  useEffect(() => {
    const wrap = rootRef.current?.parentElement;
    const column = wrap?.classList.contains('cp-host') ? wrap.parentElement : wrap;
    if (!wrap || !column) return;
    const on = RAIL_HOST_VARIANTS.includes(variant);
    wrap.classList.toggle('cp-rail-child', on);
    column.classList.toggle('cp-rail-host', on);
    column.classList.toggle('cp-rail-host--wide', on);
    column.classList.toggle('cp-rail-host--left', variant === 'F' || variant === 'H');
    column.classList.toggle('cp-rail-host--h', variant === 'H');
    return () => {
      wrap.classList.remove('cp-rail-child');
      column.classList.remove('cp-rail-host', 'cp-rail-host--wide', 'cp-rail-host--left', 'cp-rail-host--h');
    };
  }, [variant]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, DAYS.length - 1));
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`cp-root cp-root--${variant.toLowerCase()}`} ref={rootRef}>
      {variant === 'A' && (
        <div key={`a-${scene.day}`}>
          <Lead scene={scene} />
          <div className="cp-section-head">
            <h3 className="cp-section-title">Today at Benable</h3>
            <p className="cp-section-sub">Everything we're doing on your campaign — updated live</p>
          </div>
          <div className="cp-panel">
            <div className="cp-panel-feed"><Feed scene={scene} /></div>
            <div className="cp-panel-pace">
              <div className="cp-overline">The pace · vs. typical campaign</div>
              <PaceBars scene={scene} />
            </div>
          </div>
        </div>
      )}

      {variant === 'B' && (
        <div className="cp-banner" key={`b-${scene.day}`}>
          <div className="cp-banner-top">
            <Lead scene={scene} />
            <span className="cp-chip-pace">{scene.race.chip}</span>
          </div>
          <div className="cp-banner-cols">
            <div className="cp-banner-feed">
              <div className="cp-overline">Today at Benable</div>
              <Feed scene={scene} compact />
            </div>
            <div className="cp-banner-pace">
              <div className="cp-overline">The pace</div>
              <PaceBars scene={scene} />
            </div>
          </div>
        </div>
      )}

      {RAIL_VARIANTS.includes(variant) && (
        <aside className="cp-rail cp-rail--wide" key={`${variant}-${scene.day}`}>
          <Lead scene={scene} />
          <div className="cp-overline" style={{ marginTop: 14 }}>Today at Benable</div>
          <Feed scene={scene} />
          <div className="cp-rail-divider" />
          <div className="cp-overline">The pace</div>
          <PaceBars scene={scene} />
        </aside>
      )}

      {/* D: its own "Pulse" tab in the real tab bar */}
      {variant === 'D' && tabBarEl && createPortal(
        <button
          type="button"
          className={`workflow-dashboard-tab cp-ptab ${pulseOpen ? 'active' : ''}`}
          onClick={() => setPulseOpen(true)}
        >
          Pulse<span className="cp-ptab-dot" />
        </button>,
        tabBarEl,
      )}

      {variant === 'D' && pulseOpen && (
        <div key={`d-${scene.day}`} className="cp-dtab">
          <Lead scene={scene} />
          <div className="cp-chip-row">
            <span className="cp-chip-pace">{scene.race.chip}</span>
            <span className="cp-chip-day">Day {scene.day} of 30</span>
          </div>

          {/* for you: warm invitations, never nags; green all-clear otherwise */}
          {scene.forYou.length > 0 ? (
            <div className="cp-foryou">
              <div className="cp-overline" style={{ margin: '22px 0 8px' }}>For you</div>
              <div className="cp-foryou-row">
                {scene.forYou.map((a) => (
                  <div className="cp-action-card" key={a.text}>
                    <span className="cp-action-emoji">{a.emoji}</span>
                    <span className="cp-action-text">{a.text}</span>
                    {a.cta && <button type="button" className="cp-action-cta">{a.cta}</button>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="cp-nothing">✅ Nothing needed from you today — we’re on it.</div>
          )}

          <div className="cp-dtab-grid">
            <div>
              <div className="cp-overline" style={{ margin: '0 0 14px' }}>The story so far</div>
              {[...DAYS.slice(0, idx + 1)].reverse().map((d, i) => (
                <div key={d.day} className={i === 0 ? 'cp-journal-day' : 'cp-journal-day cp-journal-day--past'}>
                  <div className="cp-journal-label"><span>{i === 0 ? `Today · Day ${d.day}` : `Day ${d.day}`}</span></div>
                  <Feed scene={d} compact={i !== 0} />
                </div>
              ))}
            </div>
            <aside>
              <div className="cp-overline" style={{ margin: '0 0 14px' }}>Up next</div>
              {scene.upNext.map((u) => (
                <div className="cp-upnext-item" key={u.text}>
                  <span className="cp-upnext-emoji">{u.emoji}</span>
                  <div>
                    <div className="cp-upnext-text">{u.text}</div>
                    {u.eta && <div className="cp-upnext-eta">{u.eta}</div>}
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      )}

      {/* H: quiet full-width status band, then two matched sections */}
      {variant === 'H' && (
        <>
          <div className="cp-band" key={`h-band-${scene.day}`}>
            <div>
              <h2 className="cp-band-headline">{scene.headline}</h2>
              <span className="cp-band-updated">{scene.updated}</span>
            </div>
            <div className="cp-band-pace">
              <span className="cp-chip-pace">{scene.race.chip}</span>
              <div className="cp-band-track">
                <div className="cp-fill cp-fill--you" style={{ width: `${scene.race.you}%` }} />
              </div>
              <span className="cp-band-day">day {scene.day} of 30</span>
            </div>
          </div>
          <div className="cp-section-head cp-h-head" key="h-head">
            <h3 className="cp-section-title">Today at Benable</h3>
            <p className="cp-section-sub">Everything we're doing on your campaign — updated live</p>
          </div>
          <section className="cp-sec-card" key={`h-card-${scene.day}`}>
            <Feed scene={scene} />
          </section>
        </>
      )}

      {/* demo scrubber — presenter control, not product UI */}
      <nav className="cp-scrubber" aria-label="Demo controls">
        <span className="cp-scrub-tag">PULSE DEMO</span>
        <button type="button" className="cp-scrub-arrow" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>←</button>
        {DAYS.map((d, i) => (
          <button
            type="button"
            key={d.day}
            className={`cp-scrub-day ${i === idx ? 'cp-scrub-day--active' : ''}`}
            onClick={() => setIdx(i)}
          >
            {i === idx ? d.scrubLabel : `D${d.day}`}
          </button>
        ))}
        <button type="button" className="cp-scrub-arrow" disabled={idx === DAYS.length - 1} onClick={() => setIdx(idx + 1)}>→</button>
        <span className="cp-scrub-sep" />
        <span className="cp-scrub-tag">STYLE</span>
        {VARIANTS.map((v) => (
          <button
            type="button"
            key={v.key}
            className={`cp-scrub-day ${variant === v.key ? 'cp-scrub-day--active' : ''}`}
            title={v.name}
            onClick={() => setVariant(v.key)}
          >
            {variant === v.key ? `${v.key} · ${v.name}` : v.key}
          </button>
        ))}
      </nav>
    </div>
  );
}
