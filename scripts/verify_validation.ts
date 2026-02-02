import { isPlayerResting } from '../lib/validation';

// Case 1: Player played in Game 1.
// Can they play in Game 2? NO. (Diff = 1)
// Can they play in Game 3? NO. (Diff = 2)
// Can they play in Game 4? NO. (Diff = 3)
// Can they play in Game 5? YES. (Diff = 4)

// Game 5 check:
// History: [1]
// Target: 5
// MinAllowed: 5 - 3 = 2.
// Played (1) < 2? Yes. 1 is NOT >= 2. So valid.

console.log('Test 1: Last played 1, Target 2. Should Rest?', isPlayerResting(2, [1])); // True
console.log('Test 2: Last played 1, Target 4. Should Rest?', isPlayerResting(4, [1])); // True
console.log('Test 3: Last played 1, Target 5. Should Rest?', isPlayerResting(5, [1])); // False

if (!isPlayerResting(2, [1])) throw new Error('Test 1 Failed');
if (!isPlayerResting(4, [1])) throw new Error('Test 2 Failed');
if (isPlayerResting(5, [1])) throw new Error('Test 3 Failed');

// Case 2: Multiple games
// History: [1, 5]
// Target: 6
// MinAllowed: 6-3=3.
// 5 is >= 3. So Rest.
console.log('Test 4: History [1,5], Target 6. Should Rest?', isPlayerResting(6, [1, 5])); // True
if (!isPlayerResting(6, [1, 5])) throw new Error('Test 4 Failed');

console.log('Validation Logic Verified: SUCCESS');
