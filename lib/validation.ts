import { GameType } from './scheduling';

interface Player {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
}

interface GameHistory {
    gameId: string;
    sequenceNumber: number;
    playerIds: string[]; // List of players involved in this game
}

// REST RULE: Player cannot play if they played in any of the last 3 games.
// "Last 3 games" essentially means if I'm targeting Game #N, 
// I must not have played in Game #N-1, #N-2, or #N-3.
export function isPlayerResting(
    targetGameSequence: number,
    playerGameHistory: number[], // Sequence numbers of games the player played
    lookbackWindow: number = 3
): boolean {
    if (playerGameHistory.length === 0) return false;

    const minAllowedSequence = targetGameSequence - lookbackWindow;

    // Check if any played game falls in the range [target - lookbackWindow, target - 1]
    // Note: We only care about previous games, so < targetGameSequence
    return playerGameHistory.some(seq => seq >= minAllowedSequence && seq < targetGameSequence);
}

export function isValidGenderForGameType(player: Player, partner: Player | null, gameType: GameType): boolean {
    // If we are just checking the first player (partner is null)
    if (!partner) {
        if (gameType === 'MD' && player.gender !== 'Male') return false;
        if (gameType === 'WD' && player.gender !== 'Female') return false;
        // For XD, first player can be either
        return true;
    }

    // If we have both players
    const genders = [player.gender, partner.gender];
    const maleCount = genders.filter(g => g === 'Male').length;
    const femaleCount = genders.filter(g => g === 'Female').length;

    if (gameType === 'MD') return maleCount === 2;
    if (gameType === 'WD') return femaleCount === 2;
    if (gameType === 'XD') return maleCount === 1 && femaleCount === 1;

    return false;
}
