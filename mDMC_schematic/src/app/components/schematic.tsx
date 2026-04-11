import React, { useMemo, useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/* ─── KaTeX renderer ─── */
function Tex({ math, display }: { math: string; display?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(math, { throwOnError: false, displayMode: !!display }),
    [math, display]
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ─── Colours ─── */
const C = {
  green: { bg: "#e8f5e9", border: "#4caf50", text: "#2e7d32" },      // model parameters
  grey: { bg: "#f5f5f5", border: "#9e9e9e", text: "#424242" },       // task-defined inputs
  white: { bg: "#ffffff", border: "#111827", text: "#111827" },      // model constants / assumptions (box color only)
  red: { bg: "#fce4ec", border: "#e53935", text: "#b71c1c" },         // deterministic transforms / computed quantities
  blue: { bg: "#ffffff", border: "#1976d2", text: "#1565c0" },
  orange: { bg: "#ffffff", border: "#ef6c00", text: "#e65100" },
  darkred: { bg: "#ffffff", border: "#8b0000", text: "#8b0000" },
  greyOutline: { bg: "#ffffff", border: "#9e9e9e", text: "#616161" },
};

type ColorKey = keyof typeof C;

/* ─── Box ─── */
function Box({
  color,
  children,
  style,
}: {
  color: ColorKey;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const c = C[color];
  return (
    <div
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 4,
        padding: "6px 10px",
        color: c.text,
        fontSize: 16,
        lineHeight: 1.4,
        textAlign: "center",
        whiteSpace: "nowrap", // keep formulas/items in one line
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Red computation box with math formula underneath ─── */
function CompBox({
  label,
  subtitle,
  formulaLines,
  style,
  boxStyle,
}: {
  label: React.ReactNode;
  subtitle: string;
  formulaLines: string[];
  style?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, ...style }}>
      <Box color="red" style={{ padding: "10px 16px", whiteSpace: "normal", ...boxStyle }}>
        <div style={{ fontSize: 18 }}>{label}</div>
        {subtitle && (
          <div style={{ fontStyle: "italic", fontSize: 14, color: "#888", marginTop: 3 }}>{subtitle}</div>
        )}
      </Box>
      <div
        style={{
          fontSize: 14,
          color: "#555",
          background: "#fafafa",
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          padding: "5px 10px",
          textAlign: "center",
          lineHeight: 1.7,
          whiteSpace: "nowrap", // keep each formula line in one line
        }}
      >
        {formulaLines.map((f, i) => (
          <div key={i}>
            <Tex math={f} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Arrow ─── */
function Arrow() {
  const len = 50;
  return (
    <svg width={len} height={16} viewBox={`0 0 ${len} 15`} style={{ flexShrink: 0 }}>
      <line x1={0} y1={8} x2={len - 8} y2={8} stroke="#ff7b7b" strokeWidth={5} />
      <polygon points={`${len - 8},0 ${len},8 ${len - 8},16`} fill="#ff7b7b" />
    </svg>
  );
}

/* ─── Split input group ─── */
function SplitInputs({
  greyItems,
  greenItems,
  whiteItems,
}: {
  greyItems: React.ReactNode[];
  greenItems: React.ReactNode[];
  whiteItems?: React.ReactNode[];
}) {
  const groupStyle = (borderColor: string, bg: string): React.CSSProperties => ({
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "8px 8px",
    border: `1.5px dashed ${borderColor}`,
    borderRadius: 4,
    background: bg,
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={groupStyle("#bbb", "#fafafa")}>{greyItems}</div>
      {!!whiteItems?.length && <div style={groupStyle("#000000", "#e1e1e1")}>{whiteItems}</div>}
      <div style={groupStyle("#81c784", "#f6fdf6")}>{greenItems}</div>
    </div>
  );
}

/* ─── Fixed-width column ─── */
function Col({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Legend ─── */
function Legend() {
  const items = [
    { border: C.green.border, bg: C.green.bg, label: "Model parameter (free or fitted)" },
    { border: C.grey.border, bg: C.grey.bg, label: "Task-defined input" },
    // This swatch corresponds to your grey background group for constants/assumptions:
    { border: "#000000", bg: "#c4c4c4", label: "Constant / assumption" },
    { border: C.red.border, bg: C.red.bg, label: "Deterministic transform" },
  ];

  return (
    <div style={{ display: "flex", gap: 18, fontSize: 19, color: "#555", alignItems: "center", flexWrap: "wrap" }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: item.bg,
              border: `1.5px solid ${item.border}`,
              borderRadius: 3,
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}

/* ─── Column widths ─── */
const W = {
  inputs: 320,
  arrow: 60,
  ev: 340,
  control: 330,
  prob: 370,
  output: 220,
};

function useFitScale(baseWidth: number, baseHeightGuess: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 24;

      const sx = (vw - pad) / baseWidth;
      const sy = (vh - pad) / baseHeightGuess;

      const s = Math.min(1, sx, sy);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [baseWidth, baseHeightGuess]);

  return { ref, scale };
}

/* ═══════════════════════════════════════════════════════ */
export function Schematic() {
  const colH: React.CSSProperties = {
    fontSize: 16,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
  };

  const baseWidth = W.inputs + W.ev + W.control + W.prob + W.output + W.arrow * 4 + 80;
  const baseHeightGuess = 820;

  const { ref, scale } = useFitScale(baseWidth, baseHeightGuess);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "auto",
        background: "#fff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ width: baseWidth * scale, minWidth: baseWidth * scale }}>
        <div
          style={{
            width: baseWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: "#fff",
            padding: "32px 40px 24px",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", fontSize: 25, letterSpacing: 0.4, color: "#222", marginBottom: 28, whiteSpace: "nowrap" }}>
            Meta-control computations in Process Model
          </div>

          {/* Column headers */}
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ width: W.inputs, flexShrink: 0, ...colH }}>Params & Inputs</div>
            <div style={{ width: W.arrow, flexShrink: 0 }} />
            <div style={{ width: W.ev, flexShrink: 0, ...colH }}>Expected Benefit</div>
            <div style={{ width: W.arrow, flexShrink: 0 }} />
            <div style={{ width: W.control, flexShrink: 0, ...colH }}>Cost-Adjusted Benefit</div>
            <div style={{ width: W.arrow, flexShrink: 0 }} />
            <div style={{ width: W.prob, flexShrink: 0, ...colH }}>Probability Conversion</div>
            <div style={{ width: W.arrow, flexShrink: 0 }} />
            <div style={{ width: W.output, flexShrink: 0, ...colH }}>Output</div>
          </div>

          <div style={{ borderBottom: "1.5px solid #e0e0e0", marginBottom: 28 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {/* ═══════ Row 1: Proactive ═══════ */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Col width={W.inputs}>
                <SplitInputs
                  greyItems={[
                    <Box key="a" color="grey">Cue identity: A / B</Box>,
                    <Box key="b" color="grey">Trial structure / frequencies</Box>,
                    <Box key="c" color="grey">Contextual load</Box>,
                  ]}
                  greenItems={[
                    <Box key="d" color="green"><Tex math="\text{Reward sensitivity } \alpha" /></Box>,
                    <Box key="e" color="green"><Tex math="\text{Fast-response utility } u_{\Delta t}" /></Box>,
                    <Box key="f" color="green"><Tex math="\text{Load-interference strength } \lambda" /></Box>,
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.ev}>
                <CompBox
                  label={<Tex math="EV_{\text{int}}(\text{cue})" />}
                  subtitle="value of setting an intention for this cue"
                  formulaLines={[
                    "\\{-0.105\\,\\alpha + u_{\\Delta t},\\; 0.420\\,\\alpha + u_{\\Delta t}\\}",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.control}>
                <CompBox
                  label={<Tex math="\ell_{\text{cue}}" />}
                  subtitle=""
                  formulaLines={[
                    "\\ell_{\\text{cue}} = EV_{\\text{int}} - \\lambda \\cdot \\text{load}",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.prob}>
                <CompBox
                  label={<Tex math="P(\text{intention})" />}
                  subtitle="probability of setting an intention"
                  formulaLines={[
                    "P(\\text{intention}) = \\sigma(\\ell_{\\text{cue}})",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.output}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Box color="blue">Intention set</Box>
                  <Box color="greyOutline">No intention</Box>
                </div>
              </Col>
            </div>

            {/* ═══════ Row 2: Reactive ═══════ */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Col width={W.inputs}>
                <SplitInputs
                  greyItems={[
                    <Box key="a" color="grey">Probe identity: X / Y</Box>,
                    <Box key="b" color="grey">Trial structure / frequencies</Box>,
                    <Box key="c" color="grey">Contextual load</Box>,
                  ]}
                  greenItems={[
                    <Box key="d" color="green"><Tex math="\text{Reward sensitivity } \alpha" /></Box>,
                    <Box key="e" color="green"><Tex math="\text{Fast-response utility } u_{\Delta t}" /></Box>,
                    <Box key="f" color="green"><Tex math="\text{Recall-success degradation } \gamma" /></Box>,
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.ev}>
                <CompBox
                  label={<Tex math="EV_{\text{recall}}(\text{probe})" />}
                  subtitle="value of recalling the rule for this probe"
                  formulaLines={[
                    "\\{0.2188\\,\\alpha - u_{\\Delta t},\\; 0.1250\\,\\alpha - u_{\\Delta t}\\}",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.control}>
                <CompBox
                  label={<Tex math="\ell_{\text{recall}}" />}
                  subtitle=""
                  formulaLines={[
                    "\\ell_{\\text{recall}} = EV_{\\text{recall}}",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.prob}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <Box color="red" style={{ padding: "10px 16px", whiteSpace: "normal" }}>
                    <div style={{ fontSize: 18 }}><Tex math="P(\text{correct} \mid \text{recall})" /></div>
                    <div style={{ fontStyle: "italic", fontSize: 14, color: "#888", marginTop: 3 }}>probability of engaging recall</div>
                  </Box>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#555",
                      background: "#fafafa",
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                      padding: "5px 10px",
                      textAlign: "center",
                      lineHeight: 1.7,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div><Tex math="P(\text{correct} \mid \text{recall}) = 1 - \gamma(\text{load} - 1)" /></div>
                  </div>
                </div>
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.output}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Box color="orange">Recall succeeds</Box>
                  <Box color="greyOutline">No recall</Box>
                </div>
              </Col>
            </div>

            {/* ═══════ Row 3: Inhibition ═══════ */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Col width={W.inputs}>
                <SplitInputs
                  greyItems={[
                    <Box key="a" color="grey">Probe identity: X / Y</Box>,
                    <Box key="c" color="grey">Contextual load</Box>,
                  ]}
                  whiteItems={[
                    <Box key="wI" color="white">State of active intention: <Tex math="I = 1" /></Box>,
                    <Box key="wc0" color="white"><Tex math="\text{Baseline P(enforce intention)}= c_0" /></Box>,
                  ]}
                  greenItems={[
                    <Box key="e" color="green"><Tex math="\text{Load-interference strength } \lambda" /></Box>,
                    <Box key="f" color="green"><Tex math="\text{Cost of control intensity } \delta" /></Box>,
                    <Box key="g" color="green"><Tex math="\text{Reward sensitivity } \alpha" /></Box>,
                    <Box key="h" color="green"><Tex math="\text{Fast-response utility } u_{\Delta t}" /></Box>,
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.ev}>
                <CompBox
                  label={<Tex math="EV_{\text{ctrl}}(c \mid \text{probe})" />}
                  subtitle="value of applying control intensity c to the active intention"
                  formulaLines={[
                    "\\{(0.1055\\,\\alpha + u_{\\Delta t})\\,c,\\;",
                    "(-0.4200\\,\\alpha + u_{\\Delta t})\\,c\\}",
                  ]}
                />
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.control}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <Box color="red" style={{ padding: "10px 16px", whiteSpace: "normal" }}>
                    <div style={{ fontSize: 18 }}><Tex math="\text{Adjustment to baseline } c^*" /></div>
                    <div style={{ fontStyle: "italic", fontSize: 14, color: "#888", marginTop: 4, textAlign: "left", lineHeight: 1.5 }}>
                      <div>Find <Tex math="c"/> that maximizes benefit minus cost:</div>
                      <div style={{ paddingLeft: 10, marginTop: 3 }}>1.&thinsp;positive <Tex math="c"/> → boost intention</div>
                      <div style={{ paddingLeft: 10 }}>2.&thinsp;negative <Tex math="c"/> → inhibit intention</div>
                      <div style={{ paddingLeft: 10 }}>3.&thinsp;same <Tex math="c"/> → maintain intention</div>
                    </div>
                  </Box>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#555",
                      background: "#fafafa",
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                      padding: "5px 10px",
                      textAlign: "center",
                      lineHeight: 1.7,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tex math="c^* = \arg\max_c \big(EV_{\text{ctrl}} - (e^{\delta |c|} - 1)\big)" />
                  </div>
                </div>
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.prob}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <Box color="red" style={{ padding: "10px 16px", whiteSpace: "normal" }}>
                    <div style={{ fontSize: 18 }}><Tex math="P(\text{inhibit intention} \mid c^*)" /></div>
                    <div style={{ fontSize: 18 }}><Tex math="P(\text{enforce intention} \mid c^*)" /></div>
                    <div style={{ fontStyle: "italic", fontSize: 14, color: "#888", marginTop: 3 }}>
                      turn optimal control intensity into inhibition probability
                    </div>
                  </Box>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#555",
                      background: "#fafafa",
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                      padding: "5px 10px",
                      textAlign: "center",
                      lineHeight: 1.7,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div><Tex math="P(\text{enforce} \mid c^*) = (c_0 + c^*)(1 - \lambda \cdot \text{load})" /></div>
                    <div><Tex math="P(\text{inhibit} \mid c^*) = (1 - (c_0 + c^*))(1 - \lambda \cdot \text{load})" /></div>
                  </div>
                </div>
              </Col>

              <Col width={W.arrow}><Arrow /></Col>

              <Col width={W.output}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Box color="darkred">Intention inhibited</Box>
                  <Box color="blue">Intention enforced</Box>
                </div>
              </Col>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28, gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 18, color: "#aaa", fontStyle: "italic", whiteSpace: "nowrap" }}>
              Behavioral response routes are determined downstream from these meta-control computations.
            </div>
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}