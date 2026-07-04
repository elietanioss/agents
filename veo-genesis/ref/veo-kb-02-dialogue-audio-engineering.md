# Dialogue & Audio Engineering

Source: core-08-VEO_GENESIS.md Section 7 (Patterns 7.1-7.3).

## The 8-Second Dialogue Rule
Word count scales with duration — never exceed:
- 4s video: 6-8 words max (12-15 syllables)
- 6s video: 9-12 words max (18-22 syllables)
- 8s video: 12-15 words max (20-25 syllables)

Exceeding this causes speech cutoff mid-word or unnaturally rushed delivery. Always test by reading the line aloud — it must complete naturally within the duration.

## Colon Syntax (mandatory — prevents unwanted subtitles)
**Correct**: `Character says: "dialogue text"` — this exact colon+quote format tells VEO 3 to generate spoken audio WITHOUT visual text overlays.

**Wrong formats that trigger subtitle generation**:
- `Character "dialogue text"` (no colon)
- `"dialogue text" - Character` (attribution after)
- `Character: "dialogue"` (no "says")
- `[Character speaking]: "dialogue"`

## Tone Specification
Always precede dialogue with a tone descriptor:
```
(Tone: [emotional quality], [delivery style], [pacing/energy])
Character says: "Dialogue text here."
```
Example: `(Tone: Confident, authoritative, measured delivery with slight warmth) / CEO says: "Our vision for the future starts with the decisions we make today."`

## Phonetic Pronunciation
For technical terms, brand names, or uncommon words, add phonetic spelling in parentheses: `Developer says: "We're using PostgreSQL (POSS-gres-Q-L) for the database layer."`

## Dialogue Pacing Styles
- **Conversational natural** — vlogs, casual content, authentic testimonials
- **Professional measured** — corporate, educational, formal presentations
- **Energetic fast** — TikTok, social media, high-energy content
- **Slow deliberate** — emotional content, luxury brands, dramatic moments
- **Instructional clear** — tutorials, how-to, educational content

## Audio Hallucination Prevention
VEO 3 will invent audio (audience laughter, competing music, crowd chatter, phone rings, applause) unless every audio layer is explicitly specified. **Never leave audio unspecified** — always fill all four fields:
```json
{
  "audio": {
    "dialogue": {"quality": "...", "volume": "foreground prominence at 100%"},
    "ambient": {"environment": "...", "elements": ["sound 1 at X%", "sound 2 at Y%"]},
    "music": {"present": true, "genre": "...", "mood": "...", "volume": {"during_dialogue": "X%", "instrumental_moments": "Y%"}},
    "specific_sounds": ["..."],
    "hallucination_prevention": {"exclude": ["unwanted_sound_1", "unwanted_sound_2"]}
  }
}
```

### Ambient sound presets by environment (volumes are starting points, tune to scene)
- **Office/corporate**: distant keyboard typing 12-15%, HVAC hum 8-10%, paper rustle 5-8%, mouse clicks 6%. Exclude: loud conversations, phone ringing, alarms.
- **Home/kitchen**: fridge hum 8%, dish/utensil sounds 10-12%, water running 15%, cabinet close 10%. Exclude: TV/radio in background, doorbell, pets/children unless intended.
- **Outdoor/urban**: distant traffic 10-12%, wind 8%, city ambiance 10%, footsteps on pavement 12%, distant birds 6-8%. Exclude: honking, sirens, clear passerby conversations.
- **Coffee shop**: espresso machine 12%, muffled background chatter 10%, cup/dish sounds 8%, café music barely audible 6%. Exclude: loud clear conversations, order-calling/barista shouts.
- **Workshop/garage**: tool sounds 10%, ventilation 8%, material sounds 12%, footsteps on concrete 10%. Exclude: loud power tools unless featured, radio unless wanted.
- **Gym/fitness**: distant equipment 10%, muffled gym music 8%, breathing (if exercising) 15-20%, footsteps 12%. Exclude: music competing with dialogue, others' conversations/grunting.

## Volume Mixing Hierarchy (always in this priority order)
1. **Dialogue** — 100% foreground clarity, always
2. **Specific/diegetic sounds** — 15-30% (footsteps, object handling)
3. **Music** — 15-35% during dialogue (ducks below), 40-80% during instrumental-only moments
4. **Ambient** — 5-15%, always subtle texture

"Ducking": explicitly state "music ducks to X% when dialogue present, rises to Y% during instrumental moments."

## Music Genre Library by Use Case
| Use case | Genre examples | Volume (dialogue / instrumental) |
|---|---|---|
| Corporate/professional | Inspirational corporate underscore, modern corporate background, motivational business | 20-30% / 60-70% |
| Energetic/upbeat (TikTok, fitness, launches) | Upbeat energetic pop, motivational electronic, inspiring uplifting | 30-35% / 70-80% |
| Emotional/storytelling | Emotional piano, cinematic storytelling, warm acoustic | 15-25% / 50-60% |
| Minimal/sophisticated (luxury) | Minimal modern underscore, ambient corporate, sophisticated lounge | 15-20% / 40-50% |

## Common Audio/Dialogue Failures → Fix
| Symptom | Fix |
|---|---|
| Unwanted subtitles appear | Verify colon syntax; add "NO subtitles, NO captions, NO text overlays" to Technical negative |
| Dialogue not lip-synced | Check word count against 8s rule; add explicit "lip-sync accuracy critical" line; simplify phrasing |
| Random background sounds (hallucination) | Comprehensively specify all 4 audio layers + exclusion list; state "quiet professional space" explicitly |
| Dialogue too quiet / music too loud | Set explicit percentages for both; state "Dialogue is absolute foreground priority"; add ducking instruction |
