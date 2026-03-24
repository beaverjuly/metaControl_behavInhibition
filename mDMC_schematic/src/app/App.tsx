export default function App() {
  return (
    <div className="size-full flex items-center justify-center bg-white p-4 overflow-auto">
      <svg
        viewBox="0 0 1100 500"
        width="100%"
        style={{ maxWidth: 1100, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <Defs />

        {/* Title */}
        <text x={550} y={32} textAnchor="middle" fontSize={20} fill={C.text} fontWeight={500}>
          Two-stage meta-control model of responding in AX-CPT
        </text>

        {/* Single panel only */}
        <g transform="translate(0, 60)">
          <PanelA />
        </g>

        {/* Legend */}
        <Legend />
      </svg>
    </div>
  );
}

// ── Colors ──
const C = {
  blue: "#4A7FB5",
  blueBg: "#E8F0F8",
  blueB: "#A3C4E0",
  orange: "#D4853A",
  orangeBg: "#FDF0E4",
  orangeB: "#E8C4A0",
  gray: "#7A7A7A",
  grayBg: "#F0F0F0",
  grayB: "#C8C8C8",
  tBg: "#F5F5F5",
  tBorder: "#D0D0D0",
  text: "#2A2A2A",
  muted: "#777777",
};

// ── Shared geometry constants ──
const X1 = 160; // Cue / Set intention center
const X2 = 410; // Delay
const X3 = 660; // Probe / Recall center
const X4 = 910; // Response

// ── Marker defs ──
function Defs() {
  const mk = (id, color) => (
    <marker key={id} id={id} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <path d="M0,0.5 L7,3 L0,5.5" fill="none" stroke={color} strokeWidth="1.1" />
    </marker>
  );
  return (
    <defs>
      {mk("a-dark", C.text)}
      {mk("a-blue", C.blue)}
      {mk("a-ora", C.orange)}
      {mk("a-gray", C.gray)}
    </defs>
  );
}

// ── Primitives ──
function Box({
  cx,
  cy,
  w,
  h,
  fill,
  stroke,
  label,
  sub,
  labelColor = C.text,
  fs = 12,
  dashed = false,
}) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={7}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.2}
        strokeDasharray={dashed ? "5,3" : "none"}
      />
      <text
        x={cx}
        y={sub ? cy - 7 : cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={labelColor}
        fontSize={fs}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={C.muted}
          fontSize={12}
          fontStyle="italic"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function DiamondDecision({ cx, cy, w, h, fill, stroke, label, sub1, sub2 }) {
  const top = `${cx},${cy - h / 2}`;
  const right = `${cx + w / 2},${cy}`;
  const bottom = `${cx},${cy + h / 2}`;
  const left = `${cx - w / 2},${cy}`;
  const points = `${top} ${right} ${bottom} ${left}`;

  return (
    <g>
      <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize={14}>
        {label}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" fill={C.muted} fontSize={12} fontStyle="italic">
        {sub2}
      </text>
    </g>
  );
}

function Arr({ x1, y1, x2, y2, m, w = 1.2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={markerColor(m)} strokeWidth={w} markerEnd={`url(#${m})`} />;
}

function PathArr({ d, m, w = 1.2 }) {
  return <path d={d} fill="none" stroke={markerColor(m)} strokeWidth={w} markerEnd={`url(#${m})`} />;
}

function markerColor(m) {
  if (m.includes("blue")) return C.blue;
  if (m.includes("ora")) return C.orange;
  if (m.includes("gray")) return C.gray;
  return C.text;
}

// ── Y coordinates within panel ──
const TL_Y = 40; // timeline row
const D_Y = 130; // decision row
const S_Y = 220; // state row
const O_Y = 310; // output row
const BH = 34; // box height
const BW = 140; // standard box width
const DW = 170; // decision box width
const DH = 80; // decision box height

// State positions
const INT_X = X1;
const NOINT_X = 340;
const REC_X = X3;
const NOREC_X = X4;

// Output positions aligned vertically
const PREP_X = INT_X;
const RULE_X = REC_X;
const HABIT_X = NOREC_X;

// ── Model logic ──
function ModelLogic() {
  const dy = D_Y;
  const sy = S_Y;
  const oy = O_Y;

  const mergeY = sy + 45;

  return (
    <g>
      {/* Decision diamonds */}
      <DiamondDecision
        cx={X1}
        cy={dy}
        w={DW}
        h={DH}
        fill={C.blueBg}
        stroke={C.blue}
        label="Set intention?"
        sub1="proactive control"
        sub2="P(intention setting)"
      />
      <DiamondDecision
        cx={X3}
        cy={dy}
        w={DW}
        h={DH}
        fill={C.orangeBg}
        stroke={C.orange}
        label="Recall cue / rule?"
        sub1="reactive control"
        sub2="P(reactive recall)"
      />

      {/* State boxes: dashed contours */}
      <Box
        cx={INT_X}
        cy={sy}
        w={BW}
        h={BH}
        fill={C.blueBg}
        stroke={C.blueB}
        label="Intention set"
        labelColor={C.blue}
        fs={14}
        dashed
      />
      <Box
        cx={NOINT_X}
        cy={sy}
        w={BW}
        h={BH}
        fill={C.grayBg}
        stroke={C.grayB}
        label="No intention set"
        labelColor={C.gray}
        fs={14}
        dashed
      />
      <Box
        cx={REC_X}
        cy={sy}
        w={BW}
        h={BH}
        fill={C.orangeBg}
        stroke={C.orangeB}
        label="Recall succeeds"
        labelColor={C.orange}
        fs={14}
        dashed
      />
      <Box
        cx={NOREC_X}
        cy={sy}
        w={BW}
        h={BH}
        fill={C.grayBg}
        stroke={C.grayB}
        label="No recall"
        labelColor={C.gray}
        fs={14}
        dashed
      />

      {/* Decision -> State arrows from bottom / side vertices */}
      {/* Set intention? -> Intention set (yes) from bottom vertex */}
      <Arr x1={X1} y1={dy + DH / 2} x2={INT_X} y2={sy - BH / 2 - 2} m="a-blue" />
      <text x={X1 - 24} y={dy + DH / 2 + 20} fontSize={12} fill={C.blue}>
        yes
      </text>

      {/* Set intention? -> No intention set (no) from right vertex */}
      <PathArr d={`M${X1 + DW / 2},${dy} H${NOINT_X} V${sy - BH / 2 - 2}`} m="a-gray" />
      <text x={(X1 + DW / 2 + NOINT_X) / 2} y={dy - 8} textAnchor="middle" fontSize={12} fill={C.gray}>
        no
      </text>

      {/* Recall cue/rule? -> Recall succeeds (yes) from bottom vertex */}
      <Arr x1={X3} y1={dy + DH / 2} x2={REC_X} y2={sy - BH / 2 - 2} m="a-ora" />
      <text x={X3 - 24} y={dy + DH / 2 + 20} fontSize={12} fill={C.orange}>
        yes
      </text>

      {/* Recall cue/rule? -> No recall (no) from right vertex */}
      <PathArr d={`M${X3 + DW / 2},${dy} H${NOREC_X} V${sy - BH / 2 - 2}`} m="a-gray" />
      <text x={(X3 + DW / 2 + NOREC_X) / 2} y={dy - 8} textAnchor="middle" fontSize={12} fill={C.gray}>
        no
      </text>

      {/* Output boxes */}
      <Box cx={PREP_X} cy={oy} w={160} h={BH} fill={C.blueBg} stroke={C.blue} label="Prepared response" labelColor={C.blue} fs={14} />
      <Box cx={RULE_X} cy={oy} w={180} h={BH} fill={C.orangeBg} stroke={C.orange} label="Rule-based response" labelColor={C.orange} fs={14} />
      <Box cx={HABIT_X} cy={oy} w={200} h={BH} fill={C.grayBg} stroke={C.gray} label="Habit / default response" labelColor={C.gray} fs={14} />

      {/* State -> Output arrows */}
      <PathArr d={`M${INT_X},${sy + BH / 2} V${oy - BH / 2 - 2}`} m="a-blue" />
      <PathArr d={`M${REC_X},${sy + BH / 2} V${oy - BH / 2 - 2}`} m="a-ora" />

      {/* Joined path: No intention set + No recall -> Habit/default */}
      <path d={`M${NOINT_X},${sy + BH / 2} V${mergeY} H${NOREC_X}`} fill="none" stroke={C.gray} strokeWidth={1.2} />
      <PathArr d={`M${NOREC_X},${sy + BH / 2} V${oy - BH / 2 - 2}`} m="a-gray" />
      <text x={(NOINT_X + NOREC_X) / 2} y={mergeY - 6} textAnchor="middle" fontSize={12} fill={C.muted} fontStyle="italic">
        both fail
      </text>
    </g>
  );
}

// ── Panel ──
function PanelA() {
  return (
    <g>
      {/* Timeline band */}
      <rect x={50} y={TL_Y - 35} width={950} height={60} rx={5} fill={C.tBg} stroke={C.tBorder} strokeWidth={0.6} opacity={0.7} />
      <text x={65} y={TL_Y - 22} fontSize={12} fill={C.muted} opacity={0.8}>
        TASK TIMELINE
      </text>

      {/* Timeline boxes */}
      <Box cx={X1} cy={TL_Y} w={BW} h={BH} fill={C.tBg} stroke={C.tBorder} label="Cue (A or B)" fs={14} />
      <Box cx={X2} cy={TL_Y} w={BW} h={BH} fill={C.tBg} stroke={C.tBorder} label="Delay period" fs={14} />
      <Box cx={X3} cy={TL_Y} w={BW} h={BH} fill={C.tBg} stroke={C.tBorder} label="Probe (X or Y)" fs={14} />
      <Box cx={X4} cy={TL_Y} w={BW} h={BH} fill={C.tBg} stroke={C.tBorder} label="Response" fs={14} />

      {/* Timeline arrows */}
      <Arr x1={X1 + BW / 2 + 2} y1={TL_Y} x2={X2 - BW / 2 - 2} y2={TL_Y} m="a-dark" />
      <Arr x1={X2 + BW / 2 + 2} y1={TL_Y} x2={X3 - BW / 2 - 2} y2={TL_Y} m="a-dark" />
      <Arr x1={X3 + BW / 2 + 2} y1={TL_Y} x2={X4 - BW / 2 - 2} y2={TL_Y} m="a-dark" />

      {/* Timeline -> decision arrows into top vertices of diamonds */}
      <Arr x1={X1} y1={TL_Y + BH / 2} x2={X1} y2={D_Y - DH / 2 - 2} m="a-blue" />
      <Arr x1={X3} y1={TL_Y + BH / 2} x2={X3} y2={D_Y - DH / 2 - 2} m="a-ora" />

      {/* Model logic */}
      <ModelLogic />
    </g>
  );
}

// ── Legend ──
function Legend() {
  const lx = 1005;
  const ly = 74;

  const swatch = (y, fill, stroke, label, dashed = false) => (
    <g key={label}>
      <rect x={lx} y={y} width={14} height={10} rx={3} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "5,3" : "none"} />
      <text x={lx + 20} y={y + 8} fontSize={12} fill={C.text}>
        {label}
      </text>
    </g>
  );

  return (
    <g>
      <text x={lx} y={ly} fontSize={12} fill={C.muted} fontWeight={500}>
        LEGEND
      </text>
      {swatch(ly + 8, C.blueBg, C.blue, "Proactive")}
      {swatch(ly + 28, C.orangeBg, C.orange, "Reactive")}
      {swatch(ly + 48, C.grayBg, C.grayB, "Default")}
      {swatch(ly + 68, "white", C.grayB, "State nodes", true)}
    </g>
  );
}