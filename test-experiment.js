// Node verification test script for Phase 2 Experiment Runner logic

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

function alwaysCooperate() { return 'C'; }
function alwaysDefect() { return 'D'; }

function runTrial(rounds, stratA, stratB, matrix) {
  const history = [];
  let scoreA = 0;
  let scoreB = 0;
  for (let r = 1; r <= rounds; r++) {
    const moveA = stratA === 'tft' ? titForTat(history, true) : stratA === 'coop' ? alwaysCooperate() : randomMove();
    const moveB = stratB === 'random' ? randomMove() : stratB === 'defect' ? alwaysDefect() : titForTat(history, false);
    const { payoffA, payoffB } = calculatePayoffs(moveA, moveB, matrix);
    scoreA += payoffA;
    scoreB += payoffB;
    history.push({ round: r, moveA, moveB, payoffA, payoffB, cumulativeScoreA: scoreA, cumulativeScoreB: scoreB });
  }
  return { history, scoreA, scoreB };
}

function runExperiment(numberOfTrials, roundsPerTrial, stratA, stratB, matrix) {
  const trials = [];
  let totalScoreA = 0;
  let totalScoreB = 0;
  let totalCoopA = 0;
  let totalCoopB = 0;
  const totalRounds = numberOfTrials * roundsPerTrial;

  for (let t = 1; t <= numberOfTrials; t++) {
    const trial = runTrial(roundsPerTrial, stratA, stratB, matrix);
    totalScoreA += trial.scoreA;
    totalScoreB += trial.scoreB;
    const coopA = trial.history.filter(h => h.moveA === 'C').length;
    const coopB = trial.history.filter(h => h.moveB === 'C').length;
    totalCoopA += coopA;
    totalCoopB += coopB;
    trials.push({ trialId: `T_${t}`, scoreA: trial.scoreA, scoreB: trial.scoreB, coopRateA: coopA / roundsPerTrial, coopRateB: coopB / roundsPerTrial });
  }

  return {
    trials,
    summary: {
      totalTrials: numberOfTrials,
      totalRounds,
      avgScoreA: totalScoreA / numberOfTrials,
      avgScoreB: totalScoreB / numberOfTrials,
      coopRateA: totalCoopA / totalRounds,
      coopRateB: totalCoopB / totalRounds,
      avgSocialWelfare: (totalScoreA + totalScoreB) / totalRounds,
    }
  };
}

const matrix = { reward: 3, punishment: 1, temptation: 5, sucker: 0 };

console.log('--- TEST 1: Tit-for-Tat vs Random (5 rounds x 3 trials) ---');
const exp1 = runExperiment(3, 5, 'tft', 'random', matrix);
console.table(exp1.trials);
console.log('Summary Exp 1:', exp1.summary);

console.log('\n--- TEST 2: Always Cooperate vs Always Defect (10 rounds x 2 trials) ---');
const exp2 = runExperiment(2, 10, 'coop', 'defect', matrix);
console.table(exp2.trials);
console.log('Summary Exp 2:', exp2.summary);
