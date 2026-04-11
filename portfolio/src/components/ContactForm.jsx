import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const AUTO_REPLY_TEMPLATE_ID = import.meta.env.VITE_AUTO_REPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

const empty = { from_name: "", to_email: "", title: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {
      from_name: !formData.from_name.trim(),
      to_email: !formData.to_email.trim(),
      title: !formData.title.trim(),
      message: !formData.message.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.from_name,
          to_email: formData.to_email,
          title: formData.title,
          message: formData.message,
          time: new Date().toLocaleString(),
        },
        PUBLIC_KEY
      )
      .then(() => {
        emailjs.send(
          SERVICE_ID,
          AUTO_REPLY_TEMPLATE_ID,
          {
            name: formData.from_name,
            to_email: formData.to_email,
            title: formData.title,
            message: formData.message,
            time: new Date().toLocaleString(),
          },
          PUBLIC_KEY
        );
        setStatus("success");
        setFormData(empty);
        setErrors({});
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  };

  const fieldClass = (name) =>
    `p-3 rounded-lg bg-[#0B132B]/50 border text-white focus:outline-none focus:ring-2 transition-colors ${
      errors[name]
        ? "border-red-500 focus:ring-red-500"
        : "border-[#D4AF37]/30 focus:ring-[#D4AF37]"
    }`;

  return (
    <section id="contact" className="py-20 px-6 bg-[#0B132B]">
      <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-6">
        CONTACT
      </h2>
      <p className="text-center text-gray-300 mb-10">
        Share your ideas, feedback, or collaboration proposals. I'll get back to you!
      </p>

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl mx-auto bg-[#1C2541]/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Row: name + email — stacks vertically on mobile */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <input
              type="text"
              name="from_name"
              placeholder="Your name"
              value={formData.from_name}
              onChange={handleChange}
              className={fieldClass("from_name")}
            />
            {errors.from_name && (
              <span className="text-red-500 text-xs px-1">Name is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <input
              type="email"
              name="to_email"
              placeholder="Your email"
              value={formData.to_email}
              onChange={handleChange}
              className={fieldClass("to_email")}
            />
            {errors.to_email && (
              <span className="text-red-500 text-xs px-1">Email is required</span>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="title"
            placeholder="Subject"
            value={formData.title}
            onChange={handleChange}
            className={fieldClass("title")}
          />
          {errors.title && (
            <span className="text-red-500 text-xs px-1">Subject is required</span>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={fieldClass("message")}
          />
          {errors.message && (
            <span className="text-red-500 text-xs px-1">Message is required</span>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-[#D4AF37] text-[#0B132B] font-bold py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>

        {status === "success" && (
          <p className="text-center text-green-400 mt-1">Message sent! I'll get back to you soon.</p>
        )}
        {status === "error" && (
          <p className="text-center text-red-400 mt-1">Something went wrong. Please try again.</p>
        )}
      </motion.form>
    </section>
  );
}
