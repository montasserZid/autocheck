"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { writeLocal } from "@/lib/localStorage";
import { contactTopics } from "@/content/contact";
export function ContactForm() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!String(data.name).trim() || !String(data.message).trim()) {
      setError("Enter your name and a message.");
      return;
    }
    if (
      !writeLocal("contact", { ...data, createdAt: new Date().toISOString() })
    ) {
      setError(
        "This browser could not save your message. Keep the text here and try again.",
      );
      return;
    }
    setSaved(true);
    setError("");
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <h2>How can we help?</h2>
      <p>Choose a topic so your message has the right context.</p>
      {saved && (
        <p className="notice" role="status">
          <Check size={20} />
          Your message is saved on this device. It has not been sent; support
          delivery is not enabled in this preview.
        </p>
      )}
      {error && (
        <p className="form-errors" role="alert">
          {error}
        </p>
      )}
      <label>
        Topic
        <select name="topic">
          {contactTopics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={6} required maxLength={4000} />
        <small>Do not include identity documents or payment details.</small>
      </label>
      <p className="fine-print">
        Messages can be prepared and saved here. They are not sent in this
        preview.
      </p>
      <button className="button button-primary" type="submit">
        Save Message
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
