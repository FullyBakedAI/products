import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { description, name, startDate, endDate, apiKey } = await req.json();

    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "No API key provided" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: key });

    const system = `You draft detailed, practical travel itineraries. Return ONLY valid JSON (no fences, no prose). Shape:
{
  "name": "trip name",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "heroTitle": "one-line evocative title (HTML <em> for emphasis allowed)",
  "heroDesc": "two-sentence trip summary",
  "days": [
    {
      "id": "daySlug",
      "label": "short date label e.g. Jun 22",
      "sub": "headline for the day",
      "num": 1,
      "date": "YYYY-MM-DD",
      "heroPhoto": null,
      "stops": [
        {
          "time": "HH:MM",
          "name": "stop name",
          "loc": "precise address",
          "lat": 35.1234,
          "lng": 139.1234,
          "type": "food|sight|nature|hike|swim|transit|start|end|stay|drive",
          "icon": "one emoji",
          "desc": "a few sentences about what to do and why",
          "driveText": "only for type=drive: driving leg description"
        }
      ]
    }
  ]
}
Guidelines:
- 3–6 real stops per day with actual lat/lng
- Include type=stay for hotels/accommodation with checkIn/checkOut fields
- Add type=drive entries between geographically distant stops with driveText
- Be specific: real place names, real addresses, practical timings
- Include food, sights, nature variety`;

    const userMsg = `Trip request:
Name: ${name?.trim() || "(let me suggest one)"}
Dates: ${startDate || "flexible"} → ${endDate || "flexible"}
Description: ${description?.trim() || "(none)"}

Draft a complete itinerary as JSON only.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: userMsg }],
      system,
    });

    let text = (message.content[0] as { text: string }).text.trim();
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) text = fenced[1].trim();

    const parsed = JSON.parse(text);

    // Normalise
    const days = (parsed.days || []).map(
      (d: {
        id?: string;
        label?: string;
        sub?: string;
        num?: number;
        date?: string;
        heroPhoto?: string | null;
        stops?: unknown[];
      }, i: number) => ({
        id: d.id || `day${i + 1}`,
        label: d.label || `Day ${i + 1}`,
        sub: d.sub || "",
        num: d.num || i + 1,
        date: d.date || null,
        heroPhoto: d.heroPhoto || null,
        stops: (d.stops || []).map((s) => {
          const stop = s as Record<string, unknown>;
          return {
            ...stop,
            lat: typeof stop.lat === "number" ? stop.lat : undefined,
            lng: typeof stop.lng === "number" ? stop.lng : undefined,
          };
        }),
      })
    );

    const overview = {
      id: "overview",
      label: "Overview",
      sub: "All stops",
      isOverview: true,
      stops: [],
    };
    const stopCount = days.reduce(
      (n: number, d: { stops?: unknown[] }) =>
        n +
        ((d.stops || []) as Array<{ type?: string }>).filter(
          (s) => s.type !== "drive"
        ).length,
      0
    );

    const formatDateRange = (start?: string, end?: string) => {
      if (!start) return "";
      const fmt = (s: string) =>
        new Date(s).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      if (!end || end === start) return fmt(start);
      const a = new Date(start);
      const b = new Date(end);
      if (a.getFullYear() === b.getFullYear()) {
        const fmtNoYr = (s: string) =>
          new Date(s).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        return `${fmtNoYr(start)}–${fmtNoYr(end)}, ${a.getFullYear()}`;
      }
      return `${fmt(start)}–${fmt(end)}`;
    };

    const trip = {
      id: "trip-" + Date.now(),
      name: parsed.name || name?.trim() || "New trip",
      startDate: parsed.startDate || startDate || null,
      endDate: parsed.endDate || endDate || null,
      dates: formatDateRange(
        parsed.startDate || startDate,
        parsed.endDate || endDate
      ),
      heroTitle: parsed.heroTitle || parsed.name || name?.trim() || "New trip",
      heroDesc: parsed.heroDesc || description?.trim() || "",
      days: [overview, ...days],
      checklist: [],
      stats: [
        { val: String(days.length), lbl: "Days" },
        { val: String(stopCount), lbl: "Stops" },
      ],
    };

    return NextResponse.json({ trip });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
