"use client";
import React, { useEffect, useRef, useState } from "react";
import LaserFlow from "../../components/LaserFlow";
import "./WhatsAppCommunity.css";

// this is the url for the whatsapp student community.
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/J0MfKUwIZ6J8WfemIBbdlJ";

export interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  { id: "welcome", sender: "bot", text: "Hey! I’m the ECell guide. Type a question below to ask about ECell, events, joining, or building your idea.", time: "11:42" },
];

export interface QAEntry {
  id: string;
  chipLabel: string;
  pattern: RegExp;
  reply: string;
}

export const COMMUNITY_QA_RULES: QAEntry[] = [
  {
    id: "greetings",
    chipLabel: "Say Hello",
    pattern: /\b(hi|hello|hey|yo|sup|greetings)\b/i,
    reply: "Hey there! 👋 Type any question about ECell, events, joining, or building your idea, and I'll be happy to help!",
  },
  {
    id: "about",
    chipLabel: "What is ECell?",
    pattern: /\b(what is|about)\b.*\b(ecell|ecell|entrepreneurship cell)\b|\b(what is ecell|what is ecell|about ecell|about ecell)\b|\b(about)\b/i,
    reply: "ECell RV University is the campus entrepreneurship community. We help students explore ideas, learn from founders, meet collaborators, and take their first steps towards building something impactful.",
  },
  {
    id: "join",
    chipLabel: "How to join?",
    pattern: /\b(join|register|registration|membership|how to join|where to register|sign up|volunteer)\b/i,
    reply: "Tap 'Join the community' above to join our official WhatsApp group! We share event registrations, core team recruitments, and collaboration opportunities directly in the community.",
  },
  {
    id: "events",
    chipLabel: "Upcoming events",
    pattern: /\b(event|events|workshop|workshops|talk|talks|session|sessions)\b/i,
    reply: "We're the driving force behind top entrepreneurial events at RVU! Our This year lineup is going to start from Kalpvikas, Pitch-e-thon, founder sessions, and workshops. Join our WhatsApp community to lock in your spot and never miss an update!",
  },
    {
    id: "eligibility",
    chipLabel: "Who can join?",
    pattern: /\b(who can|eligible|eligibility|can i|for who|who is it for|requirements)\b/i,
    reply: "Anyone at RV University curious about entrepreneurship can join! You don't need a startup or prior experience — just curiosity and a willingness to learn and build.",
  },
  {
    id: "benefits",
    chipLabel: "Why join?",
    pattern: /\b(what do|offer|benefits|why join|why ecell|why ecell|opportunity|opportunities)\b/i,
    reply: "ECell brings you founder talks, hands-on workshops, hackathons, pitch competitions, mentorship, and a vibrant builder community. It is the ultimate launchpad to turn your ideas into action.",
  },
  {
    id: "startup",
    chipLabel: "Have an idea?",
    pattern: /\b(idea|ideas|startup|startups|build|building|founder|founders|mentor|mentors|collaborate|co-founder|cofounder)\b/i,
    reply: "Have an idea or looking to start something? You don't need to have everything figured out yet. Share your idea in our community to find co-founders, access mentors, and start building!",
  },
  {
    id: "Kalpvikas",
    chipLabel: "dates for events",
    pattern: /\b(when is kalpvikas| kalpvikas|pitch-e-thon|when is pitch-e-thon|when is pitch-e-thon)\b/i,
    reply: "For now the dates of the events are not offical but you can join our whatsapp community to get updates and exact dates",
  },
  {
  id: "kalpvikas_details",
  chipLabel: "About Kalpvikas",
  pattern: /\b(what is kalpvikas|kalpvikas summit|kalpvikas event)\b/i,
  reply: "Kalpvikas is RVU flagship TECH FEST. It lats for 2 days and hosts many flagship TECH events. Ecell takes part in this and Hosts different events such as HACKATHONS and FOUNDERS TAlK and many more!",
  },
  {
  id: "pitchethon_details",
  chipLabel: "About Pitch-e-thon",
  pattern: /\b(what is pitch[-\s]?e[-\s]?thon|pitch competition|pitch contest|pitch event)\b/i,
  reply: "Pitch-e-thon is our high-energy startup pitch competition! Students pitch their ideas to a panel of founders and investors. It's a great way to test your idea, win prizes, and get real feedback. Exact dates will be announced in our WhatsApp community!",
  },
  {
    id: "cost",
    chipLabel: "Is it free?",
    pattern: /\b(cost|fee|fees|free|paid|payment|price|money|charge)\b/i,
    reply: "Joining the ECell WhatsApp community is 100% free! Core team membership is also free, while select flagship events may have nominal registration fees.",
  },
  {
    id: "team",
    chipLabel: "Core Team",
    pattern: /\b(team|members|member|who runs|core team|lead|leaders|board)\b/i,
    reply: "ECell is student-led by a passionate team of student builders and organizers at RV University. The core team has 8 members consists of Advisory head, Advisory, President, VP and leads of all teams. You can see them in team section",
  },
  {
    id: "interested",
    chipLabel: "Get Involved",
    pattern: /\b(interested|get involved|want to participate)\b/i,
    reply: "Awesome! We'd love to have you onboard. Tap 'Join the community' above to hop into our official WhatsApp group and get involved right away.",
  },
  {
    id: "contact",
    chipLabel: "Contact & Socials",
    pattern: /\b(contact|reach|instagram|email|social|socials|handle|link|connect)\b/i,
    reply: "The fastest way to stay connected is by joining our WhatsApp group! You can also follow ECell RV University on Instagram and social channels for regular updates.",
  },
  {
    id: "ecell_general",
    chipLabel: "ECell Info",
    pattern: /\b(ecell|ecell)\b/i,
    reply: "ECell RV University is the campus entrepreneurship hub. Tap 'Join the community' to connect with fellow builders and stay updated on all upcoming opportunities!",
  },
];

const DEFAULT_REPLY = "I can help with questions about ECell, joining the community, events, or building your startup idea. Type a question or tap one of the suggested topics below!";

const getAssistantReply = (message: string): string => {
  const query = message.toLowerCase().trim();
  const matchedRule = COMMUNITY_QA_RULES.find((rule) => rule.pattern.test(query));
  return matchedRule ? matchedRule.reply : DEFAULT_REPLY;
};

const timeNow = (): string => new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date());

export default function WhatsAppCommunity(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const replyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  // Decorative DOM is mounted after hydration so browser extensions cannot
  // make the server-rendered tree differ from React's first client render.
  const [isDecorativeReady, setIsDecorativeReady] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsDecorativeReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const messageList = messagesRef.current;
    if (messageList) {
      if (typeof messageList.scrollTo === "function") {
        messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
      } else {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
  }, []);

  const handleSelectQuestion = (questionLabel: string, replyText: string) => {
    if (isTyping) return;
    const cleanQuestion = questionLabel.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", text: cleanQuestion, time: timeNow() }]);
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((current) => [...current, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        time: timeNow(),
      }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isTyping) return;

    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", text, time: timeNow() }]);
    setDraft("");
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((current) => [...current, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: getAssistantReply(text),
        time: timeNow(),
      }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      className="whatsapp-community"
      id="community"
      aria-labelledby="community-heading"
    >
      {isDecorativeReady && (
        <div className="whatsapp-community-ambient-glow" aria-hidden="true" />
      )}
      <div className="wrap whatsapp-community-wrap">
        {isDecorativeReady && (
          <div className="whatsapp-laser-header" aria-hidden="true">
            <LaserFlow
              horizontalBeamOffset={0.0}
              verticalBeamOffset={0.0}
              verticalSizing={3.0}
              horizontalSizing={0.5}
              wispDensity={1.6}
              wispSpeed={11.5}
              wispIntensity={9.1}
              flowSpeed={0.33}
              flowStrength={0.08}
              fogIntensity={0.27}
              fogScale={0.21}
              fogFallSpeed={0.04}
              decay={1.1}
              falloffStart={1.2}
              color="#8EDCFF"
            />
          </div>
        )}
        <div className="whatsapp-community-card">
          <div className="whatsapp-community-copy">
            <span className="whatsapp-community-eyebrow">
              THE ECELL INNER CIRCLE
            </span>
            <h2 id="community-heading">
              <span>Your journey</span>
              <em>starts here.</em>
            </h2>
            <p>
              Meet builders, find your next collaborator, and be first in line for ECell opportunities.
            </p>
            <a
              className="whatsapp-community-cta"
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Join the community
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 5l5 5-5 5" />
              </svg>
            </a>
            <span className="whatsapp-community-note"><b>700+ students</b> are already in the loop.</span>
          </div>

          <div
            className="whatsapp-community-visual"
            aria-label="Preview of the ECell WhatsApp community"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="whatsapp-community-phone">
              <div className="whatsapp-community-phone-header">
                <span className="whatsapp-community-avatar">E</span>
                <span>
                  <b>ECell Community</b>
                  <small>700+ members</small>
                </span>
                <i>•••</i>
              </div>
              <div className="whatsapp-community-chat" aria-live="polite">
                <span className="whatsapp-community-chat-date">TODAY</span>
                <div ref={messagesRef} className="whatsapp-community-messages">
                  {messages.map((message) => (
                    <div
                      className={`whatsapp-community-message whatsapp-community-message-${message.sender}`}
                      key={message.id}
                    >
                      {message.sender === "bot" && <b>ECell Guide</b>}
                      {message.text}
                      <small>{message.time}</small>
                    </div>
                  ))}
                  {isTyping && <div className="whatsapp-community-typing"><i /><i /><i /> ECell Guide is typing</div>}
                </div>
                <div className="whatsapp-community-chips" role="group" aria-label="Suggested questions">
                  {COMMUNITY_QA_RULES.slice(1, 6).map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      className="whatsapp-community-chip"
                      onClick={() => handleSelectQuestion(rule.chipLabel, rule.reply)}
                      disabled={isTyping}
                    >
                      {rule.chipLabel}
                    </button>
                  ))}
                </div>
                <form className="whatsapp-community-composer" onSubmit={handleSendMessage}>
                  <label className="sr-only" htmlFor="community-message">Ask the ECell guide</label>
                  <input
                    ref={inputRef}
                    id="community-message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a question here..."
                    maxLength={280}
                    autoComplete="off"
                  />
                  <button type="submit" aria-label="Send message" disabled={!draft.trim() || isTyping}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.8 18-3.3-7-6.9-3.2L21 3Zm-11 11 4.1-4.1" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
