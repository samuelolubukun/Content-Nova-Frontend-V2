import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-lg" : "bg-white"
                }`}
        >
            <div className="container-custom px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-start h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative flex items-center h-16 -ml-4"
                    >
                        <img
                            src={logo}
                            alt="ContentNova Logo"
                            className="h-[80px] w-auto object-contain sm:h-[100px]"
                        />
                        <span className="absolute left-[60px] sm:left-[70px] text-base sm:text-xl font-semibold font-poppins">
                            ContentNova
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
