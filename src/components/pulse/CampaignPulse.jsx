import { useEffect, useRef, useState } from 'react';
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
  },
];

const VARIANTS = [
  { key: 'A', name: 'Panel' },
  { key: 'B', name: 'Banner' },
  { key: 'C', name: 'Rail' },
  { key: 'D', name: 'Open' },
  { key: 'E', name: 'Rail wide' },
];

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

function Lead({ scene, small }) {
  return (
    <div className={small ? 'cp-lead cp-lead--small' : 'cp-lead'}>
      <h2 className="cp-lead-headline">{scene.headline}</h2>
      <span className="cp-lead-updated">{scene.updated}</span>
    </div>
  );
}

export default function CampaignPulse() {
  const [idx, setIdx] = useState(persistedIdx);
  const [variant, setVariant] = useState(persistedVariant);
  const rootRef = useRef(null);
  const scene = DAYS[idx];

  useEffect(() => { persistedIdx = idx; }, [idx]);
  useEffect(() => { persistedVariant = variant; }, [variant]);

  // Variant C turns the page's main column into a two-column grid (content | rail).
  // The pulse mounts inside a dedicated .cp-host wrapper, so the grid goes on
  // that wrapper's parent and the wrapper itself becomes the rail grid-child.
  useEffect(() => {
    const wrap = rootRef.current?.parentElement;
    const column = wrap?.classList.contains('cp-host') ? wrap.parentElement : wrap;
    if (!wrap || !column) return;
    const on = variant === 'C' || variant === 'E';
    wrap.classList.toggle('cp-rail-child', on);
    column.classList.toggle('cp-rail-host', on);
    column.classList.toggle('cp-rail-host--wide', variant === 'E');
    return () => {
      wrap.classList.remove('cp-rail-child');
      column.classList.remove('cp-rail-host', 'cp-rail-host--wide');
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

      {(variant === 'C' || variant === 'E') && (
        <aside className={variant === 'E' ? 'cp-rail cp-rail--wide' : 'cp-rail'} key={`${variant}-${scene.day}`}>
          <Lead scene={scene} small={variant === 'C'} />
          <div className="cp-overline" style={{ marginTop: 14 }}>Today at Benable</div>
          <Feed scene={scene} compact={variant === 'C'} />
          <div className="cp-rail-divider" />
          <div className="cp-overline">The pace</div>
          <PaceBars scene={scene} />
        </aside>
      )}

      {variant === 'D' && (
        <div key={`d-${scene.day}`}>
          <Lead scene={scene} />
          <div className="cp-chip-row">
            <span className="cp-chip-pace">{scene.race.chip}</span>
            <span className="cp-chip-day">Day {scene.day} of 30</span>
          </div>
          <div className="cp-overline" style={{ margin: '20px 0 10px' }}>Today at Benable</div>
          <Feed scene={scene} />
        </div>
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
