'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
    id: string;
    imageUrl: string;
    title: string;
    subtitle?: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
    autoPlayInterval?: number; // in milliseconds, 0 to disable
}

export default function HeroCarousel({ slides, autoPlayInterval = 5000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Auto-play functionality
    useEffect(() => {
        if (autoPlayInterval === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [currentIndex, autoPlayInterval]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const currentX = e.pageX;
        const diff = currentX - startX;
        setTranslateX(diff);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Threshold for swipe (50px)
        if (translateX > 50) {
            prevSlide();
        } else if (translateX < -50) {
            nextSlide();
        }

        setTranslateX(0);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleMouseUp();
        }
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].pageX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.touches[0].pageX;
        const diff = currentX - startX;
        setTranslateX(diff);
    };

    const handleTouchEnd = () => {
        // Threshold for swipe (50px)
        if (translateX > 50) {
            prevSlide();
        } else if (translateX < -50) {
            nextSlide();
        }

        setTranslateX(0);
    };

    return (
        <div className="relative h-[580px] w-full overflow-hidden">
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="relative h-full w-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-500 ease-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        style={{
                            transform: index === currentIndex ? `translateX(${translateX}px)` : 'translateX(0)',
                        }}
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={slide.imageUrl}
                                alt={slide.title}
                                fill
                                className="object-cover pointer-events-none select-none"
                                draggable={false}
                                priority={index === 0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-gray-800 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
