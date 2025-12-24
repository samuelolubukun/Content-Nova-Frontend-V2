import React from "react";
import { motion } from "framer-motion";
import {
    Lightbulb,
    Palette,
    Calendar,
    RefreshCw,
    Share2,
    TrendingUp
} from "lucide-react";

const Features = () => {
    const features = [
        {
            title: "Ideation",
            description:
                "Generate endless content ideas with AI-powered brainstorming. Organize your ideas on visual boards and never run out of inspiration.",
            icon: Lightbulb,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Creation",
            description:
                "Transform ideas into polished content. Write, edit, and refine with intelligent AI assistance that enhances your unique voice.",
            icon: Palette,
            gradient: "from-purple-500 to-primary",
        },
        {
            title: "Planning",
            description:
                "Strategically plan your content calendar. Schedule posts, manage workflows, and maintain consistency across all channels.",
            icon: Calendar,
            gradient: "from-blue-500 to-cyan-400",
        },
        {
            title: "Repurposing",
            description:
                "Turn one piece of content into many. Automatically adapt and transform your content for multiple platforms and formats.",
            icon: RefreshCw,
            gradient: "from-green-500 to-emerald-400",
        },
        {
            title: "Publishing",
            description:
                "Publish across all your channels from a single dashboard. One-click distribution to every platform you care about.",
            icon: Share2,
            gradient: "from-pink-500 to-rose-500",
        },
        {
            title: "Tracking",
            description:
                "Get actionable insights from your content performance. Understand what works and optimize with data-driven recommendations.",
            icon: TrendingUp,
            gradient: "from-indigo-500 to-violet-500",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
    };

    return (
        <section className="section-padding bg-gray-50/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
                    >
                        Why ContentNova?
                    </motion.span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Your Complete{" "}
                        <span className="gradient-text">Content Journey</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                        Six powerful phases to take your content from idea to impact — all in one unified workspace.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.02,
                                y: -5,
                                transition: { duration: 0.2 },
                            }}
                            className="bg-white rounded-2xl p-6 sm:p-8 shadow-smooth hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
