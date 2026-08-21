"use client";

import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import talkStartupWithMe from "../assets/events/events_photo/TalkStartupWithMe.webp";
import winterTechTalk from "../assets/events/events_photo/WinterTechTalk.webp";
import argonyx from "../assets/events/events_photo/argonyx.webp";
import argonyx2 from "../assets/events/events_photo/argoynx2.webp";
import "./EventsArchive.css";

type EventType = "Hackathons" | "Talks" | "Competitions";
interface EventItem { date: string; month: string; type: EventType; title: string; description: string; image: StaticImageData; status: "UPCOMING" | "ARCHIVE"; }

const EVENTS: EventItem[] = [
  { date: "18", month: "SEP 2026", type: "Hackathons", title: "Argonyx 2.0", description: "Build, break and reimagine. A hands-on challenge for ambitious builders.", image: argonyx2, status: "UPCOMING" },
  { date: "TBA", month: "DATE TBA", type: "Competitions", title: "Pitch-e-thon", description: "Pitch your idea, get real feedback, and take your next step as a builder.", image: argonyx, status: "UPCOMING" },
  { date: "TBA", month: "DATE TBA", type: "Talks", title: "E-Summit", description: "A flagship gathering for ideas, founders, and the people building what comes next.", image: argonyx, status: "UPCOMING" },
  { date: "TBA", month: "SEP 2025", type: "Hackathons", title: "Argonyx Hackathon", description: "A hands-on hackathon for ambitious builders and bold ideas.", image: argonyx, status: "ARCHIVE" },
  { date: "TBA", month: "WINTER 2025", type: "Talks", title: "Winter Tech Talk", description: "Builders and operators unpack the technologies shaping what comes next.", image: winterTechTalk, status: "ARCHIVE" },
  { date: "TBA", month: "SPRING 2026", type: "Talks", title: "Talk Startup With Me", description: "From problem discovery to your first pitch — learn by building with people who have done it.", image: talkStartupWithMe, status: "ARCHIVE" },
];
const FILTERS = ["All", "Hackathons", "Talks", "Competitions"] as const;

export default function EventsArchive(): React.ReactElement {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selectedDate, setSelectedDate] = useState(0);
  const upcomingEvents = EVENTS.filter((event) => event.status === "UPCOMING");
  const archivedEvents = EVENTS.filter((event) => event.status === "ARCHIVE");
  const visibleEvents = useMemo(() => filter === "All" ? upcomingEvents : upcomingEvents.filter((event) => event.type === filter), [filter, upcomingEvents]);
  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-copy"><p className="events-eyebrow"><span /> EVENTS &amp; WORKSHOPS</p><h1>Where<br />ideas <em>get moving.</em></h1><p className="events-hero-intro">Talks, workshops, hackathons and founder sessions for people who want to build something real. Pick an event, bring a question, and leave with something started.</p><div className="events-actions"><a className="events-button events-button--primary" href="#events">EXPLORE EVENTS <span>→</span></a><a className="events-button" href="#calendar">BROWSE CALENDAR <span>↓</span></a></div></div>
        <div className="events-feature-wrap"><article className="events-feature"><div className="events-feature-art"><Image src={EVENTS[0].image} alt="Argonyx 2.0" fill sizes="(max-width: 900px) 88vw, 40vw" quality={85} priority loading="eager" /><span>UPCOMING · HACKATHON</span><strong>ARGONYX<br /><em>2.0</em></strong></div><div className="events-feature-bottom"><div><h2>Argonyx<br />2.0</h2><p>18 — 20 SEP 2026 · RV UNIVERSITY, BENGALURU</p></div><b>↗</b></div></article></div>
      </section>
      <section className="events-content" id="calendar">
        <div className="events-section-head"><span>THE CALENDAR</span><span>{upcomingEvents.length.toString().padStart(2, "0")} EVENTS</span></div><div className="events-calendar"><div className="events-calendar-track">{upcomingEvents.map((event, index) => <button className={`events-date ${selectedDate === index ? "is-active" : ""}`} key={event.title} onClick={() => { setSelectedDate(index); setFilter("All"); }} type="button"><strong>{event.date}</strong><span>{event.month}</span><i /><b>{event.title}</b></button>)}</div></div>
        <div className="events-section-head" id="events"><span>UPCOMING EVENTS</span><span>VIEW ALL →</span></div><div className="events-filters" aria-label="Filter events">{FILTERS.map((item) => <button className={filter === item ? "is-active" : ""} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div>
        <div className="events-grid">{visibleEvents.map((event) => <article className="events-card" key={event.title}><div className="events-card-image"><Image src={event.image} alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /><span>{event.type}</span></div><div className="events-card-info"><div><h2>{event.title}</h2><p>{event.description}</p></div><time>{event.date === "TBA" ? "DATE" : `${event.date}–${event.status === "UPCOMING" ? "20" : event.date}`}<br />{event.date === "TBA" ? "TBA" : event.month.replace(" 2026", "").replace(" 2025", "")}</time></div></article>)}</div>
        <div className="events-archive"><div className="events-section-head"><span>PREVIOUS EVENTS</span><span>{archivedEvents.length.toString().padStart(2, "0")} MOMENTS</span></div>{archivedEvents.map((event, index) => <div className="events-archive-row" key={event.title}><span>0{index + 1}</span><strong>{event.title}</strong><small>{event.type}</small><b>↗</b></div>)}</div>
      </section><footer className="events-footer"><span>ECELL RV UNIVERSITY</span><span>BUILD / FAIL / LEARN / REPEAT</span></footer>
    </main>
  );
}
