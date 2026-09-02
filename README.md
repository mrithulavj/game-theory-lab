# Game Theory Lab

> An interactive computational laboratory for studying strategic behaviour through game theory, simulation, and AI agents.

**Game Theory Lab** is an experimental platform for modelling strategic interactions between competing agents and observing how different strategies behave over repeated games.

The project begins with classical game-theoretic strategies and extends toward **LLM-based agents**, allowing us to compare rule-based decision making with AI-generated strategic behaviour in controlled environments.

The goal is not simply to determine *who wins*, but to study **how agents make decisions, how they respond to opponents, and how strategic behaviour evolves over repeated interactions.**

---

## Why this exists

Game theory provides mathematical frameworks for understanding situations where the outcome of one decision depends on the decisions of others.

But strategic behaviour becomes much more interesting when we move from static payoff matrices to repeated interactions.

What happens when an agent remembers what its opponent did?

What happens when cooperation is rewarded but defection provides a short-term advantage?

What happens when an AI agent has to reason about an opponent whose strategy it does not know?

Game Theory Lab is built to explore these questions computationally.

---

## Current Focus

The current implementation centres around the **Iterated Prisoner's Dilemma**, where two agents repeatedly choose between:

* **Cooperate**
* **Defect**

Each interaction produces a payoff for both players, allowing strategies to be evaluated across multiple rounds.

The simulator supports configurable game parameters and provides metrics that make strategic behaviour observable rather than treating the game as a simple win/loss simulation.

---

## Strategies

The classical strategy layer currently includes:

| Strategy                 | Behaviour                                                              |
| ------------------------ | ---------------------------------------------------------------------- |
| **Tit for Tat**          | Starts cooperatively and mirrors the opponent's previous move          |
| **Generous Tit for Tat** | Primarily mirrors the opponent while occasionally forgiving defections |
| **Always Cooperate**     | Cooperates every round                                                 |
| **Always Defect**        | Defects every round                                                    |
| **Random**               | Selects actions randomly                                               |
| **Grim Trigger**         | Cooperates until the opponent defects, then defects permanently        |

These strategies provide classical baselines against which more complex agents can be evaluated.

---

## AI Agents

The project also introduces an **LLM agent adapter architecture**, allowing language models to participate in strategic environments.

Instead of hard-coding every decision rule, an LLM agent can receive information about the current game state and opponent behaviour and determine its next action.

This creates a bridge between:

**classical game theory → computational agents → LLM-based strategic behaviour**

The current implementation includes support for **Google Gemini** through an environment-based API configuration.

API credentials are kept outside the repository using environment variables.

---

## Simulation

Each experiment can be configured around parameters such as:

* payoff matrix
* number of rounds
* participating strategies
* observation noise
* trembling-hand probability
* agent configuration

The simulator records the history of interactions and calculates cumulative outcomes across the game.

### Example

A repeated interaction can be represented as:

```text
Round 1
Agent A → Cooperate
Agent B → Cooperate

Round 2
Agent A → Cooperate
Agent B → Defect

Round 3
Agent A → Defect
Agent B → Cooperate

...
```

This history can then be analysed to understand behavioural patterns.

---

## Metrics

The laboratory is designed to move beyond cumulative score.

Current and planned measurements include:

* cumulative payoff
* cooperation rate
* defection rate
* round-by-round behaviour
* strategy performance
* opponent response patterns
* equilibrium interpretation
* Pareto efficiency
* behavioural differences between agents

The objective is to eventually treat each simulation as an **experiment rather than simply a game**.

---

## Game Theory Concepts

The project provides computational intuition for concepts including:

### Nash Equilibrium

A state where no player can improve their payoff by unilaterally changing their strategy.

### Pareto Efficiency

An outcome where improving one player's payoff would require making another player worse off.

### Repeated Games

Games where the same strategic interaction occurs multiple times, allowing previous actions to influence future decisions.

### Cooperation and Defection

The Prisoner's Dilemma demonstrates how individually rational decisions can produce collectively suboptimal outcomes.

### Strategy and Reputation

Repeated interactions allow agents to condition their behaviour on an opponent's previous actions, creating mechanisms for cooperation, retaliation, and forgiveness.

---

## Architecture

The project is designed around separating the **game environment** from the **agent's decision-making strategy**.

```text
                    ┌─────────────────────┐
                    │     Game Engine     │
                    │                     │
                    │  Payoffs / Rounds   │
                    │  History / Noise    │
                    └──────────┬──────────┘
                               │
                     current game state
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌────────▼────────┐
        │ Classical Agent │           │    LLM Agent    │
        │                 │           │                 │
        │ Tit for Tat     │           │ Gemini          │
        │ Grim Trigger    │           │ Reasoning       │
        │ Random          │           │ Context         │
        └───────┬─────────┘           └────────┬────────┘
                │                              │
                └──────────────┬───────────────┘
                               │
                         Agent Action
                               │
                               ▼
                       ┌──────────────┐
                       │   Outcome    │
                       │              │
                       │ Payoff       │
                       │ Behaviour    │
                       │ History      │
                       └──────────────┘
```

This architecture makes it possible to introduce additional agents without changing the underlying game engine.

---

## Research Direction

The long-term objective is to evolve Game Theory Lab into a **behavioural research platform for AI agents**.

### Phase 1 — LLM Integration

Allow language models to participate directly in repeated games.

**Status:** Implemented

### Phase 2 — Experiment Runner

Run multiple trials automatically with different agent pairings and game configurations.

**Status:** In development

### Phase 3 — Classical Baselines

Establish reliable performance baselines using traditional game-theoretic strategies.

**Status:** In development

### Phase 4 — Opponent Modelling

Allow agents to infer and adapt to the strategy of their opponent.

**Status:** Planned

### Phase 5 — Strategic Behaviour Metrics

Develop richer measurements for cooperation, retaliation, exploitation, adaptation, consistency, and behavioural stability.

**Status:** Planned

---

## Tech Stack

* **TypeScript**
* **React**
* **Vite**
* **JavaScript**
* **LLM API integration**
* **Google Gemini**
* **CSS**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mrithulavj/game-theory-lab.git
cd game-theory-lab
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API configuration to `.env.local`.

**Never commit API keys to the repository.**

### 4. Start the development server

```bash
npm run dev
```

The application will be available through the local Vite development server.

---

## Testing

The repository includes simulation and experiment test scripts for validating the underlying game logic.

```bash
node test-simulation.js
```

and

```bash
node test-experiment.js
```

---

## Project Structure

```text
game-theory-lab/
│
├── src/
│   ├── ...
│
├── test-simulation.js
├── test-experiment.js
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## What makes this different?

Traditional game-theory simulators generally focus on calculating outcomes from predefined mathematical strategies.

Game Theory Lab is intended to explore the layer **between mathematical strategy and intelligent behaviour**.

Instead of asking only:

> Which strategy performs best?

the project asks:

> **How does an intelligent agent behave when placed inside a strategic environment?**

This makes it possible to investigate questions around:

* cooperation
* retaliation
* trust
* adaptation
* strategic reasoning
* opponent modelling
* bounded rationality
* emergent behaviour

The eventual goal is to make these behaviours measurable and reproducible through controlled computational experiments.

---

## Future Experiments

Potential extensions include:

* Prisoner's Dilemma tournaments
* Battle of the Sexes
* Chicken Game
* Matching Pennies
* Stag Hunt
* Ultimatum Game
* repeated bargaining
* auctions
* multi-agent environments
* LLM vs LLM tournaments
* LLM vs classical strategy tournaments
* noisy communication
* incomplete information
* adaptive opponents
* evolutionary strategy simulations

---

## Status

🚧 **Active research project**

Game Theory Lab is currently an evolving experimental platform. The architecture and research direction are expected to expand as more agent types, experiments, and behavioural metrics are introduced.

---

## Author

**Mrithula Vijay Gnanadesikan**

Computer Science & Engineering

Interested in the intersection of **AI × Economics × Game Theory × Finance**.

---

## License

This project is currently intended as an experimental and educational research project.
