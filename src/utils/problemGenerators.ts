import { DifficultyLevel, PracticeProblem, QuestionOption, MathStep } from '../types/math';

// Helper to round to 2 decimal places cleanly
export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper to pick a random item
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Random int between min and max inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to build 4 unique options labeled a, b, c, d
function buildOptions(correctText: string, distractors: string[]): { options: QuestionOption[]; correctLabel: string } {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => d !== correctText))).slice(0, 3);
  
  // If we don't have 3 unique distractors, generate placeholders
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`None of the above (${uniqueDistractors.length + 1})`);
  }

  const items = [
    { text: correctText, isCorrect: true },
    { text: uniqueDistractors[0], isCorrect: false },
    { text: uniqueDistractors[1], isCorrect: false },
    { text: uniqueDistractors[2], isCorrect: false },
  ];

  const shuffled = shuffle(items);
  const labels = ['a', 'b', 'c', 'd'];
  let correctLabel = 'a';

  const options: QuestionOption[] = shuffled.map((item, idx) => {
    const label = labels[idx];
    if (item.isCorrect) {
      correctLabel = label;
    }
    return {
      label,
      text: item.text,
      isCorrect: item.isCorrect
    };
  });

  return { options, correctLabel };
}

// -------------------------------------------------------------
// 1. GEOMETRIC TRANSFORMATIONS GENERATOR
// -------------------------------------------------------------
export function generateTransformationProblem(level: DifficultyLevel): PracticeProblem {
  const pointNames = ['A', 'B', 'P', 'Q', 'M', 'N', 'R', 'T'];
  const name = randomChoice(pointNames);

  if (level === 1) {
    // Level 1: Basic single translation with positive/negative shifts
    const x = randomInt(-6, 8);
    const y = randomInt(-6, 8);
    const dx = randomChoice([-5, -4, -3, -2, 2, 3, 4, 5]);
    const dy = randomChoice([-5, -4, -3, -2, 2, 3, 4, 5]);

    const newX = x + dx;
    const newY = y + dy;

    const xDir = dx < 0 ? `${Math.abs(dx)} units left` : `${dx} units right`;
    const yDir = dy < 0 ? `${Math.abs(dy)} units down` : `${dy} units up`;

    const questionText = `Point $${name}(${x}, ${y})$ is translated ${xDir} and ${yDir}. What are the new coordinates of $${name}$?`;
    const correctAns = `(${newX}, ${newY})`;

    const distractors = [
      `(${x - dx}, ${y + dy})`,
      `(${newX}, ${y - dy})`,
      `(${x - dx}, ${y - dy})`,
      `(${y + dy}, ${x + dx})`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    const stepByStep: MathStep[] = [
      {
        stepNumber: 1,
        title: 'Identify the translation vector',
        explanation: `Moving ${xDir} changes the x-coordinate by $${dx > 0 ? '+' : ''}${dx}$. Moving ${yDir} changes the y-coordinate by $${dy > 0 ? '+' : ''}${dy}$.`,
        mathFormula: `(x, y) \\to (x + (${dx}), y + (${dy}))`
      },
      {
        stepNumber: 2,
        title: 'Apply the shift to initial coordinates',
        explanation: `Calculate new coordinates: $x' = ${x} + (${dx}) = ${newX}$ and $y' = ${y} + (${dy}) = ${newY}$.`,
        mathFormula: `(${x}, ${y}) \\to (${newX}, ${newY})`,
        result: `(${newX}, ${newY})`
      }
    ];

    return {
      id: `trans-l1-${Date.now()}-${Math.random()}`,
      topicId: 'transformations',
      topicName: 'Geometric Transformations',
      difficulty: 1,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Apply the translation vector: add ${dx} to the x-coordinate and ${dy} to the y-coordinate.`,
      methodology: 'Coordinate Translation Formula: (x\', y\') = (x + dx, y + dy)',
      formulaUsed: '(x, y) \\to (x + h, y + k)',
      stepByStep,
      acceptableAnswers: [correctAns, `${newX}, ${newY}`, `${newX},${newY}`, correctLabel]
    };
  }

  if (level === 2) {
    // Level 2: Reflections across axes or 180° rotation
    const type = randomChoice(['reflect_x', 'reflect_y', 'rotate_180']);
    const x = randomChoice([-8, -7, -5, -4, -3, 3, 4, 5, 7, 8]);
    const y = randomChoice([-8, -7, -6, -4, -2, 2, 4, 6, 7, 8]);

    let questionText = '';
    let correctAns = '';
    let distractors: string[] = [];
    let formula = '';
    let explanation = '';

    if (type === 'reflect_x') {
      questionText = `Point $${name}(${x}, ${y})$ is reflected across the $x$-axis. What are the new coordinates of $${name}$?`;
      correctAns = `(${x}, ${-y})`;
      distractors = [`(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`];
      formula = '(x, y) \\to (x, -y)';
      explanation = 'Reflecting across the x-axis keeps the x-coordinate identical and negates the y-coordinate.';
    } else if (type === 'reflect_y') {
      questionText = `Point $${name}(${x}, ${y})$ is reflected across the $y$-axis. What are the new coordinates of $${name}$?`;
      correctAns = `(${-x}, ${y})`;
      distractors = [`(${x}, ${-y})`, `(${-x}, ${-y})`, `(${y}, ${-x})`];
      formula = '(x, y) \\to (-x, y)';
      explanation = 'Reflecting across the y-axis negates the x-coordinate and keeps the y-coordinate identical.';
    } else {
      questionText = `Point $${name}(${x}, ${y})$ is rotated $180^\\circ$ about the origin. What are the new coordinates of $${name}$?`;
      correctAns = `(${-x}, ${-y})`;
      distractors = [`(${x}, ${-y})`, `(${-x}, ${y})`, `(${y}, ${x})`];
      formula = '(x, y) \\to (-x, -y)';
      explanation = 'A 180° rotation about the origin negates both coordinates (x and y).';
    }

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trans-l2-${Date.now()}-${Math.random()}`,
      topicId: 'transformations',
      topicName: 'Geometric Transformations',
      difficulty: 2,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: explanation,
      methodology: `Transformation Rule: ${formula}`,
      formulaUsed: formula,
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Determine the geometric rule',
          explanation,
          mathFormula: formula
        },
        {
          stepNumber: 2,
          title: 'Substitute the given point',
          explanation: `Substitute $x = ${x}$ and $y = ${y}$ into the formula.`,
          mathFormula: `(${x}, ${y}) \\to ${correctAns}`,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  if (level === 3) {
    // Level 3: Rotations (90° CW, 90° CCW, 270°) or reflection across line y = x
    const rotType = randomChoice(['rot_90_cw', 'rot_90_ccw', 'reflect_yx']);
    const x = randomChoice([-6, -5, -3, 2, 4, 7]);
    const y = randomChoice([-7, -4, 3, 5, 6, 8]);

    let questionText = '';
    let correctAns = '';
    let distractors: string[] = [];
    let formula = '';
    let ruleName = '';

    if (rotType === 'rot_90_cw') {
      questionText = `Point $${name}(${x}, ${y})$ is rotated $90^\\circ$ clockwise about the origin. What are the new coordinates?`;
      correctAns = `(${y}, ${-x})`;
      distractors = [`(${-y}, ${x})`, `(${-x}, ${-y})`, `(${x}, ${-y})`];
      formula = '(x, y) \\to (y, -x)';
      ruleName = '90° clockwise rotation';
    } else if (rotType === 'rot_90_ccw') {
      questionText = `Point $${name}(${x}, ${y})$ is rotated $90^\\circ$ counterclockwise about the origin. What are the new coordinates?`;
      correctAns = `(${-y}, ${x})`;
      distractors = [`(${y}, ${-x})`, `(${-x}, ${-y})`, `(${x}, ${y})`];
      formula = '(x, y) \\to (-y, x)';
      ruleName = '90° counterclockwise rotation';
    } else {
      questionText = `Point $${name}(${x}, ${y})$ is reflected across the line $y = x$. What are its new coordinates?`;
      correctAns = `(${y}, ${x})`;
      distractors = [`(${-y}, ${-x})`, `(${x}, ${-y})`, `(${-x}, ${y})`];
      formula = '(x, y) \\to (y, x)';
      ruleName = 'Reflection across line y = x';
    }

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trans-l3-${Date.now()}-${Math.random()}`,
      topicId: 'transformations',
      topicName: 'Geometric Transformations',
      difficulty: 3,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Under a ${ruleName}, the coordinate transformation rule is $${formula}$.`,
      methodology: `Coordinate Transformation Rule: ${formula}`,
      formulaUsed: formula,
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Apply Transformation Rule',
          explanation: `For ${ruleName}, swap or negate coordinates according to $${formula}$.`,
          mathFormula: formula
        },
        {
          stepNumber: 2,
          title: 'Compute New Values',
          explanation: `Plugging in $x = ${x}$ and $y = ${y}$ gives $${correctAns}$.`,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  if (level === 4) {
    // Level 4: Applied context word problems (like the drone or robotic vehicle problem)
    const objects = [
      { name: 'A delivery drone', context: 'its GPS map is reflected across the y-axis, and then translated 3 units south' },
      { name: 'An autonomous rover', context: 'is reflected across the x-axis, and then shifted 4 units east' },
      { name: 'A radar blip', context: 'is rotated 180° about the origin, and then translated 2 units north and 1 unit west' }
    ];
    const scenario = randomChoice(objects);
    const x = randomInt(3, 9);
    const y = randomInt(2, 8);

    let newX = 0;
    let newY = 0;
    let desc = '';
    let form = '';

    if (scenario.name === 'A delivery drone') {
      newX = -x;
      newY = y - 3;
      desc = `1) Reflection across y-axis: $(${x}, ${y}) \\to (${-x}, ${y})$. 2) Translation 3 units south: $(${ -x}, ${y - 3})$.`;
      form = '(x, y) \\to (-x, y - 3)';
    } else if (scenario.name === 'An autonomous rover') {
      newX = x + 4;
      newY = -y;
      desc = `1) Reflection across x-axis: $(${x}, ${y}) \\to (${x}, ${-y})$. 2) 4 units east: $(${x + 4}, ${-y})$.`;
      form = '(x, y) \\to (x + 4, -y)';
    } else {
      newX = -x - 1;
      newY = -y + 2;
      desc = `1) 180° rotation: $(${x}, ${y}) \\to (${-x}, ${-y})$. 2) 2 north, 1 west: $(${ -x - 1}, ${-y + 2})$.`;
      form = '(x, y) \\to (-x - 1, -y + 2)';
    }

    const questionText = `${scenario.name} is initially located at the coordinates $(${x}, ${y})$. Due to a mission command, ${scenario.context}. What are its final coordinates?`;
    const correctAns = `(${newX}, ${newY})`;
    const distractors = [
      `(${newX + 2}, ${newY})`,
      `(${x}, ${-newY})`,
      `(${-newX}, ${newY})`,
      `(${newY}, ${newX})`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trans-l4-${Date.now()}-${Math.random()}`,
      topicId: 'transformations',
      topicName: 'Geometric Transformations',
      difficulty: 4,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Apply the multi-step transformation sequentially: ${desc}`,
      methodology: 'Composite Geometric Transformation Rule',
      formulaUsed: form,
      stepByStep: [
        {
          stepNumber: 1,
          title: 'First Transformation',
          explanation: 'Apply the reflection or rotation step to the original coordinates.'
        },
        {
          stepNumber: 2,
          title: 'Second Transformation',
          explanation: 'Apply the translation shift to the intermediate coordinates.',
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  // Level 5: Inverse / Matrix-style composition & finding pre-image
  const origX = randomInt(-5, 5);
  const origY = randomInt(-5, 5);
  const h = randomInt(2, 6);
  const k = randomInt(2, 6);
  // Composite: Reflection across y-axis followed by translation (x + h, y - k)
  const finalX = -origX + h;
  const finalY = origY - k;

  const questionText = `A point $P(x, y)$ is first reflected across the $y$-axis, and then translated by vector $\\langle ${h}, -${k} \\rangle$. The resulting image point is $P'(${finalX}, ${finalY})$. What were the original coordinates of point $P$?`;
  const correctAns = `(${origX}, ${origY})`;
  const distractors = [
    `(${-origX}, ${origY})`,
    `(${origX + h}, ${origY - k})`,
    `(${-finalX}, ${-finalY})`,
    `(${origY}, ${origX})`
  ];

  const { options, correctLabel } = buildOptions(correctAns, distractors);

  return {
    id: `trans-l5-${Date.now()}-${Math.random()}`,
    topicId: 'transformations',
    topicName: 'Geometric Transformations',
    difficulty: 5,
    questionText,
    options,
    correctAnswer: correctAns,
    correctOptionLabel: correctLabel,
    shortExplanation: `Work backwards from image $P'(${finalX}, ${finalY})$: undo the translation by subtracting $\\langle ${h}, -${k} \\rangle$ to get intermediate coordinates $(${finalX - h}, ${finalY + k})$, then undo the y-axis reflection by negating the x-coordinate to obtain $(${origX}, ${origY})$.`,
    methodology: 'Inverse Transformation Mapping: (x_{orig}, y_{orig}) = (-(x\' - h), y\' + k)',
    formulaUsed: 'P(x, y) \\xrightarrow{\\text{reflect } y} (-x, y) \\xrightarrow{+(h,-k)} (-x + h, y - k) = (x\', y\')',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Reverse the translation',
        explanation: `Subtract the translation vector: $x_{\\text{mid}} = ${finalX} - (${h}) = ${finalX - h}$ and $y_{\\text{mid}} = ${finalY} - (-${k}) = ${finalY + k}$.`,
        result: `(${finalX - h}, ${finalY + k})`
      },
      {
        stepNumber: 2,
        title: 'Reverse the reflection across y-axis',
        explanation: `Negate the intermediate x-coordinate: $x = -(${finalX - h}) = ${origX}$, while $y = ${origY}$.`,
        result: correctAns
      }
    ],
    acceptableAnswers: [correctAns, correctLabel]
  };
}

// -------------------------------------------------------------
// 2. LAW OF SINES & LAW OF COSINES GENERATOR
// -------------------------------------------------------------
export function generateTrigonometryProblem(level: DifficultyLevel): PracticeProblem {
  if (level === 1) {
    // Level 1: Conceptual recognition of ambiguous case / AAS side length
    const isConceptual = Math.random() > 0.5;

    if (isConceptual) {
      const questionText = 'Which geometric condition illustrates the ambiguous case in solving oblique triangles, where zero, one, or two distinct triangles may exist?';
      const correctAns = 'SSA (Side-Side-Angle)';
      const distractors = ['SAS (Side-Angle-Side)', 'ASA (Angle-Side-Angle)', 'SSS (Side-Side-Side)'];

      const { options, correctLabel } = buildOptions(correctAns, distractors);

      return {
        id: `trig-l1-c-${Date.now()}-${Math.random()}`,
        topicId: 'law-of-sines-cosines',
        topicName: 'Law of Sines & Law of Cosines',
        difficulty: 1,
        questionText,
        options,
        correctAnswer: correctAns,
        correctOptionLabel: correctLabel,
        shortExplanation: 'The SSA (Side-Side-Angle) case is known as the Ambiguous Case because knowing two sides and an angle opposite one of them does not guarantee a unique triangle.',
        methodology: 'Triangle Congruence and Solvability Criteria',
        formulaUsed: '\\text{Ambiguous Case: SSA (Side-Side-Angle)}',
        stepByStep: [
          {
            stepNumber: 1,
            title: 'Analyze Triangle Cases',
            explanation: 'SSS, SAS, and ASA always produce uniquely determined triangles (or none if triangle inequality fails). SSA is ambiguous because the swinging side can form 0, 1, or 2 triangles.'
          }
        ],
        acceptableAnswers: ['SSA', 'c', correctAns, correctLabel]
      };
    }

    // Direct Law of Sines side calculation
    const angleA = randomChoice([30, 40, 42, 45, 50]);
    const angleB = randomChoice([55, 60, 68, 70, 75]);
    const a = randomInt(10, 20);

    const sinA = Math.sin((angleA * Math.PI) / 180);
    const sinB = Math.sin((angleB * Math.PI) / 180);
    const b = round2((a * sinB) / sinA);

    const questionText = `In $\\triangle ABC$, angle $A = ${angleA}^\\circ$, angle $B = ${angleB}^\\circ$, and side $a = ${a}\\text{ cm}$. Using the Law of Sines, what is the length of side $b$?`;
    const correctAns = `${b} cm`;
    const distractors = [
      `${round2(b * 1.12)} cm`,
      `${round2(b * 0.88)} cm`,
      `${round2(b + 3.2)} cm`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trig-l1-s-${Date.now()}-${Math.random()}`,
      topicId: 'law-of-sines-cosines',
      topicName: 'Law of Sines & Law of Cosines',
      difficulty: 1,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Apply the Law of Sines: $\\frac{b}{\\sin B} = \\frac{a}{\\sin A} \\implies b = \\frac{${a} \\cdot \\sin(${angleB}^\\circ)}{\\sin(${angleA}^\\circ)} \\approx ${b}\\text{ cm}$.`,
      methodology: 'Law of Sines: b = (a * sin(B)) / sin(A)',
      formulaUsed: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B}',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Set up the Law of Sines ratio',
          explanation: `Substitute the known values into $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$.`,
          mathFormula: `\\frac{${a}}{\\sin(${angleA}^\\circ)} = \\frac{b}{\\sin(${angleB}^\\circ)}`
        },
        {
          stepNumber: 2,
          title: 'Solve for side b',
          explanation: `Multiply both sides by $\\sin(${angleB}^\\circ)$: $b = \\frac{${a} \\cdot ${round2(sinB)}}{${round2(sinA)}} \\approx ${b}\\text{ cm}$.`,
          result: `${b} cm`
        }
      ],
      acceptableAnswers: [`${b}`, `${b} cm`, correctAns, correctLabel]
    };
  }

  if (level === 2) {
    // Level 2: Law of Cosines to find side c in SAS setup
    const a = randomChoice([8, 10, 12, 14]);
    const b = randomChoice([12, 15, 16, 18]);
    const angleC = randomChoice([45, 60, 75, 90, 120]);

    const radC = (angleC * Math.PI) / 180;
    const cSquared = a * a + b * b - 2 * a * b * Math.cos(radC);
    const c = round2(Math.sqrt(cSquared));

    const questionText = `Find the third side of a triangle with adjacent sides $a = ${a}\\text{ cm}$ and $b = ${b}\\text{ cm}$, and an included angle $C = ${angleC}^\\circ$.`;
    const correctAns = `${c} cm`;
    const distractors = [
      `${round2(Math.sqrt(a * a + b * b))} cm`,
      `${round2(c * 1.15)} cm`,
      `${round2(c * 0.85)} cm`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trig-l2-${Date.now()}-${Math.random()}`,
      topicId: 'law-of-sines-cosines',
      topicName: 'Law of Sines & Law of Cosines',
      difficulty: 2,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Use the Law of Cosines: $c = \\sqrt{a^2 + b^2 - 2ab\\cos C} = \\sqrt{${a}^2 + ${b}^2 - 2(${a})(${b})\\cos(${angleC}^\\circ)} \\approx ${c}\\text{ cm}$.`,
      methodology: 'Law of Cosines (SAS): c^2 = a^2 + b^2 - 2ab cos(C)',
      formulaUsed: 'c^2 = a^2 + b^2 - 2ab \\cos C',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Substitute values into Law of Cosines',
          explanation: `Substitute $a = ${a}$, $b = ${b}$, and $C = ${angleC}^\\circ$.`,
          mathFormula: `c^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\\cos(${angleC}^\\circ)`
        },
        {
          stepNumber: 2,
          title: 'Evaluate square root',
          explanation: `Compute: $c^2 = ${a * a} + ${b * b} - ${2 * a * b} \\cdot ${round2(Math.cos(radC))} = ${round2(cSquared)} \\implies c = \\sqrt{${round2(cSquared)}} \\approx ${c}\\text{ cm}$.`,
          result: `${c} cm`
        }
      ],
      acceptableAnswers: [`${c}`, `${c} cm`, correctAns, correctLabel]
    };
  }

  if (level === 3) {
    // Level 3: Determining number of triangles in SSA Ambiguous Case or finding largest angle in SSS
    const isAmbiguousAnalysis = Math.random() > 0.4;

    if (isAmbiguousAnalysis) {
      const angleA = randomChoice([30, 35, 40, 45]);
      const b = randomChoice([12, 14, 16, 20]);
      const h = round2(b * Math.sin((angleA * Math.PI) / 180));

      // Choose scenario: 0, 1, or 2 triangles
      const caseType = randomChoice(['two', 'one', 'none']);
      let a = 0;
      let correctAns = '';
      let explanation = '';

      if (caseType === 'none') {
        a = Math.floor(h) - 2;
        if (a <= 1) a = 2;
        correctAns = 'No triangle';
        explanation = `Since $a = ${a}$ is less than the altitude $h = b \\sin A = ${b}\\sin(${angleA}^\\circ) \\approx ${h}$, the side cannot reach the opposite base.`;
      } else if (caseType === 'two') {
        a = round2((h + b) / 2);
        correctAns = 'Two triangles';
        explanation = `Since $h = ${h} < a = ${a} < b = ${b}$, the side can swing in two distinct directions to form two valid triangles.`;
      } else {
        a = b + 3;
        correctAns = 'One triangle';
        explanation = `Since $a = ${a} \\ge b = ${b}$, only one obtuse/acute triangle is formed.`;
      }

      const questionText = `Given $\\triangle ABC$ with angle $A = ${angleA}^\\circ$, side $a = ${a}$, and side $b = ${b}$, how many distinct triangles are possible?`;
      const distractors = ['No triangle', 'One triangle', 'Two triangles', 'Three triangles'].filter(d => d !== correctAns);

      const { options, correctLabel } = buildOptions(correctAns, distractors);

      return {
        id: `trig-l3-amb-${Date.now()}-${Math.random()}`,
        topicId: 'law-of-sines-cosines',
        topicName: 'Law of Sines & Law of Cosines',
        difficulty: 3,
        questionText,
        options,
        correctAnswer: correctAns,
        correctOptionLabel: correctLabel,
        shortExplanation: explanation,
        methodology: 'SSA Ambiguous Case Test: Compare side a with altitude h = b * sin(A) and side b',
        formulaUsed: 'h = b \\sin A',
        stepByStep: [
          {
            stepNumber: 1,
            title: 'Calculate the triangle altitude h',
            explanation: `Calculate minimum height needed: $h = b \\sin A = ${b} \\sin(${angleA}^\\circ) \\approx ${h}$.`,
            mathFormula: `h = ${b} \\sin(${angleA}^\\circ) = ${h}`
          },
          {
            stepNumber: 2,
            title: 'Compare side lengths',
            explanation,
            result: correctAns
          }
        ],
        acceptableAnswers: [correctAns, correctLabel]
      };
    }

    // SSS largest angle problem (e.g. 18, 24, 30 or 10, 14, 16)
    const mult = randomChoice([3, 4, 5, 6]);
    const sides = [3 * mult, 4 * mult, 5 * mult]; // Right triangle Pythagorean triple!
    const [a, b, c] = sides;

    const questionText = `A triangular field has side lengths of $${a}\\text{ m}$, $${b}\\text{ m}$, and $${c}\\text{ m}$. What is the measure of its largest angle?`;
    const correctAns = '90°';
    const distractors = ['75.52°', '82.36°', '95.48°', '102.50°'];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trig-l3-sss-${Date.now()}-${Math.random()}`,
      topicId: 'law-of-sines-cosines',
      topicName: 'Law of Sines & Law of Cosines',
      difficulty: 3,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `The largest angle is opposite the longest side ($c = ${c}$). Since ${a}^2 + ${b}^2 = ${a*a} + ${b*b} = ${c*c} = ${c}^2$, by the Converse of the Pythagorean Theorem (or Law of Cosines $\\cos C = \\frac{${a}^2 + ${b}^2 - ${c}^2}{2(${a})(${b})} = 0$), angle $C = 90^\\circ$.`,
      methodology: 'Law of Cosines (SSS): cos(C) = (a^2 + b^2 - c^2) / (2ab)',
      formulaUsed: '\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Identify the largest angle',
          explanation: `The largest angle $C$ lies opposite the longest side $c = ${c}\\text{ m}$.`
        },
        {
          stepNumber: 2,
          title: 'Apply the Law of Cosines formula',
          explanation: `$\\cos C = \\frac{${a}^2 + ${b}^2 - ${c}^2}{2 \\cdot ${a} \\cdot ${b}} = \\frac{${a*a + b*b - c*c}}{${2*a*b}} = 0 \\implies C = 90^\\circ$.`,
          result: '90°'
        }
      ],
      acceptableAnswers: ['90°', '90', '90 degrees', correctAns, correctLabel]
    };
  }

  if (level === 4) {
    // Level 4: Applied navigation / rescue team word problem
    const scenarios = [
      { name: 'Two hikers', unit: 'km', a: 12, b: 16, angle: 75 },
      { name: 'A rescue search boat', unit: 'km', a: 18, b: 24, angle: 65 },
      { name: 'Two radar beacons', unit: 'miles', a: 15, b: 22, angle: 70 }
    ];
    const s = randomChoice(scenarios);
    const rad = (s.angle * Math.PI) / 180;
    const distSq = s.a * s.a + s.b * s.b - 2 * s.a * s.b * Math.cos(rad);
    const dist = round2(Math.sqrt(distSq));

    const questionText = `${s.name} travel from the same base station along straight paths measuring $${s.a}\\text{ ${s.unit}}$ and $${s.b}\\text{ ${s.unit}}$ with an included angle of $${s.angle}^\\circ$. Approximately how far apart are they?`;
    const correctAns = `${dist} ${s.unit}`;
    const distractors = [
      `${round2(dist * 0.92)} ${s.unit}`,
      `${round2(dist * 1.08)} ${s.unit}`,
      `${round2(dist + 3.66)} ${s.unit}`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `trig-l4-${Date.now()}-${Math.random()}`,
      topicId: 'law-of-sines-cosines',
      topicName: 'Law of Sines & Law of Cosines',
      difficulty: 4,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Apply the Law of Cosines: $d = \\sqrt{${s.a}^2 + ${s.b}^2 - 2(${s.a})(${s.b})\\cos(${s.angle}^\\circ)} \\approx ${dist}\\text{ ${s.unit}}$.`,
      methodology: 'Law of Cosines Applied Distance Formula: d^2 = a^2 + b^2 - 2ab cos(theta)',
      formulaUsed: 'd^2 = a^2 + b^2 - 2ab \\cos \\theta',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Model the scenario as a triangle (SAS)',
          explanation: `The campsite and two positions form $\\triangle ABC$ with sides $a = ${s.a}$, $b = ${s.b}$, and angle $\\theta = ${s.angle}^\\circ$.`
        },
        {
          stepNumber: 2,
          title: 'Solve for the direct separation distance',
          explanation: `$d = \\sqrt{${s.a * s.a} + ${s.b * s.b} - ${2 * s.a * s.b}\\cos(${s.angle}^\\circ)} = \\sqrt{${round2(distSq)}} \\approx ${dist}\\text{ ${s.unit}}$.`,
          result: `${dist} ${s.unit}`
        }
      ],
      acceptableAnswers: [`${dist}`, `${dist} ${s.unit}`, correctAns, correctLabel]
    };
  }

  // Level 5: Challenging multi-step bearing problem or solving the second triangle in SSA
  const angleA = 35;
  const a = 10;
  const b = 14;
  // Sin B = (b * sin A) / a = 14 * sin(35°) / 10 = 0.8030
  const sinB = (b * Math.sin((35 * Math.PI) / 180)) / a;
  const angleB1 = round2((Math.asin(sinB) * 180) / Math.PI); // acute ~53.4°
  const angleB2 = round2(180 - angleB1); // obtuse ~126.6°
  const angleC2 = round2(180 - angleA - angleB2); // ~18.4°
  const c2 = round2((a * Math.sin((angleC2 * Math.PI) / 180)) / Math.sin((35 * Math.PI) / 180));

  const questionText = `In the ambiguous case where $A = 35^\\circ$, $a = 10\\text{ cm}$, and $b = 14\\text{ cm}$, two distinct triangles exist. For the triangle where angle $B$ is obtuse, what is the length of side $c$? (Round to two decimal places)`;
  const correctAns = `${c2} cm`;
  const distractors = [
    `${round2(c2 + 12.8)} cm`,
    `${round2(c2 * 1.55)} cm`,
    `${round2(c2 * 0.72)} cm`
  ];

  const { options, correctLabel } = buildOptions(correctAns, distractors);

  return {
    id: `trig-l5-${Date.now()}-${Math.random()}`,
    topicId: 'law-of-sines-cosines',
    topicName: 'Law of Sines & Law of Cosines',
    difficulty: 5,
    questionText,
    options,
    correctAnswer: correctAns,
    correctOptionLabel: correctLabel,
    shortExplanation: `Step 1: $\\sin B = \\frac{14\\sin(35^\\circ)}{10} \\approx ${round2(sinB)}$. The obtuse angle is $B_2 = 180^\\circ - ${angleB1}^\\circ = ${angleB2}^\\circ$. Step 2: $C_2 = 180^\\circ - 35^\\circ - ${angleB2}^\\circ = ${angleC2}^\\circ$. Step 3: $c_2 = \\frac{10\\sin(${angleC2}^\\circ)}{\\sin(35^\\circ)} \\approx ${c2}\\text{ cm}$.`,
    methodology: 'Multi-Step Ambiguous Case Obtuse Triangle Resolution',
    formulaUsed: '\\sin B = \\frac{b \\sin A}{a}, \\quad B_2 = 180^\\circ - B_1, \\quad c_2 = \\frac{a \\sin C_2}{\\sin A}',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Find the obtuse angle B',
        explanation: `Calculate acute angle $B_1 = \\arcsin(${round2(sinB)}) = ${angleB1}^\\circ$. The obtuse angle is $B_2 = 180^\\circ - ${angleB1}^\\circ = ${angleB2}^\\circ$.`,
        result: `${angleB2}°`
      },
      {
        stepNumber: 2,
        title: 'Compute third angle C',
        explanation: `Subtract from $180^\\circ$: $C_2 = 180^\\circ - 35^\\circ - ${angleB2}^\\circ = ${angleC2}^\\circ$.`,
        result: `${angleC2}°`
      },
      {
        stepNumber: 3,
        title: 'Calculate missing side c using Law of Sines',
        explanation: `$c_2 = \\frac{10 \\cdot \\sin(${angleC2}^\\circ)}{\\sin(35^\\circ)} \\approx ${c2}\\text{ cm}$.`,
        result: `${c2} cm`
      }
    ],
    acceptableAnswers: [`${c2}`, `${c2} cm`, correctAns, correctLabel]
  };
}

// -------------------------------------------------------------
// 3. QUADRATIC INEQUALITIES & INTERVALS GENERATOR
// -------------------------------------------------------------
export function generateQuadraticInequalityProblem(level: DifficultyLevel): PracticeProblem {
  if (level === 1) {
    // Level 1: Difference of squares quadratic inequality like x^2 - k^2 < 0 or x^2 - k^2 >= 0
    const k = randomChoice([3, 4, 5, 6, 7, 8]);
    const kSq = k * k;
    const isStrictLess = Math.random() > 0.5;

    let questionText = '';
    let correctAns = '';
    let distractors: string[] = [];
    let formula = '';
    let explanation = '';

    if (isStrictLess) {
      questionText = `Solve the quadratic inequality: $x^2 - ${kSq} < 0$.`;
      correctAns = `-${k} < x < ${k}`;
      distractors = [
        `x < -${k}`,
        `x > ${k}`,
        `x \\le -${k} \\text{ or } x \\ge ${k}`
      ];
      formula = 'x^2 - k^2 < 0 \\iff -k < x < k';
      explanation = `Factor as $(x - ${k})(x + ${k}) < 0$. The roots are $x = -${k}$ and $x = ${k}$. The expression is strictly negative between the two roots, yielding $-${k} < x < ${k}$.`;
    } else {
      questionText = `Solve the quadratic inequality: $x^2 - ${kSq} \\ge 0$.`;
      correctAns = `x \\le -${k} \\text{ or } x \\ge ${k}`;
      distractors = [
        `-${k} \\le x \\le ${k}`,
        `x \\ge ${k}`,
        `x < -${k} \\text{ or } x > ${k}`
      ];
      formula = 'x^2 - k^2 \\ge 0 \\iff x \\le -k \\text{ or } x \\ge k';
      explanation = `Factor as $(x - ${k})(x + ${k}) \\ge 0$. The expression is positive outside the roots, yielding $x \\le -${k} \\text{ or } x \\ge ${k}$.`;
    }

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `quad-l1-${Date.now()}-${Math.random()}`,
      topicId: 'quadratic-inequalities',
      topicName: 'Quadratic Inequalities & Intervals',
      difficulty: 1,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: explanation,
      methodology: 'Factoring difference of squares and testing sign intervals',
      formulaUsed: formula,
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Find critical boundary values',
          explanation: `Set $x^2 - ${kSq} = 0 \\implies (x - ${k})(x + ${k}) = 0 \\implies x = -${k}, ${k}$.`
        },
        {
          stepNumber: 2,
          title: 'Test sign intervals',
          explanation,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  if (level === 2) {
    // Level 2: Factored form with interval notation conversion
    const r1 = randomChoice([1, 2, 3, 4]);
    const r2 = r1 + randomChoice([3, 4, 5, 6]);
    const isLeq = Math.random() > 0.5;

    let questionText = '';
    let correctAns = '';
    let distractors: string[] = [];
    let explanation = '';

    if (isLeq) {
      questionText = `Which interval notation represents the complete solution set of $(x - ${r1})(x - ${r2}) \\le 0$?`;
      correctAns = `[${r1}, ${r2}]`;
      distractors = [
        `(-\\infty, ${r1}]`,
        `[${r2}, \\infty)`,
        `(-\\infty, ${r1}] \\cup [${r2}, \\infty)`
      ];
      explanation = `Since $(x - ${r1})(x - ${r2}) \\le 0$, the parabola opens upward and is non-positive between the roots $x = ${r1}$ and $x = ${r2}$ inclusive, which is written as $[${r1}, ${r2}]$.`;
    } else {
      questionText = `Which interval notation represents the complete solution set of $(x - ${r1})(x - ${r2}) > 0$?`;
      correctAns = `(-\\infty, ${r1}) \\cup (${r2}, \\infty)`;
      distractors = [
        `(${r1}, ${r2})`,
        `(-\\infty, ${r1}]`,
        `[${r2}, \\infty)`
      ];
      explanation = `The product is strictly positive strictly to the left of the smaller root and strictly to the right of the larger root: $(-\\infty, ${r1}) \\cup (${r2}, \\infty)$.`;
    }

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `quad-l2-${Date.now()}-${Math.random()}`,
      topicId: 'quadratic-inequalities',
      topicName: 'Quadratic Inequalities & Intervals',
      difficulty: 2,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: explanation,
      methodology: 'Interval Notation for Quadratic Solutions',
      formulaUsed: '(x - r_1)(x - r_2) \\le 0 \\implies [r_1, r_2]',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Identify the roots',
          explanation: `Setting each factor to zero gives roots at $x = ${r1}$ and $x = ${r2}$.`
        },
        {
          stepNumber: 2,
          title: 'Write solution in interval notation',
          explanation,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  if (level === 3) {
    // Level 3: Unfactored standard quadratic inequality: x^2 - Sx + P <= 0
    const r1 = randomChoice([-4, -3, -2, 1, 2]);
    const r2 = r1 + randomChoice([3, 4, 5]);
    const sum = r1 + r2;
    const prod = r1 * r2;

    const bSign = sum >= 0 ? `- ${sum}x` : `+ ${Math.abs(sum)}x`;
    const cSign = prod >= 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;

    const questionText = `Solve the quadratic inequality: $x^2 ${bSign} ${cSign} \\le 0$.`;
    const correctAns = `${r1} \\le x \\le ${r2}`;
    const distractors = [
      `x \\le ${r1} \\text{ or } x \\ge ${r2}`,
      `x \\le ${r1}`,
      `${-r2} \\le x \\le ${-r1}`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `quad-l3-${Date.now()}-${Math.random()}`,
      topicId: 'quadratic-inequalities',
      topicName: 'Quadratic Inequalities & Intervals',
      difficulty: 3,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Factor $x^2 ${bSign} ${cSign}$ into $(x - (${r1}))(x - (${r2})) \\le 0$. The solution set between the critical points is $${r1} \\le x \\le ${r2}$.`,
      methodology: 'Factoring Quadratic Polynomials and Number Line Analysis',
      formulaUsed: 'x^2 - (r_1 + r_2)x + r_1 r_2 = (x - r_1)(x - r_2)',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Factor the quadratic expression',
          explanation: `Find two numbers that multiply to $${prod}$ and add to $${-sum}$: the roots are $x = ${r1}$ and $x = ${r2}$.`,
          mathFormula: `(x - (${r1}))(x - (${r2})) \\le 0`
        },
        {
          stepNumber: 2,
          title: 'Determine the valid interval',
          explanation: `Because the inequality is $\\le 0$, the solution includes the endpoints: $${r1} \\le x \\le ${r2}$.`,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  if (level === 4) {
    // Level 4: Applied geometric area word problem (like the playground item from the PDF)
    const diff = randomChoice([4, 5, 6, 7, 8]);
    const width = randomChoice([7, 8, 9, 10]);
    const areaMin = width * (width + diff);

    const questionText = `A rectangular playground has a width of $x$ meters and a length that is $${diff}$ meters longer than its width. The playground must have an area of at least $${areaMin}\\text{ m}^2$. Which inequality accurately models this situation, and what is the minimum allowable width?`;
    const correctAns = `x(x + ${diff}) \\ge ${areaMin} \\implies x \\ge ${width}\\text{ m}`;
    const distractors = [
      `x(x + ${diff}) \\le ${areaMin} \\implies x \\le ${width}\\text{ m}`,
      `2x + ${diff} \\ge ${areaMin} \\implies x \\ge ${Math.floor(areaMin / 2)}\\text{ m}`,
      `x^2 + ${diff} \\ge ${areaMin} \\implies x \\ge ${width + 1}\\text{ m}`
    ];

    const { options, correctLabel } = buildOptions(correctAns, distractors);

    return {
      id: `quad-l4-${Date.now()}-${Math.random()}`,
      topicId: 'quadratic-inequalities',
      topicName: 'Quadratic Inequalities & Intervals',
      difficulty: 4,
      questionText,
      options,
      correctAnswer: correctAns,
      correctOptionLabel: correctLabel,
      shortExplanation: `Area is $\\text{width} \\times \\text{length} = x(x + ${diff})$. The condition "at least ${areaMin}" translates to $x(x + ${diff}) \\ge ${areaMin}$. Solving $x^2 + ${diff}x - ${areaMin} \\ge 0 \\implies (x - ${width})(x + ${width + diff}) \\ge 0$. Since width must be positive ($x > 0$), we obtain $x \\ge ${width}\\text{ m}$.`,
      methodology: 'Geometric Area Modeling with Quadratic Inequalities',
      formulaUsed: '\\text{Area} = \\text{Width} \\times \\text{Length} \\ge A_{\\min}',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Formulate the inequality',
          explanation: `Length is $x + ${diff}$, so $\\text{Area} = x(x + ${diff}) \\ge ${areaMin}$.`
        },
        {
          stepNumber: 2,
          title: 'Solve for the positive critical value',
          explanation: `$x^2 + ${diff}x - ${areaMin} = (x - ${width})(x + ${width + diff}) \\ge 0$. Since physical length $x > 0$, the minimum width is $x \\ge ${width}\\text{ m}$.`,
          result: correctAns
        }
      ],
      acceptableAnswers: [correctAns, correctLabel]
    };
  }

  // Level 5: Compound rational or multi-constraint quadratic inequality
  const a = randomInt(2, 4);
  const b = a + 3;
  const questionText = `Find the set of all real numbers $x$ satisfying the rational inequality: $\\frac{x - ${a}}{x - ${b}} \\ge 0$.`;
  const correctAns = `(-\\infty, ${a}] \\cup (${b}, \\infty)`;
  const distractors = [
    `[${a}, ${b})`,
    `[${a}, ${b}]`,
    `(-\\infty, ${a}) \\cup [${b}, \\infty)`
  ];

  const { options, correctLabel } = buildOptions(correctAns, distractors);

  return {
    id: `quad-l5-${Date.now()}-${Math.random()}`,
    topicId: 'quadratic-inequalities',
    topicName: 'Quadratic Inequalities & Intervals',
    difficulty: 5,
    questionText,
    options,
    correctAnswer: correctAns,
    correctOptionLabel: correctLabel,
    shortExplanation: `The numerator is zero at $x = ${a}$ (included because of $\\ge 0$). The denominator is zero at $x = ${b}$ (excluded because division by zero is undefined). A sign table shows the fraction is non-negative on $(-\\infty, ${a}] \\cup (${b}, \\infty)$.`,
    methodology: 'Rational Inequality Sign Analysis with Boundary Exclusions',
    formulaUsed: '\\frac{P(x)}{Q(x)} \\ge 0 \\implies P(x)Q(x) \\ge 0 \\text{ with } Q(x) \\ne 0',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Find critical test values and domain restrictions',
        explanation: `Numerator root: $x = ${a}$ (closed point). Denominator restriction: $x \\ne ${b}$ (open point).`
      },
      {
        stepNumber: 2,
        title: 'Analyze signs across intervals',
        explanation: `Interval 1 ($x < ${a}$): $(-)/(-) = +$. Interval 2 ($${a} < x < ${b}$): $(+)/(-) = -$. Interval 3 ($x > ${b}$): $(+)/(+) = +$.`,
        result: correctAns
      }
    ],
    acceptableAnswers: [correctAns, correctLabel]
  };
}

// -------------------------------------------------------------
// MAIN GENERATOR DISPATCHER
// -------------------------------------------------------------
export function generateProblemForTopic(topicId: string, difficulty: DifficultyLevel): PracticeProblem {
  if (topicId === 'transformations') {
    return generateTransformationProblem(difficulty);
  }
  if (topicId === 'law-of-sines-cosines') {
    return generateTrigonometryProblem(difficulty);
  }
  if (topicId === 'quadratic-inequalities') {
    return generateQuadraticInequalityProblem(difficulty);
  }

  // Fallback: cycle randomly between available generators
  const generators = [generateTransformationProblem, generateTrigonometryProblem, generateQuadraticInequalityProblem];
  return randomChoice(generators)(difficulty);
}
