/** @format */

import React, { useState } from "react";

export default function AboutUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(data.message);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      alert(error.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative text-slate-900 animate-page"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/vector-high-speed-electric-train-260nw-2321709117.jpg')",
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Contact <span className="text-indigo-600">RailCoach</span>
          </h1>
          <p className="mt-3 text-slate-700 font-medium">
            Have questions or need support? We’re here to help.
          </p>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Get in Touch</h2>

            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Email:</strong> support@railcoach.com
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Office:</strong> Railway Operations HQ, India
              </p>
              <p className="text-sm text-slate-500">
                Our team usually responds within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card delay-200">
            <h2 className="text-xl font-bold mb-4">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                className="input resize-none"
              ></textarea>

              <button
                type="submit"
                className="btn flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loader"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          @keyframes pageIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-page {
            animation: pageIn 700ms ease-out both;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeUp 700ms ease-out both;
          }

          .card {
            background: white;
            border-radius: 1.25rem;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            animation: fadeUp 800ms ease-out both;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 18px 45px rgba(0,0,0,0.15);
          }
          .delay-200 {
            animation-delay: 200ms;
          }

          .input {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            transition: all 0.25s ease;
          }
          .input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
            transform: scale(1.01);
          }

          .btn {
            width: 100%;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            padding: 0.75rem;
            border-radius: 0.75rem;
            font-weight: 600;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99,102,241,0.4);
          }
          .btn:active {
            transform: scale(0.98);
          }
          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .loader {
            width: 18px;
            height: 18px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
