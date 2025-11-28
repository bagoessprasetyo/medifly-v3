
import { MedicalEntity } from '../types';

// Access API Key securely
const getHuggingFaceKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.VITE_HUGGING_FACE_API_KEY) {
    return process.env.VITE_HUGGING_FACE_API_KEY;
  }
  if ((import.meta as any).env?.VITE_HUGGING_FACE_API_KEY) {
    return (import.meta as any).env.VITE_HUGGING_FACE_API_KEY;
  }
  return '';
};

const HF_API_KEY = getHuggingFaceKey();

// Updated to use OpenMed model as requested for Deep Focus mode
// Model: OpenMed/OpenMed-NER-DiseaseDetect-SuperClinical-434M
// Note: We use direct fetch here to maintain lightweight "InferenceClient" behavior without adding heavy SDK dependencies to the bundle.
const MODEL_ID = "OpenMed/OpenMed-NER-DiseaseDetect-SuperClinical-434M"; 
const API_URL = (import.meta as any).env.DEV 
  ? `/api/huggingface/models/${MODEL_ID}`
  : `https://your-backend.com/api/huggingface/models/${MODEL_ID}`;

/**
 * Parses the raw token output from the NER model into structured entities.
 * The model typically returns B- (Beginning) and I- (Inside) tags, or aggregated entity groups.
 */
const processNERResponse = (tokens: any[]): MedicalEntity[] => {
  const entities: MedicalEntity[] = [];
  
  // Helper to map OpenMed specific labels to our simplified categories
  // We handle both specific OpenMed labels and standard biomedical NER tags
  const mapCategory = (label: string): 'Problem' | 'Treatment' | 'Test' | 'Anatomy' | 'Drug' => {
    const l = label.toLowerCase();
    
    // Broad matching for robustness across different model versions/fine-tunes
    if (l.includes('diagnostic') || l.includes('test') || l.includes('investigation')) return 'Test';
    if (l.includes('problem') || l.includes('disease') || l.includes('sign') || l.includes('symptom') || l.includes('disorder')) return 'Problem';
    if (l.includes('treatment') || l.includes('therapeutic') || l.includes('procedure') || l.includes('surgery')) return 'Treatment';
    if (l.includes('anatomy') || l.includes('biological') || l.includes('body')) return 'Anatomy';
    if (l.includes('chemical') || l.includes('drug') || l.includes('medication')) return 'Drug';
    
    return 'Problem'; // Fallback
  };

  // Sort by start index to ensure correct order
  const sortedTokens = [...tokens].sort((a, b) => (a.start || 0) - (b.start || 0));

  for (const token of sortedTokens) {
    // entity_group is available when aggregation_strategy="simple" is used
    const label = token.entity_group || token.entity || "Unknown"; 
    const word = token.word;
    const score = token.score;
    
    entities.push({
      text: word.trim(),
      category: mapCategory(label),
      confidenceScore: score
    });
  }

  // Deduplicate by text to clean up the dashboard
  const uniqueEntities = entities.filter((e, index, self) =>
    index === self.findIndex((t) => (
      t.text.toLowerCase() === e.text.toLowerCase()
    ))
  );

  return uniqueEntities;
};

/**
 * Fallback simulation if no API key is present or API fails.
 * Uses regex heuristics to extract common medical terms for demo purposes.
 */
const simulateAnalysis = (text: string): MedicalEntity[] => {
  const entities: MedicalEntity[] = [];
  
  // Basic Regex Heuristics for Demo
  const patterns = [
    { regex: /\b(cancer|diabetes|hypertension|infection|disease|syndrome|disorder|pain|fever|injury|fracture|arrhythmia|tumor|lesion)\b/gi, category: 'Problem' },
    { regex: /\b(surgery|therapy|transplant|procedure|biopsy|rehabilitation|dialysis|chemotherapy|radiation|excision|resection)\b/gi, category: 'Treatment' },
    { regex: /\b(mri|ct scan|x-ray|blood test|ultrasound|ecg|biopsy|screening|blood count|urinalysis)\b/gi, category: 'Test' },
    { regex: /\b(heart|lung|liver|kidney|brain|bone|spine|knee|stomach|blood|artery|vein|tissue)\b/gi, category: 'Anatomy' },
    { regex: /\b(aspirin|insulin|antibiotics|medication|drug|vaccine|anesthesia|metformin|lisinopril|statin)\b/gi, category: 'Drug' }
  ] as const;

  patterns.forEach(({ regex, category }) => {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        entities.push({
          text: match,
          category: category,
          confidenceScore: 0.85 + Math.random() * 0.1
        });
      });
    }
  });

  // Deduplicate
  return entities.filter((e, index, self) =>
    index === self.findIndex((t) => (
      t.text.toLowerCase() === e.text.toLowerCase()
    ))
  );
};

export const analyzeMedicalText = async (text: string): Promise<{ entities: MedicalEntity[], provider: 'OpenHealth AI' | 'Simulated' }> => {
  // 1. Simulation Mode (Fallback)
  if (!HF_API_KEY) {
    console.log("No HF API Key found. Using local simulation for Medical NER.");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                entities: simulateAnalysis(text), 
                provider: 'Simulated' 
            });
        }, 1200); // Fake delay for realism
    });
  }

  // 2. Real API Call using fetch (Lightweight equivalent of InferenceClient)
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
            aggregation_strategy: "simple" // Smartly groups tokens (e.g. "Lung" + "Cancer" -> "Lung Cancer")
        },
        options: {
            wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
        throw new Error(`HF API Error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Handle case where model is loading
    if (result.error && result.error.includes("loading")) {
        throw new Error("Model loading");
    }

    return {
        entities: processNERResponse(result),
        provider: 'OpenHealth AI'
    };

  } catch (error) {
    console.warn("OpenMed Analysis failed (falling back to simulation):", error);
    // Fallback to simulation on error so UI doesn't break
    return {
        entities: simulateAnalysis(text),
        provider: 'Simulated'
    };
  }
};
