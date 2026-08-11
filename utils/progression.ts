import { PROGRESSION_CONFIG } from '@/config/progression.config';

export interface CountdownResult {
    isUnlocked: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formattedCountdown: string;
}

/**
 * Checks if a specific day is unlocked based on configured unlock dates & current time.
 */
export function isDayUnlocked(dayNumber: number, nowOverride?: Date): boolean {
    const unlockDateString = PROGRESSION_CONFIG.unlockDates[dayNumber];
    if (!unlockDateString) return true; // Default unlocked if no date set

    const now = nowOverride || new Date();
    const unlockDate = new Date(unlockDateString);

    return now.getTime() >= unlockDate.getTime();
}

/**
 * Calculates countdown time remaining until a planet unlocks.
 */
export function getTimeUntilUnlock(dayNumber: number, nowOverride?: Date): CountdownResult {
    const unlockDateString = PROGRESSION_CONFIG.unlockDates[dayNumber];
    if (!unlockDateString) {
        return { isUnlocked: true, days: 0, hours: 0, minutes: 0, seconds: 0, formattedCountdown: 'Unlocked' };
    }

    const now = nowOverride || new Date();
    const unlockDate = new Date(unlockDateString);
    const diffMs = unlockDate.getTime() - now.getTime();

    if (diffMs <= 0) {
        return { isUnlocked: true, days: 0, hours: 0, minutes: 0, seconds: 0, formattedCountdown: 'Unlocked' };
    }

    const secondsTotal = Math.floor(diffMs / 1000);
    const days = Math.floor(secondsTotal / (3600 * 24));
    const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedCountdown = days > 0
        ? `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
        : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return {
        isUnlocked: false,
        days,
        hours,
        minutes,
        seconds,
        formattedCountdown,
    };
}
