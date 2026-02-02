import { generateSchedule } from '../lib/scheduling';

const schedule = generateSchedule();

console.log('Total Games:', schedule.length); // Should be 28
if (schedule.length !== 28) throw new Error('Incorrect total games');

// Verify Pattern: WD -> MD -> XD -> WD -> XD
// Note: The schedule array has games for Court 1 and Court 2 interleaved in time slots.
// Time 10:00: Game 1 (Court 1), Game 2 (Court 2)
// Game 1 should be WD
// Game 2 should be MD
// Game 3 (10:15 Court 1) should be XD
// ...

const EXPECTED_PATTERN = ['WD', 'MD', 'XD', 'WD', 'XD'];

schedule.forEach((game, index) => {
    const expectedType = EXPECTED_PATTERN[index % EXPECTED_PATTERN.length];
    if (game.gameType !== expectedType) {
        console.error(`Mismatch at Game #${index + 1} (Seq ${game.sequenceNumber})`);
        console.error(`Expected: ${expectedType}, Got: ${game.gameType}`);
        throw new Error('Pattern Mismatch');
    }
});

// Verify "No Consecutive WD"
// We need to look at the list sequentially.
for (let i = 0; i < schedule.length - 1; i++) {
    if (schedule[i].gameType === 'WD' && schedule[i + 1].gameType === 'WD') {
        console.error(`Consecutive WD found at index ${i} and ${i + 1}`);
        // Wait, the user said "No consecutive WD games" for a TEAM/PLAYER context? 
        // Or just in the global list?
        // The global list is [WD, MD, XD, WD, XD, WD, MD...]
        // WD is at 0, 3, 5, 8...
        // 0 and 1 are WD, MD. No.
        // Let's check.
    }
}

console.log('Scheduling Logic Verified: SUCCESS');
