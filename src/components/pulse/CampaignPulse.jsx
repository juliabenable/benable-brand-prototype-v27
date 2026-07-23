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
    katie: 'Already spotted a few gems this morning — sit tight!',
    summary: 'We scanned 214 profiles and built your shortlist 🔍',
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
    recap: {
      since: 'since this morning',
      items: [
        { emoji: '✅', bold: '214 profiles scanned', rest: ' against your brief' },
        { emoji: '✨', bold: '12 creators shortlisted', rest: ' — Katie hand-picked them' },
        { emoji: '💌', bold: 'Availability checks out', rest: ' to our top picks' },
      ],
      closer: { clear: true, text: 'Nothing needs you until your shortlist lands — about 2 days' },
    },
  },
  {
    day: 3,
    scrubLabel: 'Day 3 · Creators ready',
    headline: '6 creators are ready for your review! 🎉',
    updated: 'Updated 1 hour ago',
    katie: 'These six gave me goosebumps. Go meet them!',
    summary: 'Your shortlist arrived — 6 creators ready for review 🎉',
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
    recap: {
      since: 'since Monday',
      items: [
        { emoji: '✨', bold: '6 creators shortlisted', rest: ' — your lineup is ready' },
        { emoji: '🔬', bold: 'Engagement checks passed', rest: ' on all 6 (4.2%+)' },
        { emoji: '🧪', bold: 'Products matched', rest: ' to each creator' },
      ],
      closer: { text: '6 creators are waiting on you', cta: 'Review creators' },
    },
  },
  {
    day: 9,
    scrubLabel: 'Day 9 · Cooking',
    headline: 'Nothing you need to do — your campaign is cooking nicely. 🍳',
    updated: 'Updated 2 hours ago',
    katie: 'Boxes are flying across the country as we speak 📦',
    summary: 'Products shipped and the crew confirmed 📦',
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
    recap: {
      since: 'since Friday',
      items: [
        { emoji: '✅', bold: '5 of 6 creators confirmed', rest: ' and ready to go' },
        { emoji: '📦', bold: '4 packages shipped', rest: ' — first one already delivered' },
        { emoji: '🔁', bold: '3 stand-ins vetted', rest: ' for Lena’s replacement' },
        { emoji: '👋', bold: '2 delivery nudges sent', rest: ' — nothing needed your input' },
      ],
      closer: { clear: true, text: 'Nothing needs you until Thursday — all packages land' },
    },
  },
  {
    day: 16,
    scrubLabel: 'Day 16 · First content',
    headline: 'The first content is in — and it’s gorgeous. 🎬',
    updated: 'Updated 34 minutes ago',
    katie: 'Jade’s beach reel?? I gasped. Go watch it.',
    summary: 'First content came in — and it’s gorgeous 🎬',
    feed: [
      { time: '3:55 pm', emoji: '✨', tone: 'win', text: 'Jade submitted a 34s reel — Katie’s note: “the light in this one is unreal”.', thumb: 'linear-gradient(135deg,#f5a041,#f5658c)' },
      { time: '2:02 pm', emoji: '🎬', tone: 'win', text: 'Priya submitted her before/after story set.', thumb: 'linear-gradient(135deg,#41a7f5,#7cd6ff)' },
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
    recap: {
      since: 'since Sunday',
      items: [
        { emoji: '🎬', bold: '2 videos submitted', rest: ' — Jade’s reel is a stunner' },
        { emoji: '📬', bold: 'All products delivered', rest: ' across the crew' },
        { emoji: '🗓', bold: '3 shoots scheduled', rest: ' for this week' },
      ],
      closer: { text: '2 new videos are ready for a look', cta: 'Watch the first cuts' },
    },
  },
  {
    day: 22,
    scrubLabel: 'Day 22 · Going live',
    headline: '3 posts are live and your links are out in the wild! 📣',
    updated: 'Updated 12 minutes ago',
    katie: 'Nia’s reel is taking off — 12.4k views and climbing 👀',
    summary: 'Posts went live and links hit the wild 📣',
    feed: [
      { time: '3:12 pm', emoji: '📈', tone: 'win', text: 'Nia’s reel passed 12.4k views — her best-performing post this month.', thumb: 'linear-gradient(135deg,#7a5cfa,#b48cff)' },
      { time: '1:05 pm', emoji: '📣', tone: 'win', text: 'Sofia’s TikTok went live — we pinged you the second it did.', thumb: 'linear-gradient(135deg,#2e9e6b,#7fd8a8)' },
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
    recap: {
      since: 'since Monday',
      items: [
        { emoji: '📣', bold: '3 posts went live', rest: ' on IG & TikTok' },
        { emoji: '👀', bold: '18.2k views', rest: ' and climbing' },
        { emoji: '🔗', bold: 'Links shared by all 3', rest: ' — bio + pinned comments' },
      ],
      closer: { text: 'Nia’s reel is taking off', cta: 'Open the post' },
    },
  },
  {
    day: 30,
    scrubLabel: 'Day 30 · Wrap',
    headline: 'That’s a wrap — 6 creators, 9 posts, 47k views. 🥳',
    updated: 'Updated just now',
    katie: 'This one was special. Ready to run it back?',
    summary: 'That’s a wrap 🥳',
    feed: [
      { time: '4:30 pm', emoji: '🏆', tone: 'win', text: 'Top post: Nia’s reel — 18.9k views, 6.1% engagement.', thumb: 'linear-gradient(135deg,#ffd479,#ff9d6c)' },
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
    recap: {
      since: 'since last week',
      items: [
        { emoji: '🏆', bold: 'Top post: 18.9k views', rest: ' — Nia’s reel' },
        { emoji: '🔗', bold: '1,142 link taps', rest: ' across all posts' },
        { emoji: '💌', bold: 'Thank-yous sent', rest: ' to all 6 creators' },
        { emoji: '📦', bold: '9 content files', rest: ' added to your library' },
      ],
      closer: { text: 'Your wrap-up is ready', cta: 'See the wrap-up' },
    },
  },
];

/* O · Crew live: per-creator stage + live status. Status types follow the
   live-status study rules: shimmer = bounded machine work happening now;
   katie = human presence, never a spinner; heartbeat = monitoring w/ recency;
   facts = dated truths while waiting on creators; static = settled. */
const STAGE_LABELS = ['Invited', 'Confirmed', 'Product', 'Filming', 'Submitted', 'Live'];

const HUES = {
  Maya: 'linear-gradient(135deg,#ff9d6c,#f5658c)',
  Nia: 'linear-gradient(135deg,#7a5cfa,#b48cff)',
  Sofia: 'linear-gradient(135deg,#2e9e6b,#7fd8a8)',
  Jade: 'linear-gradient(135deg,#f5a041,#ffd479)',
  Priya: 'linear-gradient(135deg,#41a7f5,#7cd6ff)',
  Amara: 'linear-gradient(135deg,#e0589a,#ff9ec6)',
};

const CREW = {
  1: [
    { mystery: true, name: 'Casting…', stage: 0, status: { type: 'shimmer', counter: 1204, phrases: ['Scanning creators…', 'Checking aesthetic fit…', 'Reading engagement quality…', 'Matching to your brief…'] } },
    { mystery: true, name: 'Casting…', stage: 0, status: { type: 'shimmer', counter: 862, phrases: ['Scanning skincare creators…', 'Filtering by audience…', 'Shortlisting…'] } },
    { mystery: true, name: 'Casting…', stage: 0, status: { type: 'shimmer', counter: 449, phrases: ['Studying your brief…', 'Browsing look-alikes…', 'Scoring matches…'] } },
  ],
  3: [
    { name: 'Maya', handle: '@maya.skin', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
    { name: 'Nia', handle: '@niaglow', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
    { name: 'Sofia', handle: '@sofia.films', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
    { name: 'Jade', handle: '@jadebythesea', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
    { name: 'Priya', handle: '@priyacreates', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
    { name: 'Lena', handle: '@lena.lately', stage: 0, status: { type: 'static', phrases: ['Ready for your review ✨'] } },
  ],
  9: [
    { name: 'Maya', handle: '@maya.skin', stage: 2, status: { type: 'facts', phrases: ['📦 Cleared the Memphis hub', 'Arriving Thursday', 'Tracking checked 12 min ago'] } },
    { name: 'Nia', handle: '@niaglow', stage: 2, status: { type: 'facts', phrases: ['🧴 Picked SPF 50 Tinted', 'Shipping label on its way'] } },
    { name: 'Sofia', handle: '@sofia.films', stage: 1, status: { type: 'static', phrases: ['✅ Confirmed — shipping next'] } },
    { name: 'Jade', handle: '@jadebythesea', stage: 2, status: { type: 'facts', phrases: ['📬 Delivered yesterday', 'Planning her shoot 💭'] } },
    { name: 'Priya', handle: '@priyacreates', stage: 1, status: { type: 'facts', phrases: ['💭 Sketching content ideas', 'Confirmed her angle with Katie'] } },
    { mystery: true, name: 'Casting…', stage: 0, status: { type: 'shimmer', counter: 327, phrases: ['Casting her replacement…', 'Vetting 3 stand-ins…', 'Checking availability…'] } },
  ],
  16: [
    { name: 'Jade', handle: '@jadebythesea', stage: 4, action: { cta: 'Review reel' }, status: { type: 'static', phrases: ['Her reel passed every check — waiting on your approval since 9:40 am'] } },
    { name: 'Priya', handle: '@priyacreates', stage: 4, status: { type: 'shimmer', phrases: ['Verifying your required link…', 'Checking the disclosure tag…', 'Running brand-safety checks…'] } },
    { name: 'Maya', handle: '@maya.skin', stage: 3, status: { type: 'facts', phrases: ['🎥 Filming Saturday — confirmed Tuesday'] } },
    { name: 'Nia', handle: '@niaglow', stage: 3, status: { type: 'facts', phrases: ['🤳 Posted a BTS teaser to stories'] } },
    { name: 'Sofia', handle: '@sofia.films', stage: 3, status: { type: 'facts', phrases: ['💭 Storyboarding her before/after'] } },
    { name: 'Amara', handle: '@amara.gold', stage: 3, status: { type: 'facts', phrases: ['🎬 First shoot this week'] } },
  ],
  22: [
    { name: 'Nia', handle: '@niaglow', stage: 5, status: { type: 'heartbeat', phrases: ['👀 12.4k views — checked 4 min ago', '📈 +320 views in the last hour'] } },
    { name: 'Sofia', handle: '@sofia.films', stage: 5, status: { type: 'heartbeat', phrases: ['📣 Live on TikTok — watching tags', '👀 3.1k views — checked 9 min ago'] } },
    { name: 'Jade', handle: '@jadebythesea', stage: 5, status: { type: 'heartbeat', phrases: ['🔗 Link in bio — 214 taps so far', 'Checked 6 min ago'] } },
    { name: 'Maya', handle: '@maya.skin', stage: 4, status: { type: 'facts', phrases: ['⏰ Posting Thursday', 'Draft approved ✅'] } },
    { name: 'Priya', handle: '@priyacreates', stage: 4, status: { type: 'katie', phrases: ['Katie is scheduling her post'] } },
    { name: 'Amara', handle: '@amara.gold', stage: 3, status: { type: 'facts', phrases: ['🎬 Final edits — due Sunday'] } },
  ],
  30: [
    { name: 'Nia', handle: '@niaglow', stage: 5, status: { type: 'static', phrases: ['🏆 18.9k views — your top post'] } },
    { name: 'Jade', handle: '@jadebythesea', stage: 5, status: { type: 'static', phrases: ['💜 Fan favorite — 6.1% engagement'] } },
    { name: 'Sofia', handle: '@sofia.films', stage: 5, status: { type: 'static', phrases: ['✅ 2 posts live'] } },
    { name: 'Maya', handle: '@maya.skin', stage: 5, status: { type: 'static', phrases: ['✅ Posted + link shared'] } },
    { name: 'Priya', handle: '@priyacreates', stage: 5, status: { type: 'static', phrases: ['✅ Posted + link shared'] } },
    { name: 'Amara', handle: '@amara.gold', stage: 5, status: { type: 'static', phrases: ['✅ Posted — strong debut'] } },
  ],
};

const PHOTOS = {
  Maya: `${import.meta.env.BASE_URL}creators/maya.jpg`,
  Nia: `${import.meta.env.BASE_URL}creators/nia.jpg`,
  Sofia: `${import.meta.env.BASE_URL}creators/sofia.jpg`,
  Jade: `${import.meta.env.BASE_URL}creators/jade.jpg`,
  Priya: `${import.meta.env.BASE_URL}creators/priya.jpg`,
  Amara: `${import.meta.env.BASE_URL}creators/amara.jpg`,
  Lena: `${import.meta.env.BASE_URL}creators/lena.jpg`,
};

const CREW_META = {
  Maya: { fol: '64k', plat: 'Instagram' },
  Nia: { fol: '88k', plat: 'TikTok' },
  Sofia: { fol: '41k', plat: 'TikTok' },
  Jade: { fol: '112k', plat: 'Instagram' },
  Priya: { fol: '57k', plat: 'Instagram' },
  Amara: { fol: '38k', plat: 'TikTok' },
  Lena: { fol: '52k', plat: 'Instagram' },
};

const CREW_BANNERS = {
  1: { tone: 'clear', text: 'Nothing needs you — we’re casting your crew right now.' },
  3: { tone: 'amber', text: '1 thing needs you — pick your crew: 6 creators are ready for review. Everything else is handled.' },
  9: { tone: 'clear', text: 'Nothing needs you — 2 reminders sent, 1 replacement being cast, packages on the move.' },
  16: { tone: 'amber', text: '1 thing needs you — approve @jadebythesea’s reel. Everything else is handled: 2 reminders sent yesterday.' },
  22: { tone: 'amber', text: '1 thing needs you — Nia’s reel is taking off, a brand comment goes a long way. Everything else is handled.' },
  30: { tone: 'amber', text: '1 thing needs you — your wrap-up is ready to view 🥂' },
};

/* per-creator step history: done steps get `when`, future steps get `eta`;
   the current step embeds the row's live status inside the timeline */
const TIMELINES = {
  Maya: [
    { when: 'Mon 9:02 am', detail: 'Matched to your brief — 94% aesthetic fit' },
    { when: 'Tue 2:15 pm', detail: 'Accepted in under 5 hours' },
    { when: 'Wed 11:30 am', detail: 'Picked SPF 50 Tinted · UPS label created' },
    { eta: 'Saturday', detail: 'Shoot confirmed — golden hour planned' },
    { eta: 'early next week', detail: 'Draft + link & disclosure pre-checks' },
    { eta: 'next week', detail: 'Post goes live · we watch views hourly' },
  ],
  Nia: [
    { when: 'Mon 9:02 am', detail: 'Matched — her audience loves sun care' },
    { when: 'Mon 6:40 pm', detail: 'Accepted same day 🎉' },
    { when: 'Thu', detail: '“I’ve wanted to try this one forever”' },
    { when: 'Sun', detail: 'Filmed at the beach — two takes' },
    { when: 'Tue 2:02 pm', detail: 'Passed link + disclosure checks' },
    { when: 'Wed 1:05 pm', detail: 'Reel live — her best post this month' },
  ],
  Sofia: [
    { when: 'Mon 9:02 am', detail: 'Matched via your “clean girl” aesthetic' },
    { when: 'Wed', detail: 'Accepted after a schedule check' },
    { when: 'Fri', detail: 'Product delivered to Austin' },
    { when: 'Mon', detail: 'Storyboarded her before/after' },
    { when: 'Tue', detail: 'Draft approved first pass ✓' },
    { when: 'Thu', detail: 'TikTok live — tags verified' },
  ],
  Jade: [
    { when: 'Mon 9:02 am', detail: 'Hand-picked by Katie — “the light in her work”' },
    { when: 'Tue', detail: 'Accepted + shared her moodboard' },
    { when: 'Thu', detail: 'Delivered — she unboxed on stories' },
    { when: 'Sat', detail: 'Golden-hour beach shoot' },
    { when: 'Tue 3:55 pm', detail: '34s reel submitted — checks passed' },
    { eta: 'after your approval', detail: 'Goes live + link in bio' },
  ],
  Priya: [
    { when: 'Mon 9:02 am', detail: 'Matched — strong before/after format' },
    { when: 'Tue', detail: 'Accepted, confirmed her angle with Katie' },
    { when: 'Fri', detail: 'Product delivered' },
    { when: 'Mon', detail: 'Shot her story set' },
    { when: 'Tue 2:02 pm', detail: 'Submitted — running pre-checks' },
    { eta: 'this week', detail: 'Stories go live' },
  ],
  Amara: [
    { when: 'Wed 10:15 am', detail: 'Cast as Lena’s replacement — 96% fit' },
    { when: 'Wed 4:30 pm', detail: 'Accepted in 4 hours' },
    { when: 'Fri', detail: 'Express-shipped her product' },
    { eta: 'this week', detail: 'First shoot scheduled' },
    { eta: 'Sunday', detail: 'Draft due' },
    { eta: 'next week', detail: 'Post + link tracking' },
  ],
  Lena: [
    { when: 'Mon 9:02 am', detail: 'Matched to your brief' },
    { eta: 'on your approval', detail: 'Invite goes out' },
    { eta: '—', detail: 'Product pick + shipping' },
    { eta: '—', detail: 'Filming window' },
    { eta: '—', detail: 'Draft + pre-checks' },
    { eta: '—', detail: 'Post + link tracking' },
  ],
};

const CASTING_TIMELINE = [
  { label: 'Brief studied', when: 'this morning', detail: 'Palette, tone and audience mapped' },
  { label: 'Scanning', live: true, detail: 'Working through the creator graph' },
  { label: 'Shortlisting', eta: 'next', detail: 'Top matches go to Katie for a human pass' },
  { label: 'Your review', eta: '~2 days', detail: 'Cards land in your queue' },
];

const VARIANTS = [
  { key: 'A', name: 'Panel' },
  { key: 'B', name: 'Banner' },
  { key: 'D', name: 'Pulse tab' },
  { key: 'E', name: 'Rail wide' },
  { key: 'F', name: 'Rail left' },
  { key: 'H', name: 'Status band' },
  { key: 'I', name: 'Katie band' },
  { key: 'J', name: 'Katie note' },
  { key: 'K', name: 'While away' },
  { key: 'L', name: 'Tile row' },
  { key: 'M', name: 'Tiles right' },
  { key: 'N', name: 'Tiles left' },
  { key: 'O', name: 'Crew live' },
  { key: 'P', name: 'Crew photos' },
  { key: 'Q', name: 'Crew + pulse' },
  { key: 'R', name: 'Crew + tiles' },
];

const CREW_VARIANTS = ['O', 'P', 'Q', 'R'];

const RAIL_VARIANTS = ['E', 'F'];
const RAIL_HOST_VARIANTS = ['E', 'F', 'H', 'I', 'J', 'M', 'N'];
const BAND_VARIANTS = ['H', 'I', 'J'];

// Survive remounts (the captured-HTML subtree can wipe and re-mount the block).
let persistedIdx = 2; // open on Day 9 — the "dead middle" is the thesis
let persistedVariant = 'A';

function Feed({ scene, compact, thumbs }) {
  return (
    <div className={compact ? 'cp-feed cp-feed--compact' : 'cp-feed'}>
      {scene.feed.map((f, i) => (
        <div key={f.text} className={`cp-feed-item cp-feed-item--${f.tone}`} style={{ animationDelay: `${0.06 * i}s` }}>
          <div className="cp-feed-icon">{f.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cp-feed-time">{f.time}</div>
            <div className="cp-feed-text">{f.text}</div>
          </div>
          {thumbs && f.thumb && <span className="cp-feed-thumb" style={{ background: f.thumb }}>▶</span>}
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

/* --- live status engine: one renderer per honesty-pattern --- */
function LiveStatus({ status }) {
  const [pi, setPi] = useState(0);
  const [count, setCount] = useState(status.counter ?? 0);

  useEffect(() => {
    setPi(0);
    setCount(status.counter ?? 0);
    if (!status.phrases || status.phrases.length < 2) return undefined;
    const ms = status.type === 'shimmer' ? 2600 : 4200;
    const t = setInterval(() => setPi((p) => (p + 1) % status.phrases.length), ms);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (status.counter == null) return undefined;
    const t = setInterval(() => setCount((c) => c + 7 + Math.floor(Math.random() * 19)), 240);
    return () => clearInterval(t);
  }, [status]);

  const phrase = status.phrases?.[pi] ?? '';

  if (status.type === 'shimmer') {
    return (
      <span className="cp-live">
        <span className="cp-live-shimmer" key={phrase}>{phrase}</span>
        {status.counter != null && <span className="cp-live-counter">{count.toLocaleString()} scanned</span>}
      </span>
    );
  }
  if (status.type === 'katie') {
    return (
      <span className="cp-live cp-live--katie">
        <span className="cp-mini-katie">K<i className="cp-online" /></span>
        <span className="cp-live-fact" key={phrase}>{phrase}</span>
        <span className="cp-typing"><i /><i /><i /></span>
      </span>
    );
  }
  if (status.type === 'heartbeat') {
    return (
      <span className="cp-live">
        <span className="cp-beat-dot" />
        <span className="cp-live-fact" key={phrase}>{phrase}</span>
      </span>
    );
  }
  if (status.type === 'facts') {
    return <span className="cp-live"><span className="cp-live-fact cp-live-fact--gray" key={phrase}>{phrase}</span></span>;
  }
  return <span className="cp-live"><span className="cp-live-fact">{phrase}</span></span>;
}

/* --- harmonized tiles: identical head/body/footer anatomy --- */
function RecapTile({ scene }) {
  return (
    <div className="cp-recap-card">
      <div className="cp-recap-head">
        <span className="cp-recap-title">👋 While you were away</span>
        <span className="cp-recap-since">{scene.recap.since}</span>
      </div>
      <div className="cp-recap-body">
        {scene.recap.items.map((it, i) => (
          <div className="cp-recap-item" key={it.bold} style={{ animationDelay: `${0.07 * i}s` }}>
            <span className="cp-recap-emoji">{it.emoji}</span>
            <span className="cp-recap-text"><strong>{it.bold}</strong>{it.rest}</span>
          </div>
        ))}
      </div>
      {scene.recap.closer.clear ? (
        <div className="cp-recap-closer cp-recap-closer--clear">✅ {scene.recap.closer.text}</div>
      ) : (
        <div className="cp-recap-closer">
          <span>{scene.recap.closer.text}</span>
          <button type="button" className="cp-action-cta">{scene.recap.closer.cta}</button>
        </div>
      )}
    </div>
  );
}

function PaceTile({ scene }) {
  return (
    <div className="cp-recap-card">
      <div className="cp-recap-head">
        <span className="cp-recap-title">🏁 The pace</span>
        <span className="cp-recap-since">day {scene.day} of 30</span>
      </div>
      <div className="cp-recap-body">
        <PaceBars scene={scene} />
      </div>
    </div>
  );
}

function UpNextTile({ scene }) {
  return (
    <div className="cp-recap-card">
      <div className="cp-recap-head">
        <span className="cp-recap-title">⏭️ Up next</span>
      </div>
      <div className="cp-recap-body">
        {scene.upNext.map((u, i) => (
          <div className="cp-recap-item" key={u.text} style={{ animationDelay: `${0.07 * i}s` }}>
            <span className="cp-recap-emoji">{u.emoji}</span>
            <span className="cp-recap-text">
              <strong>{u.text}</strong>
              {u.eta && <span className="cp-tile-eta"> — {u.eta}</span>}
            </span>
          </div>
        ))}
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
  const [openCrew, setOpenCrew] = useState(() => new Set());
  const toggleCrew = (k) =>
    setOpenCrew((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  const [openDays, setOpenDays] = useState(() => new Set());
  const toggleDay = (day) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day); else next.add(day);
      return next;
    });
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

  // O: the crew view replaces the Dashboard tab's own content
  useEffect(() => {
    const wrap = rootRef.current?.parentElement;
    const column = wrap?.classList.contains('cp-host') ? wrap.parentElement : wrap;
    if (!column) return undefined;
    column.classList.toggle('cp-crew-mode', CREW_VARIANTS.includes(variant));
    return () => column.classList.remove('cp-crew-mode');
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
    column.classList.toggle('cp-rail-host--left', variant === 'F' || variant === 'N' || BAND_VARIANTS.includes(variant));
    column.classList.toggle('cp-rail-host--h', BAND_VARIANTS.includes(variant));
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

      {/* H/I/J: full-width status band, then two matched sections.
          I adds Katie + warm band + thumbnails + collapsed history; J adds her handwritten note. */}
      {BAND_VARIANTS.includes(variant) && (
        <>
          <div className={variant === 'H' ? 'cp-band' : 'cp-band cp-band--warm'} key={`h-band-${variant}-${scene.day}`}>
            <div className="cp-band-left">
              {variant !== 'H' && <div className="cp-katie">K</div>}
              <div>
                <h2 className="cp-band-headline">{scene.headline}</h2>
                <span className="cp-band-updated">
                  {variant === 'H' ? scene.updated : `Katie · your campaign manager · ${scene.updated.toLowerCase()}`}
                </span>
                {variant === 'J' && <div className="cp-katie-note">“{scene.katie}”</div>}
              </div>
            </div>
            <div className="cp-band-right">
              {scene.forYou.map((a) => (
                <button type="button" className="cp-band-action" key={a.text} title={a.text}>
                  {a.emoji} {a.cta} →
                </button>
              ))}
              <div className="cp-band-pace">
                <span className="cp-chip-pace">{scene.race.chip}</span>
                <div className="cp-band-track">
                  <div className="cp-fill cp-fill--you" style={{ width: `${scene.race.you}%` }} />
                </div>
                <span className="cp-band-day">day {scene.day} of 30</span>
              </div>
            </div>
          </div>
          <div className="cp-section-head cp-h-head" key="h-head">
            <h3 className="cp-section-title">Today at Benable</h3>
            <p className="cp-section-sub">Everything we're doing on your campaign — updated live</p>
          </div>
          <section className="cp-sec-card" key={`h-card-${variant}-${scene.day}`}>
            {[...DAYS.slice(0, idx + 1)].reverse().map((d, i) => {
              if (i === 0) return <Feed key={d.day} scene={d} thumbs={variant !== 'H'} />;
              if (variant === 'H') {
                return (
                  <div key={d.day} className="cp-journal-day cp-journal-day--past">
                    <div className="cp-journal-label"><span>{`Day ${d.day}`}</span></div>
                    <Feed scene={d} compact />
                  </div>
                );
              }
              const open = openDays.has(d.day);
              return (
                <div key={d.day} className="cp-journal-day cp-journal-day--past">
                  <button type="button" className="cp-day-summary" onClick={() => toggleDay(d.day)}>
                    <span className="cp-day-summary-label">Day {d.day}</span>
                    <span className="cp-day-summary-text">{d.summary}</span>
                    <span className="cp-day-summary-chev">{open ? '−' : '+'}</span>
                  </button>
                  {open && <Feed scene={d} compact thumbs />}
                </div>
              );
            })}
            <div className="cp-h-upnext">
              <div className="cp-overline" style={{ margin: '16px 0 10px' }}>Up next</div>
              {scene.upNext.map((u) => (
                <div className="cp-upnext-item" key={u.text}>
                  <span className="cp-upnext-emoji">{u.emoji}</span>
                  <div>
                    <div className="cp-upnext-text">{u.text}</div>
                    {u.eta && <div className="cp-upnext-eta">{u.eta}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* K: "while you were away" — the delta since last visit is the front door */}
      {variant === 'K' && (
        <div className="cp-recap" key={`k-${scene.day}`}>
          <div className="cp-recap-card">
            <div className="cp-recap-head">
              <span className="cp-recap-title">👋 While you were away</span>
              <span className="cp-recap-since">{scene.recap.since}</span>
            </div>
            <div className="cp-recap-body">
              {scene.recap.items.map((it, i) => (
                <div className="cp-recap-item" key={it.bold} style={{ animationDelay: `${0.07 * i}s` }}>
                  <span className="cp-recap-emoji">{it.emoji}</span>
                  <span className="cp-recap-text"><strong>{it.bold}</strong>{it.rest}</span>
                </div>
              ))}
            </div>
            {scene.recap.closer.clear ? (
              <div className="cp-recap-closer cp-recap-closer--clear">
                ✅ {scene.recap.closer.text}
              </div>
            ) : (
              <div className="cp-recap-closer">
                <span>{scene.recap.closer.text}</span>
                <button type="button" className="cp-action-cta">{scene.recap.closer.cta}</button>
              </div>
            )}
          </div>
          <div className="cp-recap-note">The same recap lands as your Monday digest email 📧</div>
        </div>
      )}

      {/* L/M/N: the same three harmonized tiles, three placements */}
      {variant === 'L' && (
        <div className="cp-tiles" key={`l-${scene.day}`}>
          <RecapTile scene={scene} />
          <UpNextTile scene={scene} />
          <PaceTile scene={scene} />
        </div>
      )}

      {(variant === 'M' || variant === 'N') && (
        <div className="cp-tile-stack" key={`${variant}-${scene.day}`}>
          <RecapTile scene={scene} />
          <UpNextTile scene={scene} />
          <PaceTile scene={scene} />
        </div>
      )}

      {/* O/P: the dashboard becomes a creator-per-creator live view; click a row for its history.
          P swaps the gradient initials for real portrait photos. */}
      {CREW_VARIANTS.includes(variant) && (
        <div className="cp-crew" key={`o-${scene.day}`}>
          <Lead scene={scene} />
          <div className={variant === 'Q' || variant === 'R' ? 'cp-crew-cols' : ''}>
          <div className="cp-crew-left">
          {CREW_BANNERS[scene.day] && (
            <div className={`cp-crew-banner cp-crew-banner--${CREW_BANNERS[scene.day].tone}`}>
              <span className="cp-crew-banner-dot" />
              {CREW_BANNERS[scene.day].text}
            </div>
          )}
          <div className="cp-crew-card">
            {(CREW[scene.day] || []).map((c, i) => {
              const meta = CREW_META[c.name];
              const rowKey = `${scene.day}-${c.name}-${i}`;
              const open = openCrew.has(rowKey);
              const timeline = c.mystery ? CASTING_TIMELINE : TIMELINES[c.name] || [];
              return (
                <div key={rowKey} className={c.action ? 'cp-crew-item cp-crew-item--action' : 'cp-crew-item'}>
                  <button type="button" className="cp-crew-row" style={{ animationDelay: `${0.05 * i}s` }} onClick={() => toggleCrew(rowKey)}>
                    {variant !== 'O' && !c.mystery && PHOTOS[c.name] ? (
                      <div className="cp-crew-avatar cp-crew-avatar--photo">
                        <img src={PHOTOS[c.name]} alt={c.name} />
                      </div>
                    ) : (
                      <div
                        className={c.mystery ? 'cp-crew-avatar cp-crew-avatar--mystery' : 'cp-crew-avatar'}
                        style={c.mystery ? {} : { background: HUES[c.name] }}
                      >
                        {c.mystery ? '?' : c.name[0]}
                      </div>
                    )}
                    <div className="cp-crew-main">
                      <div className="cp-crew-toprow">
                        <span className="cp-crew-name">{c.handle || c.name}</span>
                        {meta && <span className="cp-crew-meta">{meta.fol} · {meta.plat}</span>}
                      </div>
                      <div className="cp-crew-statusline"><LiveStatus status={c.status} /></div>
                    </div>
                    {c.action && (
                      <span
                        className="cp-action-cta"
                        role="button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.action.cta}
                      </span>
                    )}
                    <div className="cp-crew-right">
                      <div className="cp-bars">
                        {STAGE_LABELS.map((s, si) => (
                          <span key={s} title={s} className={si < c.stage ? 'cp-bar cp-bar--done' : si === c.stage ? 'cp-bar cp-bar--now' : 'cp-bar'} />
                        ))}
                      </div>
                      <span className="cp-crew-stagelabel">{c.mystery ? 'Sourcing' : STAGE_LABELS[c.stage]}</span>
                    </div>
                    <span className={open ? 'cp-caret cp-caret--open' : 'cp-caret'}>▸</span>
                  </button>

                  {open && (
                    <div className="cp-crew-history">
                      {timeline.map((st, si) => {
                        const state = c.mystery
                          ? (st.live ? 'now' : st.when ? 'done' : 'next')
                          : si < c.stage ? 'done' : si === c.stage ? 'now' : 'next';
                        return (
                          <div key={si} className={`cp-hist-step cp-hist-step--${state}`} style={{ animationDelay: `${0.05 * si}s` }}>
                            <span className="cp-hist-dot">{state === 'done' ? '✓' : ''}</span>
                            <div className="cp-hist-body">
                              <div className="cp-hist-top">
                                <span className="cp-hist-label">{c.mystery ? st.label : STAGE_LABELS[si]}</span>
                                <span className="cp-hist-when">{state === 'done' ? (st.when || 'done') : state === 'now' ? 'right now' : (st.eta || 'up next')}</span>
                              </div>
                              <div className="cp-hist-detail">{st.detail}</div>
                              {state === 'now' && <div className="cp-hist-live"><LiveStatus status={c.status} /></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="cp-crew-legend">{STAGE_LABELS.join(' · ')}</div>
          </div>

          {variant === 'Q' && (
            <aside className="cp-tile-stack">
              <div className="cp-recap-card">
                <div className="cp-recap-head">
                  <span className="cp-recap-title">📡 Today at Benable</span>
                  <span className="cp-recap-since">updated live</span>
                </div>
                <div className="cp-recap-body"><Feed scene={scene} compact thumbs /></div>
              </div>
              <div className="cp-katie-card">
                <div className="cp-katie">K</div>
                <div>
                  <div className="cp-katie-note">“{scene.katie}”</div>
                  <div className="cp-katie-byline">Katie · your campaign manager</div>
                </div>
              </div>
            </aside>
          )}

          {variant === 'R' && (
            <aside className="cp-tile-stack">
              <RecapTile scene={scene} />
              <UpNextTile scene={scene} />
              <PaceTile scene={scene} />
            </aside>
          )}
          </div>
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
