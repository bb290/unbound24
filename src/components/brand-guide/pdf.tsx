import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PROMPTS, PROMPTS_INTRO } from "@/content/brand-guide";
import { parse, runs } from "./markdown";

// The brand guide PDF. Loaded only when someone clicks "Download PDF" (keeps react-pdf out of the page bundle).

const INK = "#121318";
const CYAN = "#03C0E8";
const TEAL = "#40E0D0";
const CREAM = "#F8F0E3";
const MUTED = "#55575f";

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 64, paddingHorizontal: 54, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.5, color: INK, backgroundColor: "#FFFFFF" },
  band: { backgroundColor: CYAN, marginTop: -54, marginHorizontal: -54, paddingTop: 44, paddingBottom: 28, paddingHorizontal: 54, marginBottom: 22 },
  kicker: { fontFamily: "Courier", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  h1: { fontFamily: "Helvetica-Bold", fontSize: 28, lineHeight: 1.1 },
  h2: { fontFamily: "Helvetica-Bold", fontSize: 16, marginTop: 18, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: TEAL },
  h3: { fontFamily: "Helvetica-Bold", fontSize: 12.5, marginTop: 10, marginBottom: 3 },
  p: { marginBottom: 7 },
  li: { flexDirection: "row", marginBottom: 4, paddingRight: 8 },
  dot: { width: 14, color: CYAN, fontFamily: "Helvetica-Bold" },
  liText: { flex: 1 },
  bold: { fontFamily: "Helvetica-Bold" },
  prompt: { backgroundColor: CREAM, borderRadius: 8, padding: 12, marginBottom: 10 },
  promptTitle: { fontFamily: "Helvetica-Bold", fontSize: 12, marginBottom: 4 },
  footer: { position: "absolute", bottom: 28, left: 54, right: 54, flexDirection: "row", justifyContent: "space-between", fontSize: 8.5, color: MUTED },
});

function Rich({ text }: { text: string }) {
  return <>{runs(text).map((r, i) => <Text key={i} style={r.bold ? s.bold : undefined}>{r.text}</Text>)}</>;
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text>Made with the free brand guide at unbound24.com</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function GuideDoc({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);
  const title = blocks.find((b) => b.type === "h1")?.text ?? "Brand Guide";
  const body = blocks.filter((b) => b.type !== "h1");
  return (
    <Document title={title} author="Unbound24" creator="unbound24.com">
      <Page size="LETTER" style={s.page}>
        <View style={s.band}>
          <Text style={s.kicker}>Brand guide</Text>
          <Text style={s.h1}>{title}</Text>
        </View>
        {body.map((b, i) =>
          b.type === "h2" ? <Text key={i} style={s.h2} minPresenceAhead={40}>{b.text}</Text>
          : b.type === "h3" ? <Text key={i} style={s.h3} minPresenceAhead={30}>{b.text}</Text>
          : b.type === "li" ? <View key={i} style={s.li} wrap={false}><Text style={s.dot}>•</Text><Text style={s.liText}><Rich text={b.text} /></Text></View>
          : <Text key={i} style={s.p}><Rich text={b.text} /></Text>,
        )}
        <Footer />
      </Page>
      <Page size="LETTER" style={s.page}>
        <View style={s.band}>
          <Text style={s.kicker}>Put it to work</Text>
          <Text style={s.h1}>Prompts to use with your brand guide</Text>
        </View>
        <Text style={s.p}>{PROMPTS_INTRO}</Text>
        {PROMPTS.map((p, i) => (
          <View key={p.title} style={s.prompt} wrap={false}>
            <Text style={s.promptTitle}>{i + 1}. {p.title}</Text>
            <Text>{p.text}</Text>
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  );
}

export async function guidePdf(markdown: string): Promise<Blob> {
  return pdf(<GuideDoc markdown={markdown} />).toBlob();
}
