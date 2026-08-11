'use client';

import React, { useEffect, useRef } from 'react';

export default function ConfettiBurst({ active = true }: { active?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
        let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

        const colors = ['#ff69b4', '#ffb6c1', '#38bdf8', '#fbbf24', '#a855f7', '#34d399'];
        const particleCount = 80;

        const particles = Array.from({ length: particleCount }).map(() => ({
            x: width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 12,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vRotation: (Math.random() - 0.5) * 0.2,
            alpha: 1,
        }));

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            let alive = 0;
            particles.forEach((p) => {
                if (p.alpha <= 0) return;
                alive++;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.25; // gravity
                p.alpha -= 0.012;
                p.rotation += p.vRotation;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (alive > 0) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />
    );
}
