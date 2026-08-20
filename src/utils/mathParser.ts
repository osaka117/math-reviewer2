import * as pdfjsLib from 'pdfjs-dist';
import { DocumentAnalysisResult, MathTopic } from '../types/math';
import { DEFAULT_MATH_TOPICS } from './sampleData';

// Configure pdfjs worker for browser/client-side static execution
try {
  // Use cloudflare CDN worker or standard inline worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

// Math topic recognition patterns
const TOPIC_PATTERNS = [
  {
    id: 'transformations',
    name: 'Geometric Transformations',
    category: 'Coordinate Geometry',
    description: 'Translations, reflections across axes/lines, and origin rotations.',
    keywords: [
      'translated', 'translation', 'reflected', 'reflection', 'rotated', 'rotation',
      'x-axis', 'y-axis', 'origin', 'coordinates', 'units left', 'units right',
      'units up', 'units down', 'degrees', '180°', '90°', 'rigid motion', 'vector'
    ],
    formulas: [
      'Translation: (x, y) \\to (x + h, y + k)',
      'Reflection over x-axis: (x, y) \\to (x, -y)',
      'Reflection over y-axis: (x, y) \\to (-x, y)',
      'Rotation 180^{\\circ} about origin: (x, y) \\to (-x, -y)'
    ],
    keyConcepts: ['Translations', 'Axis Reflections', 'Rotations', 'Coordinate Rules']
  },
  {
    id: 'law-of-sines-cosines',
    name: 'Law of Sines & Law of Cosines',
    category: 'Trigonometry',
    description: 'Solving oblique triangles, calculating unknown sides and angles, and the SSA ambiguous case.',
    keywords: [
      'triangle', '△abc', 'law of sines', 'law of cosines', 'ambiguous case',
      'sin', 'cos', 'included angle', 'ssa', 'sas', 'asa', 'sss', 'hypotenuse',
      'angle', 'side', 'opposite side', 'triangular', 'hikers', 'rescue team'
    ],
    formulas: [
      '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
      'c^2 = a^2 + b^2 - 2ab \\cos C',
      '\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
      'h = b \\sin A'
    ],
    keyConcepts: ['Law of Sines', 'Law of Cosines', 'SSA Ambiguous Case', 'Oblique Triangles']
  },
  {
    id: 'quadratic-inequalities',
    name: 'Quadratic Inequalities & Intervals',
    category: 'Algebra',
    description: 'Quadratic inequalities, critical root testing, interval notation, and physical area constraints.',
    keywords: [
      'solve', 'inequality', 'inequalities', 'x^2', 'interval notation',
      '<=', '>=', '≤', '≥', '<', '>', 'rectangular', 'playground', 'area of at least',
      'meters longer', 'maximum', 'minimum', 'factored', 'parabola'
    ],
    formulas: [
      'x^2 - k^2 < 0 \\iff -k < x < k',
      '(x - r_1)(x - r_2) \\le 0 \\implies [r_1, r_2]',
      'x(x + d) \\ge A'
    ],
    keyConcepts: ['Quadratic Inequalities', 'Interval Notation', 'Sign Charts', 'Area Inequality Word Problems']
  },
  {
    id: 'linear-algebra-systems',
    name: 'Linear Equations & Systems',
    category: 'Algebra',
    description: 'Systems of linear equations, slope-intercept form, and intersection points.',
    keywords: ['system of equations', 'linear equation', 'slope', 'intercept', 'y = mx + b', 'elimination', 'substitution'],
    formulas: ['y - y_1 = m(x - x_1)', 'Ax + By = C'],
    keyConcepts: ['Simultaneous Equations', 'Slope & Intercepts']
  },
  {
    id: 'calculus-derivatives',
    name: 'Calculus & Rates of Change',
    category: 'Calculus',
    description: 'Derivatives, tangent lines, and rate of change problems.',
    keywords: ['derivative', 'differentiate', 'integral', 'tangent line', 'limit', 'rate of change', 'dx', 'dy/dx'],
    formulas: ['\\frac{d}{dx} x^n = n x^{n-1}', 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}'],
    keyConcepts: ['Power Rule', 'Derivatives', 'Instantaneous Rate of Change']
  }
];

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // If it's a PDF file
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += `--- Page ${pageNum} ---\n` + pageText + '\n\n';
      }
      return fullText;
    } catch (pdfErr) {
      console.warn('PDF.js text parsing error, falling back to text stream:', pdfErr);
      // Fallback read as text if array buffer reading fails
      return await file.text();
    }
  }

  // If it's plain text, markdown, json, csv, etc.
  return await file.text();
}

export function analyzeMathContent(rawText: string, fileName: string, fileSize?: string): DocumentAnalysisResult {
  const lower = rawText.toLowerCase();

  // Math symbols to verify it is genuine math content
  const mathSymbols = ['=', '+', '-', '×', '÷', '/', '*', '^', '√', '²', '³', '°', '≤', '≥', '<', '>', '±', '△', 'π', 'sin', 'cos', 'tan', '∫', 'dx', 'lim'];
  const symbolHits = mathSymbols.filter(s => rawText.includes(s)).length;

  const detectedTopics: MathTopic[] = [];

  // Match topic patterns
  for (const pattern of TOPIC_PATTERNS) {
    let score = 0;
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        score++;
      }
    }

    if (score >= 2) {
      detectedTopics.push({
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        description: pattern.description,
        formulas: pattern.formulas,
        keyConcepts: pattern.keyConcepts
      });
    }
  }

  // If no specific topic matched or low symbol count, check validity
  const isValidMathDocument = detectedTopics.length > 0 || symbolHits >= 3;

  // If still empty but has some generic math, assign default matched topics
  const finalTopics = detectedTopics.length > 0 ? detectedTopics : (isValidMathDocument ? DEFAULT_MATH_TOPICS.slice(0, 2) : []);

  let warningMessage: string | undefined;
  if (!isValidMathDocument) {
    warningMessage = 'The uploaded file does not appear to contain recognizable math concepts, formulas, or problems. Please upload a math worksheet, textbook excerpt, syllabus, or problem set (e.g. PDF, TXT).';
  }

  // Count formulas and concepts
  let formulaCount = 0;
  let conceptCount = 0;
  finalTopics.forEach(t => {
    formulaCount += t.formulas.length;
    conceptCount += t.keyConcepts.length;
  });

  return {
    fileName,
    fileSize,
    detectedTopics: finalTopics,
    extractedTextPreview: rawText.slice(0, 400).trim() + (rawText.length > 400 ? '...' : ''),
    rawText,
    formulaCount,
    conceptCount,
    isValidMathDocument,
    warningMessage
  };
}
