import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [formData, setFormData] = useState({ title: "", body: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // TODO: EmailJS config - userID, serviceID, templateID
    emailjs
      .send(
        "YOUR_SERVICE_ID", // service ID
        "YOUR_TEMPLATE_ID", // template ID
        {
          title: formData.title,
          message: formData.body,
        },
        "YOUR_PUBLIC_KEY" // public key
      )
      .then(
        (response) => {
          setStatus("Message sent! Thank you.");
          setFormData({ title: "", body: "" });
        },
        (error) => {
          console.error(error);
          setStatus("Oops! Something went wrong.");
        }
      );
  };

  return (
    <section id="contact" className="py-20 px-6 bg-[#0B132B]">
      <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-6">
        CONTACT
      </h2>
      <p className="text-center text-gray-300 mb-10">
        Share your ideas, feedback, or collaboration proposals. I’ll get back to you!
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-[#1C2541]/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          name="title"
          placeholder="Subject"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-3 rounded-lg bg-[#0B132B]/50 border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />

        <textarea
          name="body"
          placeholder="Message"
          value={formData.body}
          onChange={handleChange}
          rows={6}
          required
          className="p-3 rounded-lg bg-[#0B132B]/50 border border-[#D4AF37]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />

        <button
          type="submit"
          className="bg-[#D4AF37] text-[#0B132B] font-bold py-3 rounded-lg hover:scale-105 transition-transform"
        >
          Send
        </button>

        {status && <p className="text-center text-gray-300 mt-2">{status}</p>}
      </motion.form>
    </section>
  );
}