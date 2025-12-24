import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { Mail, User, Sparkles, CheckCircle, Loader2, ArrowRight, Lightbulb, Palette, Calendar, Share2, TrendingUp, Target, Zap } from "lucide-react";
import animationData from "../assets/contentNova.json";

const Hero = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const introSteps = [
        // Original hook slides
        {
            type: "hook",
            icon: Target,
            question: "Content creator?",
            secondLine: "Or just love sharing on social media?",
            subtext: "Either way, this is for you.",
            gradient: "from-blue-500 to-cyan-400"
        },
        {
            type: "hook",
            icon: Zap,
            question: "Tired of juggling 10+ tools?",
            subtext: "Ideation here, writing there, scheduling somewhere else...",
            gradient: "from-orange-500 to-red-500"
        },
        // Problem/Solution slides
        {
            type: "problem",
            icon: Lightbulb,
            problem: "What should I create today?",
            solution: "No more blank page paralysis.",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            type: "problem",
            icon: Palette,
            problem: "How do I make this fast & high quality?",
            solution: "AI-assisted. Human-led.",
            gradient: "from-purple-500 to-primary"
        },
        {
            type: "problem",
            icon: Calendar,
            problem: "How do I keep track of it all?",
            solution: "One calendar. Every channel.",
            gradient: "from-blue-500 to-cyan-400"
        },
        {
            type: "problem",
            icon: Share2,
            problem: "When and where should I post?",
            solution: "Data-driven. Never guessing.",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            type: "problem",
            icon: TrendingUp,
            problem: "Is this actually performing?",
            solution: "Real insights. Real growth.",
            gradient: "from-green-500 to-emerald-400"
        },
        // The big reveal
        {
            type: "reveal",
            tagline: "One workspace. Every stage. Zero chaos."
        }
    ];

    const totalSteps = introSteps.length;

    // Lock scroll during intro slides
    useEffect(() => {
        if (!showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showForm]);

    // Auto-advance through steps
    useEffect(() => {
        if (currentStep < totalSteps && !showForm) {
            const duration = currentStep < 2 ? 2500 : currentStep === totalSteps - 1 ? 3500 : 2800;
            const timer = setTimeout(() => {
                if (currentStep === totalSteps - 1) {
                    setShowForm(true);
                } else {
                    setCurrentStep(prev => prev + 1);
                }
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [currentStep, showForm]);

    const skipToForm = () => {
        setCurrentStep(totalSteps - 1);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (status === "error") setStatus("idle");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim()) {
            setStatus("error");
            setErrorMessage("Please enter your first name");
            return;
        }
        if (!formData.lastName.trim()) {
            setStatus("error");
            setErrorMessage("Please enter your last name");
            return;
        }
        if (!formData.email || !formData.email.includes("@")) {
            setStatus("error");
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setStatus("loading");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("First Name", formData.firstName);
            formDataToSend.append("Last Name", formData.lastName);
            formDataToSend.append("Email", formData.email);

            await fetch(
                "https://script.google.com/macros/s/AKfycbxnepi2n8r2ohBY_-vHxxFTlWb1WwBP0mk6w1atKozMj6mpK9x949_wegMTFivAuEsg/exec",
                { method: "POST", mode: "no-cors", body: formDataToSend }
            );

            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "" });
        } catch (error) {
            setStatus("error");
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    const currentStepData = introSteps[currentStep];

    return (
        <section className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-white flex items-center pt-20 overflow-hidden relative">

            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl"
                />
            </div>

            {/* Skip Button */}
            {!showForm && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    onClick={skipToForm}
                    className="absolute top-24 right-8 text-sm text-gray-400 hover:text-primary transition-colors z-20"
                >
                    Skip →
                </motion.button>
            )}

            <div className="container-custom section-padding relative z-10">
                <AnimatePresence mode="wait">

                    {/* Hook Slides (Steps 0-1) */}
                    {currentStepData?.type === "hook" && !showForm && (
                        <motion.div
                            key={`hook-${currentStep}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center mb-6 sm:mb-8 shadow-lg`}
                            >
                                {React.createElement(currentStepData.icon, { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" })}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2"
                            >
                                {currentStepData.question}
                            </motion.h1>

                            {currentStepData.secondLine && (
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-600 mb-4"
                                >
                                    {currentStepData.secondLine}
                                </motion.h2>
                            )}

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: currentStepData.secondLine ? 0.7 : 0.5 }}
                                className="text-base sm:text-xl md:text-2xl text-gray-500 mt-4"
                            >
                                {currentStepData.subtext}
                            </motion.p>
                        </motion.div>
                    )}

                    {/* Problem/Solution Slides (Steps 2-6) */}
                    {currentStepData?.type === "problem" && !showForm && (
                        <motion.div
                            key={`problem-${currentStep}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center mb-6 sm:mb-8 shadow-lg`}
                            >
                                {React.createElement(currentStepData.icon, { className: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" })}
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-base sm:text-xl md:text-2xl text-gray-400 mb-4"
                            >
                                "{currentStepData.problem}"
                            </motion.p>

                            <motion.h2
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
                            >
                                {currentStepData.solution}
                            </motion.h2>
                        </motion.div>
                    )}

                    {/* The Big Reveal (Step 7) */}
                    {currentStepData?.type === "reveal" && !showForm && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-glow"
                            >
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                Presenting
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold gradient-text mb-4 sm:mb-6"
                            >
                                ContentNova
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-600"
                            >
                                {currentStepData.tagline}
                            </motion.p>
                        </motion.div>
                    )}

                    {/* Form Section */}
                    {showForm && (
                        <motion.div
                            key="form-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="grid lg:grid-cols-2 gap-12 items-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/90 to-primary-light/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-glow"
                                >
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Coming 2026 — Join the Waitlist
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                                >
                                    <span className="text-gray-900">The Go-To Workspace for </span>
                                    <span className="gradient-text">Your Content Brand's Journey</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl"
                                >
                                    Your creativity stays in the driver's seat as we help you ideate, create,
                                    plan, publish, and grow — all in one place.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-4"
                                >
                                    {status === "success" ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl"
                                        >
                                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold">You're on the list! 🎉</p>
                                                <p className="text-sm text-green-600">We'll notify you when ContentNova launches.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="relative flex-1">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400" />
                                                </div>
                                                <div className="relative flex-1">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="relative flex-1">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${status === "error" ? "border-red-300" : "border-gray-200"} focus:border-primary focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400`} />
                                                </div>
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={status === "loading"} className="btn-primary px-8 py-4 flex items-center justify-center gap-2 min-w-[180px] group">
                                                    {status === "loading" ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining...</> : <>Join Waitlist <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                                </motion.button>
                                            </div>
                                            {status === "error" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm">{errorMessage}</motion.p>}
                                        </form>
                                    )}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex items-center justify-center sm:justify-start gap-4 sm:gap-8 pt-6 flex-wrap">
                                    <div className="text-center sm:text-left"><p className="text-2xl sm:text-3xl font-bold text-primary">500+</p><p className="text-xs sm:text-sm text-gray-500">Early signups</p></div>
                                    <div className="w-px h-10 sm:h-12 bg-gray-200 hidden sm:block" />
                                    <div className="text-center sm:text-left"><p className="text-2xl sm:text-3xl font-bold text-primary">6</p><p className="text-xs sm:text-sm text-gray-500">Phases covered</p></div>
                                    <div className="w-px h-10 sm:h-12 bg-gray-200 hidden sm:block" />
                                    <div className="text-center sm:text-left"><p className="text-2xl sm:text-3xl font-bold text-primary">Free</p><p className="text-xs sm:text-sm text-gray-500">Early access</p></div>
                                </motion.div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center lg:justify-end">
                                <div className="w-full max-w-lg animate-float">
                                    <Lottie animationData={animationData} loop={true} autoplay={true} className="w-full h-auto" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Dots */}
                {!showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <button key={i} onClick={() => setCurrentStep(i)} className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? "bg-primary w-8" : i < currentStep ? "bg-primary/50 w-4" : "bg-gray-300 w-4"}`} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Hero;
