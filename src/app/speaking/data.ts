// Shared content for /speaking and /speaking/press-kit, so the talks, bios,
// and contact details only ever need editing in one place.

export const BOOKING_EMAIL = "hello@weareingoodco.com";
export const BOOKING_MAILTO = `mailto:${BOOKING_EMAIL}?subject=Speaking%20inquiry%20for%20GOOD%20THINKING`;
export const PRESS_MAILTO = `mailto:${BOOKING_EMAIL}?subject=Press%20inquiry%20for%20GOOD%20THINKING`;
export const SITE_URL = "https://getgoodthinking.com";

// Brand palette, hard-coded so the site's light-mode overrides can't touch it.
export const C = {
  yellow: "#F9FF00",
  black: "#000000",
  white: "#FFFFFF",
  cream: "#FAFAF8",
  paper: "#F0EFE8",
};

export const TALKS = [
  {
    no: "01",
    title: "The Future Is Now",
    short: "10 culture trends and predictions for 2027. Zero category silos, no obvious takes.",
    body: "What will people want next, and how will it shape not just culture or your business, but how we exist? 10 culture trends and predictions for 2027, from the age of authorship to why we've had our fill of availability gluttony. Across culture, food & bev, alphas, silvers, retail, tech, sport, wellness, and travel. Zero category silos. No obvious takes. You'll leave with a clearer view of what's coming and better questions to ask about what comes next.",
  },
  {
    no: "02",
    title: "Thinking in Possibilities",
    short: "Breaking out of your category and taking hold of your brand's trajectory.",
    body: "Most brands stay boxed in by their own category. This is about breaking out of the silo, thinking beyond the confines of where you're supposed to play, and taking hold of your brand's trajectory instead of letting the market decide it for you.",
  },
  {
    no: "03",
    title: "The Age of Authorship",
    short: "AI made building almost free. The hard part now is mattering.",
    body: "AI just made building almost free, so execution is no longer the advantage. The hard part is mattering. Why vision, not output, is the real differentiator now, and what it means for brands when anyone can make anything.",
  },
  {
    no: "04",
    title: "The Public CMO",
    short: "Why brand leaders are becoming public figures, and how to do it without the cringe.",
    body: "The most powerful brand asset a company has might be the person leading it. Why the next generation of CMOs and founders are becoming public figures, how to build a personal brand without the cringe, and what it unlocks for the brand behind you.",
  },
  {
    no: "05",
    title: "GOOD HARD TRUTHS",
    short: "The GOOD THINKING lens pointed at your brand: the honest read, plus real actions.",
    body: "You're too close to your own brand to see it clearly. This is us pointing the GOOD THINKING lens at yours: the honest read on how you're really perceived, the stuff your team feels but can't quite say, and 3 to 5 real actions to run with. Tough love, built to leave the room energized rather than audited.",
  },
];

export const FORMATS = ["Keynotes", "Firesides & panels", "Workshops", "CMO dinners"];

export const STAGES = ["SXSW", "Brands & Culture", "Paradigms", "Private brand & leadership summits"];

export const VIDEOS = [
  { title: "SXSW · Austin", id: "aWDxk7nBQ1s" },
  { title: "Brands & Culture · New York", id: "lktsrBpM_0k" },
];

export const SPEAKERS = [
  {
    name: "Kirsten Ludwig",
    role: "Co-Founder, IN GOOD CO",
    img: "/speaking/kirsten.jpg",
    linkedin: "https://www.linkedin.com/in/kirstenludwig/",
    bio: "Kirsten Ludwig is a brand builder, cultural curator, and Co-Founder of IN GOOD CO, a global brand consultancy built for challenger brands that refuse to play it safe. She is the co-host of the GOOD THINKING podcast, a speaker and a top voice in brand. Her expertise is disrupting the status quo.",
  },
  {
    name: "Chris Danton",
    role: "Co-Founder, IN GOOD CO · Writer, GOOD THINKING",
    img: "/speaking/chris.jpg",
    linkedin: "https://www.linkedin.com/in/chrisdanton/",
    bio: "Chris is an award-winning futurist, brand builder, author, speaker, and creative strategist. She is also the author and podcast co-host for GOOD THINKING, a publication read by top brand executives across the world. Her expertise is leading the future of brand.",
  },
];

// Press-kit bios in three lengths. Built only from facts already on the site.
export const BIOS = [
  {
    who: "Chris Danton",
    pronouns: "she/her",
    oneLine:
      "Chris Danton is an award-winning futurist, Co-Founder of IN GOOD CO, and the writer behind GOOD THINKING.",
    short:
      "Chris Danton is an award-winning futurist, brand builder, and Co-Founder of IN GOOD CO. She writes and co-hosts GOOD THINKING, a weekly newsletter and podcast read by top brand executives across the world, and speaks on leading the future of brand.",
    full: [
      "Chris Danton is an award-winning futurist, brand builder, author, speaker, and creative strategist, and Co-Founder of IN GOOD CO, a global brand consultancy built for challenger brands that refuse to play it safe.",
      "She is the author and podcast co-host of GOOD THINKING, a weekly newsletter and podcast on brand, marketing, and culture read by 18K subscribers, including top brand executives across the world.",
      "Chris has spoken at SXSW, Brands & Culture, and Paradigms, co-hosts invite-only CMO dinners at Cannes, and keynotes on foresight, the Age of Authorship, and why the next generation of brand leaders are becoming public figures. Her expertise is leading the future of brand.",
    ],
  },
  {
    who: "Kirsten Ludwig",
    pronouns: "she/her",
    oneLine:
      "Kirsten Ludwig is a brand builder, cultural curator, Co-Founder of IN GOOD CO, and co-host of GOOD THINKING.",
    short:
      "Kirsten Ludwig is a brand builder, cultural curator, and Co-Founder of IN GOOD CO, a global brand consultancy for challenger brands. She co-hosts the GOOD THINKING podcast and is a top voice in brand, known for disrupting the status quo.",
    full: [
      "Kirsten Ludwig is a brand builder, cultural curator, and Co-Founder of IN GOOD CO, a global brand consultancy built for challenger brands that refuse to play it safe.",
      "She is the co-host of the GOOD THINKING podcast, part of a weekly newsletter and podcast on brand, marketing, and culture read by 18K subscribers. She is a speaker and a top voice in brand.",
      "Kirsten has spoken at SXSW, Brands & Culture, and Paradigms and co-hosts invite-only CMO dinners at Cannes. Her expertise is disrupting the status quo.",
    ],
  },
  {
    who: "Together",
    pronouns: "Kirsten & Chris",
    oneLine:
      "Kirsten Ludwig and Chris Danton are the Co-Founders of IN GOOD CO and the hosts of GOOD THINKING.",
    short:
      "Kirsten Ludwig and Chris Danton are the Co-Founders of IN GOOD CO, a global brand consultancy for challenger brands, and the hosts of GOOD THINKING, a weekly newsletter and podcast on brand, marketing, and culture read by 18K subscribers.",
    full: [
      "Kirsten Ludwig and Chris Danton are the Co-Founders of IN GOOD CO, a global brand consultancy built for challenger brands that refuse to play it safe.",
      "Together they publish GOOD THINKING, a weekly newsletter and podcast on brand, marketing, and culture read by 18K subscribers, including top brand executives across the world, and GOOD FUTURE, their trends work on what's next.",
      "They have spoken at SXSW, Brands & Culture, and Paradigms, host invite-only CMO dinners at Cannes, and keynote as a duo or solo on the future of brand, culture, and what it takes to matter now.",
    ],
  },
];

// Approved press photos. `src` is the web-size preview; `file` is the
// press-size download in /public/speaking/press.
export const PRESS_PHOTOS = [
  { caption: "Kirsten Ludwig & Chris Danton", src: "/speaking/duo.jpg", file: "/speaking/press/duo.jpg", pos: "object-center" },
  { caption: "Chris Danton", src: "/speaking/chris.jpg", file: "/speaking/press/chris.jpg", pos: "object-top" },
  { caption: "Kirsten Ludwig", src: "/speaking/kirsten.jpg", file: "/speaking/press/kirsten.jpg", pos: "object-top" },
  { caption: "Kirsten Ludwig & Chris Danton", src: "/speaking/onstage-duo.jpg", file: "/speaking/press/onstage-duo.jpg", pos: "object-[center_28%]" },
  { caption: "Kirsten Ludwig on stage at Paradigms", src: "/speaking/kirsten-stage.jpg", file: "/speaking/press/kirsten-stage.jpg", pos: "object-[45%_center]" },
  { caption: "Chris Danton on stage at Paradigms", src: "/speaking/chris-stage.jpg", file: "/speaking/press/chris-stage.jpg", pos: "object-top" },
];

// One logo shown per brand; "Download all" gets every version in a zip.
export const PRESS_LOGOS = [
  { brand: "GOOD THINKING", src: "/speaking/press/logos/good-thinking-yellow.svg", tile: C.yellow, pad: "p-2", zip: "/speaking/good-thinking-logos.zip" },
  { brand: "IN GOOD CO", src: "/speaking/press/logos/in-good-co-white.svg", tile: C.black, pad: "px-16 py-14", zip: "/speaking/in-good-co-logos.zip" },
];

export const PRESS_ZIP = "/speaking/good-thinking-press-photos.zip";
// Built from /speaking/press-kit/pdf with `npm run presskit:pdf`.
export const PRESS_PDF = "/speaking/good-thinking-press-kit.pdf";

export const LINKS = [
  { label: "Website", handle: "getgoodthinking.com", href: SITE_URL },
  { label: "Substack", handle: "ingoodco.substack.com", href: "https://ingoodco.substack.com" },
  { label: "YouTube", handle: "GOOD THINKING", href: "https://www.youtube.com/channel/UChgJqNTNTPweoIPESAZ-68A" },
  { label: "Apple Podcasts", handle: "GOOD THINKING", href: "https://podcasts.apple.com/us/podcast/good-thinking-midweek/id1759539149" },
  { label: "Spotify", handle: "GOOD THINKING", href: "https://open.spotify.com/show/0tEzCCFzfs0EJBIoiSgPia" },
  { label: "IN GOOD CO", handle: "weareingoodco.com", href: "https://weareingoodco.com" },
  { label: "Instagram", handle: "@instagoodcompany", href: "https://www.instagram.com/instagoodcompany" },
  { label: "Instagram", handle: "@itschrisdanton", href: "https://www.instagram.com/itschrisdanton/" },
  { label: "Instagram", handle: "@kirstenludwig", href: "https://www.instagram.com/kirstenludwig/" },
  { label: "LinkedIn", handle: "in/chrisdanton", href: "https://www.linkedin.com/in/chrisdanton/" },
  { label: "LinkedIn", handle: "in/kirstenludwig", href: "https://www.linkedin.com/in/kirstenludwig/" },
];

// Real quotes only, from the "LOVE FOR GOOD THINKING" Google Doc.
// Talks/sessions first, then newsletter love from big-name leaders.
export const TESTIMONIALS: { quote: string; who: string }[] = [
  {
    quote: "Thank you for such a compelling presentation today. The team was energized and excited to have a different take on what trends are shaping marketing and culture right now. Appreciate you both.",
    who: "Lara Balazs, CMO, Adobe",
  },
  {
    quote: "Kirsten and Chris are two of the very best in the business. Their insights speed round session was clear, practical, engaging, and genuinely useful. It sparked ideas my team can put to work immediately.",
    who: "Allison Staad, CMO, Ollie",
  },
  {
    quote: "Chris writes GOOD THINKING which many marketers consider to be the most interesting and relevant newsletter on brands and culture right now.",
    who: "Jenny Olson, CMO, Herman Miller",
  },
  {
    quote: "I pore through your weekly newsletter and dive into virtually every link. I also find myself forwarding it to many of the companies I work with.",
    who: "Tony Weisman, Board Member, Klaviyo · Former CMO, Dunkin'",
  },
  {
    quote: "I'm a huge fan and have read nearly everything you've published. I'm truly impressed by the way you gather such extensive data and transform it into something so clear and easy to understand.",
    who: "Mark Johnson, Director of Retail Experience & Innovation, Target",
  },
  {
    quote: "I have pretty much unsubscribed from everything else at this point, but I felt yours was a must keep. I find a few gems in there each week.",
    who: "Aaron Levant, CEO, Complex · Co-Founder, TRUFF",
  },
];

// Guests on the CMO dinners (shown in the dinners section).
export const DINNER_QUOTES: { quote: string; who: string }[] = [
  {
    quote: "You definitely collected the most interesting (and generous) people at Cannes! I got some great ideas and follow ups for sure!!",
    who: "Claudine Cheever, CMO, Pinterest",
  },
  {
    quote: "Truly one of the highlights of the week was your dinner. Thanks for including me.",
    who: "Meghan Gendelman, B2B CMO, Canva",
  },
];

// "Follow along" cards on the speaking page.
export const SOCIALS = [
  { platform: "Substack", handle: "GOOD THINKING", href: "https://ingoodco.substack.com", icon: "substack" },
  { platform: "YouTube", handle: "GOOD THINKING", href: "https://www.youtube.com/channel/UChgJqNTNTPweoIPESAZ-68A", icon: "youtube" },
  { platform: "LinkedIn", handle: "Chris Danton", href: "https://www.linkedin.com/in/chrisdanton/", icon: "linkedin" },
  { platform: "LinkedIn", handle: "Kirsten Ludwig", href: "https://www.linkedin.com/in/kirstenludwig/", icon: "linkedin" },
] as const;
