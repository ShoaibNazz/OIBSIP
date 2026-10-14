# Abdul Sattar Edhi: A Tribute

A single-page tribute website to Abdul Sattar Edhi (1928–2016), the Pakistani humanitarian who founded the Edhi Foundation. It is built with plain HTML5 and CSS3 and no frameworks or build tools.

The design is a dignified editorial layout: cream and white sections alternating with deep green, serif headings and a readable sans-serif body.

## Project structure

```
WebDev-L2-TributePage/
├── index.html
├── style.css
└── README.md
```

## Technologies

- **HTML5** with semantic landmarks (`header`, `nav`, `main`, `section`, `aside`, `figure`, `blockquote`, `footer`), an ordered list for the timeline and a definition list for key facts.
- **CSS3** with custom properties, Flexbox, Grid, `clamp()` fluid type and three responsive breakpoints.
- **Google Fonts** (Newsreader for headings, Public Sans for body text). They are optional: if they do not load, the page falls back to Georgia and the system sans-serif font.
- **No JavaScript.** Smooth scrolling is plain CSS and is switched off for visitors who prefer reduced motion.

## How to run

1. Download or copy the three files into one folder.
2. Open `index.html` in any modern browser (double-click it, or right-click and choose "Open with").
3. An internet connection is needed to show the portrait and the web fonts. No install step is required.

Optional: serve it locally with `python -m http.server 8000` from inside the folder, then visit `http://localhost:8000`.

## Accessibility and responsiveness

- Skip link, one `h1`, a logical heading order and labelled landmarks.
- Visible keyboard focus on every link, with a different outline colour on dark sections.
- Text and background colour pairs are chosen for strong contrast.
- No horizontal scrolling: the layout stacks to one column on phones, and long URLs wrap.
- The portrait keeps its aspect ratio (`width`/`height` attributes plus `aspect-ratio` and `object-fit`) so it never stretches.
- Motion is limited to optional smooth scrolling.

## Image source and licence

- **Portrait:** "Abdul Sattar Edhi close-up (cropped).jpg" by Hussain, on Wikimedia Commons.
- **Licence:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0), as stated on the Commons file page.
- **File page:** https://commons.wikimedia.org/wiki/File:Abdul_Sattar_Edhi_close-up_(cropped).jpg
- **Original file:** https://commons.wikimedia.org/wiki/File:Abdul_Sattar_Edhi.jpg
- **Licence text:** https://creativecommons.org/licenses/by-sa/3.0/

The page credits the author, names the licence, links to the source and notes that the image is a crop. The image is loaded directly from Wikimedia Commons through its `Special:FilePath` address. If you want the site to work offline, download the file from the Commons page and change the `src` in `index.html` to the local file. Keep the credit line and licence link next to it.

## Content sources

Facts were checked against these references and then paraphrased in original wording:

- Encyclopædia Britannica, "Abdul Sattar Edhi": https://www.britannica.com/biography/Abdul-Sattar-Edhi
- International Balzan Foundation, 2000 Balzan Prize laudatio: https://www.balzan.org/en/prizewinners/abdul-sattar-edhi
- Edhi Foundation, founder profile and home page: https://www.edhi.org/founder-profile and https://www.edhi.org/
- Wikipedia, "Abdul Sattar Edhi" (marriage, state funeral, honours, foundation figures, and its cited news reports): https://en.wikipedia.org/wiki/Abdul_Sattar_Edhi

### Quotation

The quotation block uses the words of the banner that Edhi placed outside his first dispensary in 1951, exactly as recorded in the Balzan Foundation's account. It is attributed to that source rather than presented as a speech or interview. No other quotations are used.

### Facts versus tribute

- The biography, timeline and legacy sections summarise historical facts.
- The paragraph labelled **Author's tribute** in the Legacy section is a personal reflection and is clearly marked as such.

### Known differences between sources

- **Birth date:** sources give different days, so only the year, 1928, is shown.
- **Foundation date:** some sources date the foundation to 1951 (the dispensary) and others to 1974 (registration of the trust). The timeline uses the Balzan account of the 1974 registration and describes 1951 as the dispensary.
- **Ambulance numbers:** reports range from about 1,500 to about 1,800, so the page says "1,500 or more".

## Notes

- This is an independent educational project and is not affiliated with the Edhi Foundation. To donate, use the foundation's official site, https://www.edhi.org/.
- Always re-check links before submitting or publishing, because websites change.
