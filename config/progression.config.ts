export interface ProgressionConfig {
    timeZone: string;
    unlockDates: Record<number, string>;
}

export const PROGRESSION_CONFIG: ProgressionConfig = {
    // Configurable Timezone (Asia/Kolkata / IST)
    timeZone: 'Asia/Kolkata',

    // Daily Unlock Schedule starting August 12 (12:00 AM IST) leading up to Birthday on August 21
    unlockDates: {
        1: '2026-08-12T00:00:00',  // Day 1: Aug 12, 12:00 AM
        2: '2026-08-13T00:00:00',  // Day 2: Aug 13, 12:00 AM
        3: '2026-08-14T00:00:00',  // Day 3: Aug 14, 12:00 AM
        4: '2026-08-15T00:00:00',  // Day 4: Aug 15, 12:00 AM
        5: '2026-08-16T00:00:00',  // Day 5: Aug 16, 12:00 AM
        6: '2026-08-17T00:00:00',  // Day 6: Aug 17, 12:00 AM
        7: '2026-08-18T00:00:00',  // Day 7: Aug 18, 12:00 AM
        8: '2026-08-19T00:00:00',  // Day 8: Aug 19, 12:00 AM
        9: '2026-08-20T00:00:00',  // Day 9: Aug 20, 12:00 AM
        10: '2026-08-21T00:00:00', // Day 10: Aug 21, 12:00 AM (Heart Sun Finale)
    },
};
