import { GoogleGenerativeAI } from '@google/genai';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface LanguageDetection {
  language: string;
  confidence: number;
}

class TranslationService {
  private genAI: GoogleGenerativeAI | null = null;
  private cache: Map<string, TranslationResult> = new Map();
  private glossary: Map<string, Map<string, string>> = new Map();

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // Detect language
  async detectLanguage(text: string): Promise<LanguageDetection> {
    if (!this.genAI) throw new Error('Translation service not initialized');

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Detect the language of this text and respond with ONLY the language code (e.g., 'en', 'es', 'fr', 'de', 'zh', 'ja', 'ar'): "${text}"`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim().toLowerCase();
      
      return {
        language: response,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Language detection failed:', error);
      return { language: 'en', confidence: 0.5 };
    }
  }

  // Translate text
  async translate(params: {
    text: string;
    targetLanguage: string;
    sourceLanguage?: string;
    context?: string;
  }): Promise<TranslationResult> {
    const { text, targetLanguage, sourceLanguage, context } = params;

    // Check cache
    const cacheKey = `${text}-${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (!this.genAI) throw new Error('Translation service not initialized');

    try {
      // Detect source language if not provided
      const sourceLang = sourceLanguage || (await this.detectLanguage(text)).language;

      // Apply glossary terms
      let textToTranslate = text;
      const glossaryTerms = this.glossary.get(targetLanguage);
      if (glossaryTerms) {
        glossaryTerms.forEach((translation, term) => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          textToTranslate = textToTranslate.replace(regex, `[GLOSSARY:${translation}]`);
        });
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      let prompt = `Translate the following text from ${sourceLang} to ${targetLanguage}. `;
      prompt += `Maintain the tone and style. `;
      if (context) {
        prompt += `Context: ${context}. `;
      }
      prompt += `Replace [GLOSSARY:term] with the term directly. `;
      prompt += `Respond with ONLY the translation, no explanations:\n\n"${textToTranslate}"`;

      const result = await model.generateContent(prompt);
      let translatedText = result.response.text().trim();

      // Clean up glossary markers
      translatedText = translatedText.replace(/\[GLOSSARY:([^\]]+)\]/g, '$1');

      const translationResult: TranslationResult = {
        originalText: text,
        translatedText,
        sourceLanguage: sourceLang,
        targetLanguage,
        confidence: 0.85
      };

      // Cache result
      this.cache.set(cacheKey, translationResult);

      return translationResult;
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  // Batch translate
  async translateBatch(params: {
    texts: string[];
    targetLanguage: string;
    sourceLanguage?: string;
  }): Promise<TranslationResult[]> {
    const { texts, targetLanguage, sourceLanguage } = params;
    
    return Promise.all(
      texts.map(text => 
        this.translate({ text, targetLanguage, sourceLanguage })
      )
    );
  }

  // Add glossary term
  addGlossaryTerm(language: string, term: string, translation: string) {
    if (!this.glossary.has(language)) {
      this.glossary.set(language, new Map());
    }
    this.glossary.get(language)!.set(term, translation);
  }

  // Remove glossary term
  removeGlossaryTerm(language: string, term: string) {
    this.glossary.get(language)?.delete(term);
  }

  // Get all glossary terms for a language
  getGlossary(language: string): Map<string, string> {
    return this.glossary.get(language) || new Map();
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'tr', name: 'Turkish' },
      { code: 'pl', name: 'Polish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'fi', name: 'Finnish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'cs', name: 'Czech' },
      { code: 'el', name: 'Greek' },
      { code: 'he', name: 'Hebrew' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'id', name: 'Indonesian' }
    ];
  }
}

export const translationService = new TranslationService();
