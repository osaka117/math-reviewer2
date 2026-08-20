import { PracticeProblem } from '../types/math';

export function validateAnswer(
  userRawInput: string,
  problem: PracticeProblem,
  selectedOptionLabel?: string
): { isCorrect: boolean; feedback: string } {
  const trimmed = userRawInput.trim();

  // 1. If user clicked a multiple-choice option
  if (selectedOptionLabel) {
    if (problem.correctOptionLabel && selectedOptionLabel.toLowerCase() === problem.correctOptionLabel.toLowerCase()) {
      return {
        isCorrect: true,
        feedback: 'Correct! You selected the right answer.'
      };
    }
  }

  // 2. Direct string match against correct option label ('a', 'b', 'c', 'd')
  if (trimmed.length === 1 && problem.correctOptionLabel) {
    if (trimmed.toLowerCase() === problem.correctOptionLabel.toLowerCase()) {
      return {
        isCorrect: true,
        feedback: `Correct! Option (${problem.correctOptionLabel.toUpperCase()}) is the right answer.`
      };
    }
  }

  // 3. Match against acceptable answers list
  const normInput = normalizeMathString(trimmed);
  if (problem.acceptableAnswers && problem.acceptableAnswers.length > 0) {
    for (const acceptable of problem.acceptableAnswers) {
      if (normInput === normalizeMathString(acceptable)) {
        return {
          isCorrect: true,
          feedback: 'Correct! Your answer matches the solution.'
        };
      }
    }
  }

  // 4. Match against correct answer string
  const normCorrect = normalizeMathString(problem.correctAnswer);
  if (normInput === normCorrect) {
    return {
      isCorrect: true,
      feedback: 'Correct! Excellent work.'
    };
  }

  // 5. Numeric tolerance checking (e.g. 19.4 vs 19.40, 13.23 vs 13.2)
  const userNum = extractNumber(trimmed);
  const correctNum = extractNumber(problem.correctAnswer);
  if (userNum !== null && correctNum !== null) {
    const diff = Math.abs(userNum - correctNum);
    // Allow up to 0.15 difference or 1% tolerance
    if (diff <= 0.15 || diff / (Math.abs(correctNum) || 1) < 0.02) {
      return {
        isCorrect: true,
        feedback: `Correct! (Calculated value ${userNum} is within acceptable rounding tolerance).`
      };
    }
  }

  // 6. Coordinates comparison: (x, y) vs x, y
  const userCoords = extractCoordinates(trimmed);
  const correctCoords = extractCoordinates(problem.correctAnswer);
  if (userCoords && correctCoords) {
    if (userCoords[0] === correctCoords[0] && userCoords[1] === correctCoords[1]) {
      return {
        isCorrect: true,
        feedback: `Correct! Coordinates (${userCoords[0]}, ${userCoords[1]}) match.`
      };
    }
  }

  // 7. Interval check: e.g. [3, 8] vs [3,8]
  const userInterval = extractInterval(trimmed);
  const correctInterval = extractInterval(problem.correctAnswer);
  if (userInterval && correctInterval && userInterval === correctInterval) {
    return {
      isCorrect: true,
      feedback: 'Correct! The interval notation matches.'
    };
  }

  // If none matched
  return {
    isCorrect: false,
    feedback: 'Incorrect. Review the step-by-step solution below to see the methodology.'
  };
}

function normalizeMathString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\left|\\right/g, '')
    .replace(/\\le/g, '<=')
    .replace(/\\ge/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/\\approx/g, '=')
    .replace(/\\circ|°/g, '')
    .replace(/cm|km|meters|m\^2|m²/g, '')
    .replace(/[$]/g, '');
}

function extractNumber(str: string): number | null {
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  return isNaN(num) ? null : num;
}

function extractCoordinates(str: string): [number, number] | null {
  const cleaned = str.replace(/[()]/g, '').trim();
  const parts = cleaned.split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return null;
}

function extractInterval(str: string): string | null {
  const match = str.match(/([(\[])\s*(-?\d+|-\w+)\s*,\s*(\d+|\w+)\s*([)\]])/);
  if (match) {
    return `${match[1]}${match[2]},${match[3]}${match[4]}`;
  }
  return null;
}
