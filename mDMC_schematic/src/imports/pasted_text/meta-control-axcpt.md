Create a clean scientific schematic on one page, landscape orientation, showing three horizontally aligned computational pipelines stacked vertically:

1) Cue-stage proactive control
2) Probe-stage reactive control
3) Probe-stage inhibition meta-control

Overall style:
- publication-quality
- minimal, clean, white background
- precise alignment
- generous spacing
- thin arrows
- modern academic figure style
- no decorative icons
- consistent typography
- use concise labels only
- make it visually easy to compare the three pipelines

Color system:
- GREEN = empirically fitted parameters
- GREY = experimentally defined inputs
- RED = fixed assumptions or deterministic transforms
- Use BLUE title/accent only for the proactive stage header
- Use ORANGE title/accent only for the reactive stage header
- Use DARK RED title/accent only for the inhibition stage header
- Do not use these stage colors for parameter-type boxes; parameter-type colors must remain:
  - green fitted
  - grey experimental
  - red fixed assumptions

Page layout:
- one page
- three rows stacked vertically
- each row is a left-to-right pipeline:
  Inputs → EV computation → probability / control mapping → behavioral consequence
- put a compact legend in the bottom-right corner
- keep all row widths equal
- align corresponding columns across rows

Typography:
- Title at top center:
  “Meta-control computations in AX-CPT”
- Stage subtitles at far left of each row:
  “Cue-stage proactive control”
  “Probe-stage reactive control”
  “Probe-stage inhibition meta-control”
- use short labels, not paragraphs
- use italic only for compact conceptual captions under central computation boxes

Row 1: Cue-stage proactive control
Structure this row as:
[GREY box] Cue identity: A / B
[GREY box] Trial structure / frequencies
[GREY box] Load
[GREEN box] Reward sensitivity α
[GREEN box] Fast-response utility u_RT
[GREEN box] Control-cost / interference parameter(s)

→ arrow to

[RED box, larger] Expected value of intention setting
Label inside:
“EV_intention(cue)”
Small subtitle:
“prepare now if expected gain exceeds cost”

→ arrow to

[RED box] Logistic transform
Label:
“P(intention) = sigmoid(EV_intention)”

→ arrow to

two output boxes:
[BLUE-outline neutral fill] Intention set
[GREY-outline neutral fill] No intention

Row 2: Probe-stage reactive control
Structure this row as:
[GREY box] Probe identity: X / Y
[GREY box] Load
[GREEN box] Reward sensitivity α
[GREEN box] Recall / control-cost parameter(s)

→ arrow to

[RED box, larger] Expected value of rule recall
Label inside:
“EV_recall(probe)”
Small subtitle:
“retrieve rule if correction is worth the effort”

→ arrow to

[RED box] Logistic transform
Label:
“P(recall) = sigmoid(EV_recall)”

→ arrow to

two output boxes:
[ORANGE-outline neutral fill] Recall succeeds
[GREY-outline neutral fill] No recall

Row 3: Probe-stage inhibition meta-control
This row should clearly indicate that it only applies if an intention is already active.

Add at far left a small RED tag above the row:
“precondition: intention active”

Then structure this row as:
[GREY box] Probe identity: X / Y
[GREY box] Load
[GREEN box] Reward sensitivity α
[GREEN box] Fast-response utility u_RT
[GREEN box] Cost-sensitivity parameter(s)

→ arrow to

[RED box, larger] Expected value of control signal
Label inside:
“EV_control(c | probe) − cost(c)”
Small subtitle:
“modulate current intention if worth the effort”

→ arrow to

[RED box] Choose optimal control intensity
Label:
“c* = argmax”

→ arrow to

[RED box] Map control signal
Label:
“boost / inhibit / maintain”

→ arrow to

three output boxes:
[DARK RED-outline neutral fill] Intention inhibited
[BLUE-outline neutral fill] Intention maintained / boosted
[GREY-outline neutral fill] Downstream branch for recall or fallback

Visual details:
- Inputs boxes on the left should be grouped visually as a block
- EV box should be the visual center of each row
- probability / transform box should be slightly smaller than EV box
- output boxes should sit on the right
- use straight arrows only
- keep box corner radius subtle
- use thin borders
- avoid shadows unless extremely soft
- use faint grid alignment for professional consistency

Legend:
Include a small legend:
- green square: empirically fitted
- grey square: experimentally defined
- red square: fixed assumptions / deterministic computation

Also include a tiny note at the bottom:
“Behavioral response routes are determined downstream from these meta-control computations.”

Do not make this look like a flowchart for laypeople; make it look like a scientific computational-model figure for a methods talk or paper.