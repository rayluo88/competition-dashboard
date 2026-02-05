
const GAME_TYPE_PATTERN = ['XD', 'WD', 'MD', 'WD', 'XD'];
const NUM_MALES = 4;
const REST_WINDOW = 3;
const TOTAL_GAMES = 50; // Run enough to see cycle

// 4 Males: 0, 1, 2, 3
interface PlayerState {
    id: number;
    lastPlayed: number; // Sequence number of last game played
}

type Schedule = { gameIndex: number, type: string, males: number[] }[];

function solve(gameIndex: number, players: PlayerState[], schedule: Schedule): Schedule | null {
    if (gameIndex >= TOTAL_GAMES) {
        return schedule;
    }

    const type = GAME_TYPE_PATTERN[gameIndex % GAME_TYPE_PATTERN.length];
    let malesNeeded = 0;
    if (type === 'MD') malesNeeded = 2;
    if (type === 'XD') malesNeeded = 1;

    if (malesNeeded === 0) {
        return solve(gameIndex + 1, players, [...schedule, { gameIndex, type, males: [] }]);
    }

    // Find valid candidates
    // A player is valid if gameIndex - lastPlayed > REST_WINDOW
    // i.e., lastPlayed < gameIndex - REST_WINDOW

    // Example: Target 5. Window 3.
    // Must not have played 4, 3, 2.
    // Last played must be <= 1.
    // 1 < 5 - 3 (which is 2). Yes.

    const candidates = players.filter(p => p.lastPlayed < gameIndex - REST_WINDOW).map(p => p.id);

    // We need combinations of `malesNeeded` from `candidates`
    if (candidates.length < malesNeeded) {
        return null; // Dead end
    }

    // Heuristic: Try all meaningful combinations? 
    // Or just pick the ones who haven't played for the longest?
    // User asks if it is "fixed pattern".
    // This implies that regardless of choice (or with a standard strategy), result is same behavior.

    // Let's iterate all combinations to see if multiple solutions exist.
    // For simplicity, let's just find ONE valid full schedule first.

    const combos = getCombinations(candidates, malesNeeded);

    for (const combo of combos) {
        // Create new state
        const nextPlayers = players.map(p => ({
            ...p,
            lastPlayed: combo.includes(p.id) ? gameIndex : p.lastPlayed
        }));

        const res = solve(gameIndex + 1, nextPlayers, [...schedule, { gameIndex, type, males: combo }]);
        if (res) return res;
    }

    return null;
}

function getCombinations(arr: number[], k: number): number[][] {
    if (k === 0) return [[]];
    if (arr.length < k) return [];

    const first = arr[0];
    const rest = arr.slice(1);

    const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
    const withoutFirst = getCombinations(rest, k);

    return [...withFirst, ...withoutFirst];
}

// Initial state: everyone played at -999 (ready)
const initialPlayers = Array.from({ length: NUM_MALES }, (_, i) => ({ id: i, lastPlayed: -100 }));

const result = solve(0, initialPlayers, []);

if (result) {
    console.log("Found a valid schedule.");
    // Analyze pattern
    // Group by Game Type and see which clusters play

    console.log("Game Sequence & Players:");
    result.forEach(r => {
        if (r.males.length > 0) {
            console.log(`Game ${r.gameIndex} (${r.type}): [${r.males.join(', ')}]`);
        }
    });

    // Check if MD is always same pair
    const mdGames = result.filter(r => r.type === 'MD');
    const mdPairs = mdGames.map(g => g.males.sort().join(','));
    console.log("MD Pairs:", mdPairs);

    const xdGames = result.filter(r => r.type === 'XD');
    const xdPlayers = xdGames.map(g => g.males.join(','));
    console.log("XD Players:", xdPlayers);

} else {
    console.log("No valid schedule found!");
}
