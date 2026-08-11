export function lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
