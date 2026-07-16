import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal.jsx";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const empty = { from_name: "", to_email: "", title: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: formData.from_name,
          email: formData.to_email,
          subject: formData.title,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData(empty);
        setErrors({});
      } else {
        console.error("Web3Forms error:", data);
        setStatus("error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("error");
    }
  };

  const fieldClass = (name) =>
    `p-3 rounded-lg bg-th-bg/50 border text-th-fg focus:outline-none focus:ring-2 transition-colors placeholder:text-th-subtle ${
      errors[name]
        ? "border-red-500 focus:ring-red-500"
        : "border-[#D4AF37]/30 focus:ring-[#D4AF37]"
    }`;

  return (
    <section id="contact" className="py-20 px-6 bg-th-bg">
      <ScrollReveal className="flex flex-col items-center">
        <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-2">
          CONTACT
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          style={{ originX: 0.5 }}
          className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-6"
        />
        <p className="text-center text-th-body mb-10">
          Share your ideas, feedback, or collaboration proposals. I'll get back to you!
        </p>
      </ScrollReveal>

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl mx-auto bg-th-card/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
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

        <button
          type="button"
          onClick={() => setShowPrivacy(true)}
          className="text-center text-th-subtle text-xs mt-1 underline hover:text-[#D4AF37] transition-colors"
        >
          How is my data handled?
        </button>
      </motion.form>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrivacy(false)}
          >
            <div
              className="bg-th-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#D4AF37]/20 shrink-0">
                <h4 className="text-lg font-bold text-[#D4AF37]">How your data is handled</h4>
                <button
                  className="text-th-fg text-2xl font-bold leading-none"
                  onClick={() => setShowPrivacy(false)}
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-5 overflow-y-auto text-th-body text-sm leading-relaxed space-y-3">
                <p>
                  This contact form is processed by{" "}
                  <a
                    href="https://web3forms.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#D4AF37]"
                  >
                    Web3Forms
                  </a>
                  , a third-party form-to-email service. No backend or database of mine stores your submission.
                </p>
                <p>
                  <span className="text-th-fg font-semibold">What's collected:</span> the name, email, subject,
                  and message you enter above are forwarded directly to my inbox. Web3Forms does not retain
                  form submissions once delivered.
                </p>
                <p>
                  <span className="text-th-fg font-semibold">IP address:</span> Web3Forms logs your IP address,
                  browser type, and timestamp for spam and abuse prevention, and may share your IP/email with
                  its spam-filtering providers (CleanTalk, Akismet). These logs are periodically deleted.
                </p>
                <p>
                  <span className="text-th-fg font-semibold">What I do with it:</span> I only use your message
                  to reply to you. I don't add you to any mailing list or share your details elsewhere.
                </p>
                <p className="text-th-subtle text-xs pt-1">
                  For full details, see Web3Forms'{" "}
                  <a
                    href="https://web3forms.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#D4AF37]"
                  >
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
