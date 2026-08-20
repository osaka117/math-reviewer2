import { MathTopic, DifficultyInfo } from '../types/math';

export const DIFFICULTY_LEVELS: DifficultyInfo[] = [
  {
    level: 1,
    label: 'Level 1 — Basic',
    name: 'Basic',
    description: 'Direct definitions, simple one-step calculations, and standard integer formulas.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    level: 2,
    label: 'Level 2 — Easy',
    name: 'Easy',
    description: 'Straightforward application of formulas with standard positive/negative values and simple decimals.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800'
  },
  {
    level: 3,
    label: 'Level 3 — Intermediate',
    name: 'Intermediate',
    description: 'Two-step calculations, algebraic rearrangements, and standard applied scenarios.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  },
  {
    level: 4,
    label: 'Level 4 — Hard',
    name: 'Hard',
    description: 'Multi-step problems, real-world context word problems, and non-obvious angle/boundary constraints.',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
  },
  {
    level: 5,
    label: 'Level 5 — Challenging',
    name: 'Challenging',
    description: 'Complex multi-concept synthesis, SSA ambiguous case determination, and compound inequality constraints.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
  }
];

export const DEFAULT_DOCUMENT_NAME = 'Skill-Building Activity #3 (Mathematics 10).pdf';

export const DEFAULT_MATH_TOPICS: MathTopic[] = [
  {
    id: 'transformations',
    name: 'Geometric Transformations',
    category: 'Coordinate Geometry',
    description: 'Rigid motions on the Cartesian plane including translations, reflections across axes, and origin rotations.',
    formulas: [
      'Translation: (x, y) \\to (x + h, y + k)',
      'Reflection over x-axis: (x, y) \\to (x, -y)',
      'Reflection over y-axis: (x, y) \\to (-x, y)',
      'Rotation 180^{\\circ} about origin: (x, y) \\to (-x, -y)',
      'Rotation 90^{\\circ} CW / 270^{\\circ} CCW: (x, y) \\to (y, -x)',
      'Rotation 90^{\\circ} CCW / 270^{\\circ} CW: (x, y) \\to (-y, x)'
    ],
    keyConcepts: [
      'Coordinate shifts (left/right, up/down)',
      'x-axis and y-axis reflections',
      'Point rotation about (0,0)',
      'Vector translations in real-world contexts'
    ]
  },
  {
    id: 'law-of-sines-cosines',
    name: 'Law of Sines & Law of Cosines',
    category: 'Trigonometry',
    description: 'Solving oblique triangles, finding missing sides/angles, and evaluating SSA ambiguous cases.',
    formulas: [
      '\\text{Law of Sines: } \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
      '\\text{Law of Cosines (Side): } c^2 = a^2 + b^2 - 2ab \\cos C',
      '\\text{Law of Cosines (Angle): } \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
      '\\text{Altitude: } h = b \\sin A',
      '\\text{Ambiguous Case (SSA): Compare } a \\text{ with } h = b\\sin A'
    ],
    keyConcepts: [
      'Solving AAS and ASA triangles using Law of Sines',
      'Solving SAS and SSS triangles using Law of Cosines',
      'Identifying the SSA Ambiguous Case (0, 1, or 2 triangles)',
      'Distance and navigation angle word problems',
      'Largest angle corresponds to the longest side'
    ]
  },
  {
    id: 'quadratic-inequalities',
    name: 'Quadratic Inequalities & Intervals',
    category: 'Algebra',
    description: 'Solving single-variable quadratic inequalities, factoring, boundary critical points, and interval notation.',
    formulas: [
      'x^2 - k^2 < 0 \\implies -k < x < k',
      '(x - r_1)(x - r_2) \\le 0 \\implies r_1 \\le x \\le r_2 \\quad (r_1 \\le r_2)',
      '(x - r_1)(x - r_2) \\ge 0 \\implies x \\le r_1 \\text{ or } x \\ge r_2',
      '\\text{Intervals: } [a, b], \\; (-\\infty, a] \\cup [b, \\infty), \\; (a, b)',
      '\\text{Area Inequality: } x(x + d) \\ge A'
    ],
    keyConcepts: [
      'Finding roots / critical test values of quadratic equations',
      'Testing sign intervals on a number line',
      'Expressing inequality solutions in interval notation [a, b]',
      'Real-world area and perimeter inequality models'
    ]
  }
];

export const DEFAULT_RAW_TEXT = `Skill–Building Activity #3 (Mathematics 10)
Direction: Read each question carefully. Choose the letter of the best answer.
1. Point A(5,−2) is translated 3 units left and 4 units up. What are the new coordinates of A?
2. Point P(−4,6) is reflected across the x-axis. What are the new coordinates of P?
3. Point Q(3,−7) is rotated 180° about the origin. What are the new coordinates of Q?
4. A package delivery drone is located at (8,5). Due to a software update, its map is reflected across the y-axis. What are the drone's new coordinates?
5. In △ABC, A=42°, B=68°, and a=14 cm. What is the length of side b?
6. Given A=35°, a=9, and b=12, how many triangles are possible?
7. A rescue team travels 18 km from a base camp. The angle opposite this side is 35°, while another angle measures 65°. Approximately how far is the second side?
8. Which situation illustrates the ambiguous case? a. SAS b. ASA c. SSA d. SSS
9. Find the third side of a triangle with sides 10 cm and 15 cm and an included angle of 60°.
10. Two hikers walk 12 km and 16 km from the same campsite with an included angle of 75°. Approximately how far apart are they?
11. A triangular field has sides 18 m, 24 m, and 30 m. What is the measure of its largest angle?
12. Solve x^2 - 25 < 0.
13. Solve (x - 3)(x - 8) <= 0.
14. Which interval notation represents the solution of Item 13?
15. A rectangular playground has a width of x meters and a length that is 6 meters longer than its width. The playground must have an area of at least 91 m². Which inequality represents the situation?`;
