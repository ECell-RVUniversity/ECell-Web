"use client";

import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import talkStartupWithMe from "../assets/events/events_photo/TalkStartupWithMe.webp";
import winterTechTalk from "../assets/events/events_photo/WinterTechTalk.webp";
import argonyx from "../assets/events/events_photo/argonyx.webp";
import argonyx2 from "../assets/events/events_photo/argoynx2.jpg";
import "./EventsArchive.css";

type EventType = "Hackathons" | "Workshops" | "Talks" | "Competitions";
interface EventItem { date: string; month: string; type: EventType; title: string; description: string; image: StaticImageData; status: "UPCOMING" | "ARCHIVE"; }

const EVENTS: EventItem[] = [
  { date: "18", month: "SEP 2026", type: "Hackathons", title: "Argonyx Hackathon", description: "Build, break and reimagine. A hands-on challenge for ambitious builders.", image: argonyx, status: "UPCOMING" },
  { date: "08", month: "NOV 2026", type: "Workshops", title: "Talk Startup With Me", description: "From problem discovery to your first pitch — learn by building with people who have done it.", image: talkStartupWithMe, status: "UPCOMING" },
  { date: "21", month: "DEC 2025", type: "Talks", title: "Winter Tech Talk", description: "Builders and operators unpack the technologies shaping what comes next.", image: winterTechTalk, status: "ARCHIVE" },
  { date: "14", month: "SEP 2025", type: "Competitions", title: "Argonyx 2.0", description: "A room full of sharp questions, unfinished prototypes, and teams choosing to start anyway.", image: argonyx2, status: "ARCHIVE" },
];
const FILTERS = ["All", "Hackathons", "Workshops", "Talks", "Competitions"] as const;

export default function EventsArchive(): React.ReactElement {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selectedDate, setSelectedDate] = useState(0);
  const visibleEvents = useMemo(() => filter === "All" ? EVENTS : EVENTS.filter((event) => event.type === filter), [filter]);
  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-copy"><p className="events-eyebrow"><span /> EVENTS &amp; WORKSHOPS</p><h1>Where<br />ideas <em>get moving.</em></h1><p className="events-hero-intro">Talks, workshops, hackathons and founder sessions for people who want to build something real. Pick an event, bring a question, and leave with something started.</p><div className="events-actions"><a className="events-button events-button--primary" href="#events">EXPLORE EVENTS <span>→</span></a><a className="events-button" href="#calendar">BROWSE CALENDAR <span>↓</span></a></div></div>
        <div className="events-feature-wrap"><article className="events-feature"><div className="events-feature-art"><Image src={EVENTS[0].image} alt="Argonyx Hackathon" fill sizes="(max-width: 900px) 88vw, 40vw" /><span>UPCOMING · HACKATHON</span><strong>ARGONYX<br /><em>HACKATHON</em></strong></div><div className="events-feature-bottom"><div><h2>Argonyx<br />Hackathon</h2><p>18 — 20 SEP 2026 · RV UNIVERSITY, BENGALURU</p></div><b>↗</b></div></article></div>
      </section>
      <section className="events-content" id="calendar">
        <div className="events-section-head"><span>THE CALENDAR</span><span>{EVENTS.length.toString().padStart(2, "0")} EVENTS</span></div><div className="events-calendar"><div className="events-calendar-track">{EVENTS.map((event, index) => <button className={`events-date ${selectedDate === index ? "is-active" : ""}`} key={event.title} onClick={() => { setSelectedDate(index); setFilter("All"); }} type="button"><strong>{event.date}</strong><span>{event.month}</span><i /><b>{event.title}</b></button>)}</div></div>
        <div className="events-section-head" id="events"><span>UPCOMING EVENTS</span><span>VIEW ALL →</span></div><div className="events-filters" aria-label="Filter events">{FILTERS.map((item) => <button className={filter === item ? "is-active" : ""} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div>
        <div className="events-grid">{visibleEvents.map((event) => <article className="events-card" key={event.title}><div className="events-card-image"><Image src={event.image} alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /><span>{event.type}</span></div><div className="events-card-info"><div><h2>{event.title}</h2><p>{event.description}</p></div><time>{event.date}–{event.status === "UPCOMING" ? "20" : event.date}<br />{event.month.replace(" 2026", "").replace(" 2025", "")}</time></div></article>)}</div>
        <div className="events-archive"><div className="events-section-head"><span>THE ARCHIVE</span><span>{EVENTS.filter((event) => event.status === "ARCHIVE").length.toString().padStart(2, "0")} MOMENTS</span></div>{EVENTS.filter((event) => event.status === "ARCHIVE").map((event, index) => <div className="events-archive-row" key={event.title}><span>0{index + 1}</span><strong>{event.title}</strong><small>{event.type}</small><b>↗</b></div>)}</div>
      </section><footer className="events-footer"><span>ECELL RV UNIVERSITY</span><span>BUILD / FAIL / LEARN / REPEAT</span></footer>
    </main>
  );
}
