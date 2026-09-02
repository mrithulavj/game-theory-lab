// Quick node verification script for game theory simulation logic

function calculatePayoffs(moveA, moveB, matrix) {
  if (moveA === 'C' && moveB === 'C') return { payoffA: matrix.reward, payoffB: matrix.reward };
  if (moveA === 'C' && moveB === 'D') return { payoffA: matrix.sucker, payoffB: matrix.temptation };
  if (moveA === 'D' && moveB === 'C') return { payoffA: matrix.temptation, payoffB: matrix.sucker };
  return { payoffA: matrix.punishment, payoffB: matrix.punishment };
}

function titForTat(history, isAgentA) {
  if (history.length === 0) return 'C';
  const last = history[history.length - 1];
  return isAgentA ? last.moveB : last.moveA;
}

function randomMove() {
  return Math.random() >= 0.5 ? 'C' : 'D';
}

const matrix = { reward: 3, punishment: 1, temptation: 5, sucker: 0 };
let history = [];
let scoreA = 0;
let scoreB = 0;

for (let r = 1; r <= 10; r++) {
  const moveA = titForTat(history, true);
  const moveB = randomMove();
  const { payoffA, payoffB } = calculatePayoffs(moveA, moveB, matrix);
  scoreA += payoffA;
  scoreB += payoffB;
  history.push({ round: r, moveA, moveB, payoffA, payoffB, cumulativeScoreA: scoreA, cumulativeScoreB: scoreB });
}

console.log('--- Simulation Test Results (10 Rounds TFT vs Random) ---');
console.table(history);
console.log(`Final Scores: Agent A (TFT) = ${scoreA}, Agent B (Random) = ${scoreB}`);
