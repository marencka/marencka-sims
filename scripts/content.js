export const career = {
  title: "Senior Design Engineer",
  employer: "Google",
  logo: "Google-icon.svg",
  team: "Chrome",
  school: "",
  since: "Sept 2026",
  hours: "9 am to 5 pm",
  next: "Staff Design Engineer",
  ambition: 10,
  workdays: [1, 2, 3, 4, 5]
};

export const skills = [
  { name: "JavaScript",    level: 9 },
  { name: "C#",            level: 7 },
  { name: "Design", level: 7 }, 
  { name: "Python",        level: 6 },
  { name: "C++",           level: 1 }
];

export const traits = [
  { low: "Light mode",  high: "Dark mode",    level: 9 },
  { low: "Mouse",  high: "Hotkeys", level: 8 },
  { low: "Night owl",  high: "Early bird",    level: 6 },
  { low: "Tea", high: "Coffee",  level: 10 },
  { low: "Introvert",  high: "Extrovert", level: 6 }
];

export const motives = [
  { name: "Caffeine",       value: 88 },
  { name: "Sleep",          value: 41 },
  { name: "Social battery", value: 80 },
  { name: "Yarn stash",     value: 97 },
  { name: "Daylight",       value: 26 },
  { name: "Side projects",  value: 79 }
];

export const wants = [
  { img: "level-up",  label: "Level up in C++",                points:  2500 },
  { img: "Birdwatch", label: "Launch Chirpdex",                points:  5000 },
  { img: "friends",   label: "Start a local craft night",      points:  1000 },
  { img: "blog",      label: "Start a Substack on wool",       points:  1500 }
];

export const fears = [
  { img: "bugs",      label: "Ship a bug to production",       points: -1500 },
  { img: "Zombie",    label: "Become a slop zombie",           points: -3000 },
  { img: "fire",      label: "A livesite on a Friday",     points: -5000 }
];

export const projects = [
  {
    id: "himmel",
    name: "Himmel",
    tag: "iOS · Swift · Core ML",
    blurb: "An iOS app that predicts how good the sunrise or sunset will be before it happens. " +
           "It reads cloud altitude, atmospheric conditions and the geometry of the light, and " +
           "scores the sky against thousands of observations I graded myself. Built in Swift with " +
           "WeatherKit and Core ML.",
    link: null
  },
  {
    id: "chirpdex",
    name: "Chirpdex",
    tag: "React Native · audio ML · eBird API",
    blurb: "A field guide that listens. Passive audio identification turns the birds around you " +
           "into a collection — each new species arrives as a card to open, drawn in pixel art. " ,
    link: null
  },
  {
    id: "thermocoagulator",
    name: "Thermocoagulator Simulator",
    tag: "Android · published",
    blurb: "A training app for health care professionals learning to use a thermocoagulation probe " +
           "to treat and prevent cervical cancer. Built for a medical coalition so resource-limited " +
           "hospitals could train staff before committing to a purchase.",
    link: null
  },
  {
    id: "tamagotchi",
    name: "Tamagotchi To-Do",
    tag: "Web · vanilla JS",
    blurb: "A to-do list that is also a pet. Clear your tasks and it thrives. Ignore them and it " +
           "makes that your problem.",
    link: null
  }
];

export const about = [
  "Hi, I'm Alexis! I'm a Senior Design Engineer at Google.",

  "I've always loved taking things apart to see how they work, then making my own version. These days that usually means code, and the rest of the time it's yarn and fabric.",

  "Funny enough, I didn't write my first line of code until my junior year of college. I was a biochem major working in the emergency department, fully set on med school, when I took an intro CS class on a whim. I fell in love with it immediately and never looked back.",

  "Now my favorite part of the job is the space between design and engineering, where good ideas become things that actually solve problems for people. I care a lot about thoughtful UX/UI, and about building AI products responsibly.",

  "On the side, I build apps for the outdoors, like Himmel (sunset forecasts) and Chirpdex (a Pokédex for birds).",

  "When I'm away from the keyboard, you'll probably find me biking, knitting, reading, or drinking coffee on my fire escape. And I will never say no to omakase or a Seattle sports game.",
];

export const contact = {
  intro: "The fastest way to reach me is email.",
  links: [
    { label: "Email",    value: "alexismdanz@gmail.com",            href: "mailto:alexismdanz@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/alexisdanz",     href: "https://www.linkedin.com/in/alexisdanz" },
    { label: "GitHub",   value: "github.com/marencka",          href: "https://github.com/marencka" }
  ]
};

export const resume = {
  note: "The résumé is a PDF — open it in a new tab, or take the file with you.",
  links: [
    { label: "Open the résumé", href: "resume.pdf", newTab: true },
    { label: "Download PDF",    href: "resume.pdf", download: "alexis-danz-resume.pdf" }
  ]
};
 
export const notice = {
  text: "Alexis got a new job! Check out the Career tab to see more.",
  portrait: "assets/portrait.png",
  cta: "Career",
  ctaSub: "Open the panel this is about",
  close: "Dismiss",
  tab: "career",
  mobile: {
    text: "Alexis got a new job! The details are on her r\u00e9sum\u00e9.",
    cta: "R\u00e9sum\u00e9",
    ctaSub: "Open the r\u00e9sum\u00e9",
    tab: null,
    go: "#/resume"
  }
};

export const funds = {
  start: 15540,
  key: "marencka:funds@1"
};

export const cheats = {
  open: "ctrl+shift+c",
  placeholder: "",
  label: "Cheat console",
  ok: (n) => `\u00a7${n.toLocaleString()} added.`,
  error: (cmd) => `Error: unknown cheat "${cmd}".`,
  commands: {
    motherlode: { amount: 50000 },
    kaching:    { amount:  1000 }
  }
};

export const ui = {
  close: "Close",
  ok: "OK",
  titles: {
    resume:   "Résumé",
    projects: "Projects",
    about:    "About",
    contact:  "Contact",
    source:   "Source"
  },
  panel: {
    skills:     "Skills",
    traits:     "Personality",
    ambition:   "Ambition",
    next:       "Next",
    company:    "Company",
    team:       "Team",
    since:      "Since",
    schedule:   "Schedule",
    hours:      "Hours"
  },
  sourceHeads: {
    credits: "Credits",
    build:   "How it's built"
  },
  projectsIntro: "Pick one to open it.",
  backToProjects: "All projects",
  visitProject: "Visit the project"
};

export const NAV_ROUTES = {
  resume:   "#/resume",
  projects: "#/projects",
  about:    "#/about",
  contact:  "#/contact",
  archive:  "https://98.marencka.com",
  source:   "#/source"
};

export const pieVerbs = [
  { label: "View Résumé",        go: NAV_ROUTES.resume },
  { label: "Be Funny",           say: "Alexis told a joke about CSS specificity. Nobody laughed." },
  { label: "Show Projects",      go: NAV_ROUTES.projects },
  { label: "Check the Sky",      say: "Alexis checked the sky. Himmel says it peaks at 7:14." },
  { label: "Talk About Self",    go: NAV_ROUTES.about },
  { label: "Reticulate Splines", say: "Splines reticulated. They were already fine." },
  { label: "Contact Alexis",     go: NAV_ROUTES.contact },
  { label: "Nap",                say: "Alexis cannot nap right now. There is a side project." }
];

export const source = {
  intro: "I grew up playing The Sims on the family computer, so this site is paying homage and bringing some whimsy to a personal website. I spent so many mornings making Sim families and putting them through inane drama and weird scenarios. I also have a deep nostalgia for the Frutiger Aero era, so this is my love letter to that time.",

  credits: [
    {
      label: "The HUD",
      value: "Sims 2 UI Design Study (Community)",
      href: "https://www.figma.com/design/UZEawMQ1yoNhlQI1O3szmj/Sims-2-UI-Design-Study--Community-",
      note: "John Cyfers rebuilt the entire Sims 2 interface in Figma and shared the file. " +
            "Every panel, button and dial here was measured out of it. Without it I'd have " +
            "spent a month eyedropping screenshots and still gotten it wrong."
    },
    {
      label: "Icons",
      value: "The Sims Wiki",
      href: "https://sims.fandom.com/wiki/The_Sims_Wiki",
      note: "The want, fear and aspiration icons came from here."
    },
    {
      label: "The game",
      value: "The Sims 2, by Maxis and EA",
      href: null,
      note: "I just really like this game. Nothing here is for sale and nobody endorsed it."
    }
  ],

  buildIntro: "Hand-written HTML, CSS and ES modules. No framework, no build step.",

  build: [
    {
      label: "Layout",
      text: "The HUD is panel art with everything positioned on top of it in percentages, so " +
            "the whole thing scales as one piece instead of reflowing. Every element's x, y, " +
            "width and height came from eyeballing."
    },
    {
      label: "The scene",
      text: "The background is a real Sim at a real computer. I built her in The Sims 2, sat " +
            "her down to write, and captured it in OBS, then cut the take to the seven and a " +
            "half seconds that loop without a seam. It ships as WebM and MP4, with a smaller " +
            "encode for phones, and holds on a poster frame until it can play."
    },
    {
      label: "The head",
      text: "The face in the middle of the pie menu watches your cursor, and it is doing it " +
            "with her real animation. Rather than pose 24 screenshots, I recorded one slow lap " +
            "of the cursor around an open pie menu in-game and let ffmpeg pull the frames out " +
            "at 10fps. A script finds the white arrow in each frame, works out its angle around " +
            "her head, bins the frames into 15° buckets and packs the winners into a single " +
            "sprite sheet. The browser just slides the background position; the easing between " +
            "buckets is what makes her swing round to meet you instead of snapping."
    },
    {
      label: "Content",
      text: "Every string, motive, want and project lives in scripts/content.js. Nothing you " +
            "can read is written anywhere else, so editing the site feels more like editing a " +
            "save file."
    },
    {
      label: "Flourishes",
      text: "The plumbob on the loading screen is eight CSS facets on a spinning stage, not a " +
            "video. Click the scene for a pie menu, hover anything for a tooltip, and the " +
            "pop-up that greets you is the promotion notification."
    }
  ]
};
