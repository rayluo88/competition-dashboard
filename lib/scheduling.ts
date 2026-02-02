export type GameType = 'MD' | 'WD' | 'XD';

interface GameSlot {
    sequenceNumber: number;
    timeSlot: string;
    courtNumber: number;
    gameType: GameType;
}

const START_TIME_HOUR = 10;
const START_TIME_MINUTE = 0;
const GAME_DURATION_MINUTES = 15;
const TOTAL_GAMES = 28;

// Pattern: WD -> MD -> XD -> WD -> XD
// This is a 5-game cycle.
const GAME_TYPE_PATTERN: GameType[] = ['WD', 'MD', 'XD', 'WD', 'XD'];

export function generateSchedule(): GameSlot[] {
    const schedule: GameSlot[] = [];
    let currentTime = new Date();
    currentTime.setHours(START_TIME_HOUR, START_TIME_MINUTE, 0, 0);

    // We have 2 courts running concurrently.
    // We need to generate 28 games total.
    // Each time slot has 2 games.
    // So we have 14 time slots.

    let gameCount = 0;

    for (let slot = 0; slot < 14; slot++) {
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Court 1
        const type1 = GAME_TYPE_PATTERN[gameCount % GAME_TYPE_PATTERN.length];
        schedule.push({
            sequenceNumber: gameCount + 1,
            timeSlot: timeString,
            courtNumber: 1,
            gameType: type1,
        });
        gameCount++;

        // Court 2
        const type2 = GAME_TYPE_PATTERN[gameCount % GAME_TYPE_PATTERN.length];
        schedule.push({
            sequenceNumber: gameCount + 1,
            timeSlot: timeString,
            courtNumber: 2,
            gameType: type2,
        });
        gameCount++;

        // Advance time
        currentTime.setMinutes(currentTime.getMinutes() + GAME_DURATION_MINUTES);
    }

    return schedule;
}
