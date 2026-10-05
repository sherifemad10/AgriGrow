import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { CURATED_RESEARCH } from "./researchData.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, "users.json");
const MAJORS_FILE = path.join(__dirname, "majorsData.json");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "drsherifemad@gmail.com").toLowerCase().trim();

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error loading users.json:", e);
  }
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving users.json:", e);
  }
}

function loadMajors() {
  try {
    if (fs.existsSync(MAJORS_FILE)) {
      const data = fs.readFileSync(MAJORS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error loading majorsData.json:", e);
  }
  return [];
}

function saveMajors(majors) {
  try {
    fs.writeFileSync(MAJORS_FILE, JSON.stringify(majors, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving majorsData.json:", e);
  }
}

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Verify if OpenAI API key is present and not a template placeholder
const isOpenAiKeyValid =
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY.trim() !== "" &&
  !process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY");

const openai = isOpenAiKeyValid
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// OpenAlex API key (optional, from https://openalex.org for higher rate limits)
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY?.trim() || null;

// In-memory cache for fast responses and rate-limit protection
const researchCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/*
|--------------------------------------------------------------------------
| Agricultural Fields & Keywords Mapping
|--------------------------------------------------------------------------
*/

const AGRICULTURAL_FIELDS = {
  "أراضي ومياه": [
    "soil",
    "soil science",
    "soil fertility",
    "soil chemistry",
    "soil management",
    "irrigation",
    "water management",
    "water resources",
    "salinity",
    "land evaluation",
  ],

  "زراعة رقمية": [
    "precision agriculture",
    "digital agriculture",
    "smart agriculture",
    "remote sensing",
    "gis agriculture",
    "agricultural remote sensing",
    "machine learning agriculture",
    "artificial intelligence agriculture",
    "iot agriculture",
    "uav",
    "drone",
  ],

  "زراعة مائية": [
    "hydroponics",
    "hydroponic",
    "soilless agriculture",
    "nutrient solution",
    "vertical farming",
    "aquaponics",
    "aeroponics",
  ],

  "إنتاج نباتي": [
    "crop science",
    "crop production",
    "agronomy",
    "plant production",
    "plant growth",
    "crop yield",
    "horticulture",
    "seed science",
    "wheat",
    "cereal",
  ],

  "وقاية وأمراض نبات": [
    "plant pathology",
    "plant disease",
    "crop disease",
    "plant protection",
    "pest management",
    "fungal disease",
    "insect pest",
    "biopesticide",
  ],

  "هندسة زراعية": [
    "agricultural engineering",
    "farm machinery",
    "agricultural machinery",
    "agricultural robotics",
    "farm automation",
    "post-harvest technology",
    "greenhouse",
  ],

  "اقتصاد وإدارة زراعية": [
    "agricultural economics",
    "agricultural marketing",
    "farm management",
    "agricultural policy",
    "food security",
    "agribusiness",
  ],
};

/*
|--------------------------------------------------------------------------
| Arabic to English Search Keywords for Bilingual Search
|--------------------------------------------------------------------------
*/
const ARABIC_SEARCH_TERMS = {
  قمح: ["wheat", "cereal", "grain"],
  تربة: ["soil", "salinity", "fertility"],
  ري: ["irrigation", "water management", "drip"],
  مياه: ["water", "saline", "hydrology"],
  طماطم: ["tomato", "solanaceous"],
  مائية: ["hydroponics", "aquaponics", "soilless"],
  ذكية: ["smart", "precision", "iot", "ai"],
  رقمية: ["digital", "remote sensing", "uav", "drone"],
  استشعار: ["remote sensing", "satellite", "ndvi"],
  طائرات: ["uav", "drone"],
  أمراض: ["disease", "pathology", "fungal", "wilt"],
  وقاية: ["protection", "pest", "biopesticide"],
  آفات: ["pest", "insect", "tuta"],
  تسميد: ["fertilizer", "nutrient", "nitrogen"],
  محاصيل: ["crop", "yield", "agronomy"],
  هندسة: ["engineering", "robotics", "tractor", "automation"],
  بيوت: ["greenhouse", "protected agriculture"],
  اقتصاد: ["economics", "food security", "supply chain"],
};

/*
|--------------------------------------------------------------------------
| Format Date Helper
|--------------------------------------------------------------------------
*/

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const monthsArabic = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const day = d.getDate();
  const month = monthsArabic[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

/*
|--------------------------------------------------------------------------
| Reconstruct OpenAlex Abstract
|--------------------------------------------------------------------------
*/

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return "";

  const words = [];

  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) {
      words[position] = word;
    }
  }

  return words.filter(Boolean).join(" ");
}

/*
|--------------------------------------------------------------------------
| Detect Agricultural Field
|--------------------------------------------------------------------------
*/

function detectField(work) {
  const text = `
    ${work.title || ""}
    ${work.display_name || ""}
    ${reconstructAbstract(work.abstract_inverted_index)}
    ${
      work.concepts
        ?.map((concept) => concept.display_name)
        .join(" ") || ""
    }
  `.toLowerCase();

  let bestField = "علوم زراعية";
  let highestScore = 0;

  for (const [field, keywords] of Object.entries(AGRICULTURAL_FIELDS)) {
    let score = 0;

    keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 2;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestField = field;
    }
  }

  return bestField;
}

/*
|--------------------------------------------------------------------------
| Is Agricultural Research?
|--------------------------------------------------------------------------
*/

function isAgriculturalResearch(work) {
  const text = `
    ${work.title || ""}
    ${work.display_name || ""}
    ${reconstructAbstract(work.abstract_inverted_index)}
    ${
      work.concepts
        ?.map((concept) => concept.display_name)
        .join(" ") || ""
    }
  `.toLowerCase();

  const agriculturalKeywords = [
    "agriculture",
    "agricultural",
    "agronomy",
    "soil",
    "crop",
    "plant",
    "irrigation",
    "hydroponic",
    "horticulture",
    "precision agriculture",
    "digital agriculture",
    "plant pathology",
    "farm",
    "farming",
    "fertilizer",
    "remote sensing",
    "pesticide",
    "harvest",
    "grain",
    "wheat",
    "seed",
  ];

  return agriculturalKeywords.some((keyword) => text.includes(keyword));
}

/*
|--------------------------------------------------------------------------
| Format OpenAlex Work Item
|--------------------------------------------------------------------------
*/

function formatOpenAlexWork(work) {
  const title = work.display_name || work.title || "بحث زراعي حديث";
  const abstract = reconstructAbstract(work.abstract_inverted_index);

  const authors =
    work.authorships
      ?.slice(0, 5)
      .map((author) => author.author?.display_name)
      .filter(Boolean) || [];

  const doi = work.doi || null;
  const landingPage = work.primary_location?.landing_page_url || null;
  const originalUrl = doi || landingPage || work.id;

  const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
    title
  )}`;

  return {
    id: work.id,
    title,
    year: work.publication_year,
    date: work.publication_date,
    dateFormatted: formatDate(work.publication_date),
    field: detectField(work),
    abstract,
    authors,
    journal:
      work.primary_location?.source?.display_name || "مجلة علمية محكّمة",
    doi,
    originalUrl,
    googleScholarUrl,
    pdfUrl: work.primary_location?.pdf_url || null,
    citedBy: work.cited_by_count || 0,
    type: work.type || "article",
  };
}

/*
|--------------------------------------------------------------------------
| Fetch Live Crossref Papers (Resilient Fallback for Custom Queries)
|--------------------------------------------------------------------------
*/

async function fetchCrossrefPapers(searchQuery, fromYear) {
  try {
    const encoded = encodeURIComponent(searchQuery);
    const url = `https://api.crossref.org/works?query=${encoded}&filter=type:journal-article,from-pub-date:${fromYear}-01-01&rows=15&sort=relevance`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "AgriGrowApp/1.0 (mailto:contact@agrigrow.org)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    const items = data.message?.items || [];

    return items
      .filter((item) => item.title && item.title.length > 0)
      .map((item, idx) => {
        const title = item.title[0];
        const year =
          item.published?.["date-parts"]?.[0]?.[0] || new Date().getFullYear();
        const month = item.published?.["date-parts"]?.[0]?.[1] || 1;
        const day = item.published?.["date-parts"]?.[0]?.[2] || 1;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;

        let cleanAbstract = item.abstract || "";
        cleanAbstract = cleanAbstract.replace(/<[^>]*>/g, "").trim();

        const authors = (item.author || [])
          .map((a) => `${a.given || ""} ${a.family || ""}`.trim())
          .filter(Boolean);

        const doi = item.DOI || null;
        const originalUrl = item.URL || (doi ? `https://doi.org/${doi}` : null);
        const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
          title
        )}`;

        // Match field
        const workSim = { title, display_name: title, abstract_inverted_index: null, concepts: [] };
        const matchedField = detectField(workSim);

        return {
          id: doi ? `doi:${doi}` : `crossref-${idx}-${Date.now()}`,
          title,
          year,
          date: dateStr,
          dateFormatted: formatDate(dateStr),
          field: matchedField,
          abstract:
            cleanAbstract ||
            `ورقة بحثية علمية محكّمة منشورة في ${
              item["container-title"]?.[0] || "مجلة علمية زراعية"
            } تتناول أحدث التطورات والتطبيقات العملية في هذا المجال.`,
          authors: authors.slice(0, 4),
          journal: item["container-title"]?.[0] || "مجدلة علمية محكّمة",
          doi,
          originalUrl,
          googleScholarUrl,
          pdfUrl: null,
          citedBy: item["is-referenced-by-count"] || 0,
          type: "article",
        };
      });
  } catch (err) {
    console.warn("[Research API] Crossref query error (skipped):", err.message);
    return [];
  }
}

/*
|--------------------------------------------------------------------------
| Query & Filter Local Curated Research Dataset
|--------------------------------------------------------------------------
*/

function filterCuratedResearch({ field, fromYear, toYear, query }) {
  let list = [...CURATED_RESEARCH];

  // Filter by year
  list = list.filter((p) => p.year >= fromYear && p.year <= toYear);

  // Filter by field
  if (field && field !== "all") {
    list = list.filter((p) => p.field === field);
  }

  // Filter by query if present
  if (query && query.trim() !== "") {
    const qLower = query.trim().toLowerCase();

    // Find any expanded english keywords if query is in Arabic
    let searchTokens = [qLower];
    for (const [arWord, enList] of Object.entries(ARABIC_SEARCH_TERMS)) {
      if (qLower.includes(arWord)) {
        searchTokens.push(...enList);
      }
    }

    list = list.filter((p) => {
      const targetText = `
        ${p.title || ""} 
        ${p.abstract || ""} 
        ${p.field || ""} 
        ${p.journal || ""} 
        ${p.authors?.join(" ") || ""}
      `.toLowerCase();

      return searchTokens.some((token) => targetText.includes(token));
    });
  }

  return list;
}

/*
|--------------------------------------------------------------------------
| Local Smart Arabic Summarizer (Fallback when OpenAI Key is missing)
|--------------------------------------------------------------------------
*/

function generateLocalArabicSummary(title, abstract, field) {
  const dictionary = [
    { en: /precision agriculture|smart farming/gi, ar: "الزراعة الدقيقة والذكية" },
    { en: /digital agriculture|remote sensing|gis|uav|drone/gi, ar: "التقنيات الرقمية والاستشعار عن بعد" },
    { en: /artificial intelligence|machine learning|deep learning/gi, ar: "الذكاء الاصطناعي والتحليل الرقمي" },
    { en: /drip irrigation|irrigation|water management|water use/gi, ar: "نظم الري وتدبير المياه" },
    { en: /soil fertility|soil nitrogen|soil|salinity/gi, ar: "جودة وتغذية التربة ومعالجة الملوحة" },
    { en: /hydroponics|soilless|aquaponics|aeroponic/gi, ar: "الزراعة المائية وبدون تربة" },
    { en: /crop yield|yield improvement|wheat|maize|strawberry/gi, ar: "زيادة إنتاجية المحاصيل الحقلية" },
    { en: /plant pathology|disease|pest management|biopesticide|fusarium/gi, ar: "وقاية النبات ومكافحة الآفات بيولوجياً" },
    { en: /sustainability|climate resilience|carbon/gi, ar: "الاستدامة والتكيف المناخي" },
    { en: /fertilizer|fertigation|nutrient|biochar/gi, ar: "التسميد والمغذيات والمحسنات العضوية" },
    { en: /robot|automation|tractor|gripper/gi, ar: "الميكنة الزراعية والروبوتات الذكية" },
  ];

  const fullText = (title + " " + (abstract || "")).toLowerCase();
  const detectedTopics = [];

  dictionary.forEach((item) => {
    if (item.en.test(fullText)) {
      detectedTopics.push(item.ar);
    }
  });

  if (detectedTopics.length === 0) {
    detectedTopics.push("التقنيات الزراعية الحديثة", "رفع كفاءة الإنتاج الزراعي");
  }

  const sentences = abstract
    ? abstract.split(/(?<=[.?!])\s+/).filter((s) => s.length > 25)
    : [];

  const findingSentences = sentences.filter((s) =>
    /result|show|find|demonstrate|increase|improve|reduce|achieve|conclude|indicate|observe|yield/i.test(
      s
    )
  );

  const summary = `تناول هذا البحث العلمي الحديث في تخصص (${field || "العلوم الزراعية"}) تقييم وتطوير الممارسات الخاصة بـ ${detectedTopics.slice(0, 3).join(" و")}. وتكمن أهمية الدراسة في تقديم حلول تجريبية مبتكرة تسهم في تحسين كفاءة استخدام الموارد وزيادة جودة ومردود الإنتاج برؤية تطبيقية للمزارع والمهندس الزراعي.`;

  let keyFindings = [];

  if (findingSentences.length > 0) {
    keyFindings = findingSentences.slice(0, 3).map((s) => {
      let text = s.trim();
      text = text
        .replace(/^the results showed that/gi, "أظهرت نتائج الدراسة أن")
        .replace(/^the study concluded that/gi, "خلصت الدراسة إلى أن")
        .replace(/^results indicated that/gi, "أشارت النتائج العملية إلى أن")
        .replace(/^we found that/gi, "ثبت بالدليل العلمي أن")
        .replace(/^experimental field trials showed/gi, "أظهرت التجارب الحقلية");

      if (text.length > 170) {
        text = text.substring(0, 170) + "...";
      }

      return text;
    });
  } else {
    keyFindings = [
      `تقديم بيانات حقلية ومعملية دقيقة تدعم اتخاذ القرار وتطبيق أحدث المعايير في ${field || "الزراعة"}.`,
      "تحديد الآليات الأكثر فاعلية لتقليل الفاقد وتأمين استدامة المحصول وتقليل التكاليف التشغيلية.",
      "توصيات تطبيقية مباشرة للمزارعين والمهندسين الزراعيين لرفع جودة المحصول وحمايته من الإجهادات البيئية.",
    ];
  }

  return {
    summary,
    keyFindings,
    significance: `تساعد مخرجات هذا البحث في الاعتماد على ${detectedTopics[0]} لتحقيق أعلى عائد إنتاجي مع الحفاظ على الموارد والبيئة.`,
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/research
| Fetch live latest research papers with Multi-Layer Fallback & In-Memory Cache
|--------------------------------------------------------------------------
*/

app.get("/api/research", async (req, res) => {
  try {
    const {
      year = "3",
      field = "all",
      query = "",
      page = "1",
      perPage = "12",
    } = req.query;

    const currentYear = new Date().getFullYear();
    const yearsBack = Math.max(1, Math.min(5, Number(year) || 3));
    const fromYear = currentYear - yearsBack + 1;
    const toYear = currentYear;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limit = Math.max(1, Math.min(50, Number(perPage) || 12));

    const cacheKey = `${field}:${yearsBack}:${query.trim().toLowerCase()}:${pageNumber}:${limit}`;

    // Check cache
    const cached = researchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.payload);
    }

    let allWorks = [];
    let openAlexSuccess = false;

    // 1. Attempt OpenAlex if API key is provided or for live queries
    // Use ONE single consolidated query to avoid burning IP rate limits
    try {
      let openAlexSearchTerm = "";
      if (query && query.trim() !== "") {
        openAlexSearchTerm = query.trim();
      } else if (field !== "all" && AGRICULTURAL_FIELDS[field]) {
        openAlexSearchTerm = AGRICULTURAL_FIELDS[field].slice(0, 3).join(" OR ");
      } else {
        openAlexSearchTerm = "precision agriculture OR irrigation OR crop yield OR plant pathology OR hydroponics";
      }

      const params = new URLSearchParams();
      params.set("search", openAlexSearchTerm);
      params.set(
        "filter",
        [
          `from_publication_date:${fromYear}-01-01`,
          `to_publication_date:${toYear}-12-31`,
          "type:article",
        ].join(",")
      );
      params.set("sort", "publication_date:desc");
      params.set("per-page", "30");
      params.set(
        "select",
        [
          "id",
          "display_name",
          "title",
          "publication_year",
          "publication_date",
          "abstract_inverted_index",
          "authorships",
          "primary_location",
          "doi",
          "cited_by_count",
          "concepts",
          "type",
        ].join(",")
      );

      const headers = {
        "User-Agent": "AgriGrowApp/1.0 (mailto:contact@agrigrow.org)",
      };

      if (OPENALEX_API_KEY) {
        headers["Authorization"] = `Bearer ${OPENALEX_API_KEY}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const openAlexUrl = `https://api.openalex.org/works?${params.toString()}`;
      const response = await fetch(openAlexUrl, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const rawResults = data.results || [];
        const relevant = rawResults.filter(isAgriculturalResearch);
        allWorks = relevant.map(formatOpenAlexWork);
        if (allWorks.length > 0) {
          openAlexSuccess = true;
        }
      } else {
        console.warn(`[Research API] OpenAlex responded with ${response.status}. Falling back gracefully.`);
      }
    } catch (openAlexErr) {
      console.warn(`[Research API] OpenAlex fetch skipped (${openAlexErr.message}). Using resilient fallback dataset.`);
    }

    // 2. If OpenAlex wasn't used or failed, use Curated Research & Crossref
    if (!openAlexSuccess) {
      const curatedResults = filterCuratedResearch({
        field,
        fromYear,
        toYear,
        query,
      });

      // If user is searching a custom query that returned few curated items, supplement with Crossref
      if (query && query.trim() !== "" && curatedResults.length < 5) {
        const crossrefResults = await fetchCrossrefPapers(query.trim(), fromYear);
        const combined = [...curatedResults];
        const existingTitles = new Set(curatedResults.map((c) => c.title.toLowerCase()));

        for (const item of crossrefResults) {
          if (!existingTitles.has(item.title.toLowerCase())) {
            combined.push(item);
            existingTitles.add(item.title.toLowerCase());
          }
        }
        allWorks = combined;
      } else {
        allWorks = curatedResults;
      }
    }

    // Filter by field if specified and not 'all'
    if (field !== "all") {
      allWorks = allWorks.filter((w) => w.field === field);
    }

    // Sort newest first by date or publication year
    allWorks.sort((a, b) => {
      const dateA = new Date(a.date || `${a.year}-01-01`).getTime() || 0;
      const dateB = new Date(b.date || `${b.year}-01-01`).getTime() || 0;
      return dateB - dateA;
    });

    // Pagination
    const start = (pageNumber - 1) * limit;
    const paginated = allWorks.slice(start, start + limit);

    const payload = {
      success: true,
      data: paginated,
      pagination: {
        page: pageNumber,
        perPage: limit,
        total: allWorks.length,
        hasMore: start + limit < allWorks.length,
      },
      filters: {
        fromYear,
        toYear,
        field,
        query,
      },
    };

    // Store in cache
    researchCache.set(cacheKey, {
      payload,
      timestamp: Date.now(),
    });

    return res.json(payload);
  } catch (error) {
    console.error("Fetch Research Unexpected Error:", error);
    // Even in unexpected errors, safely return filtered curated data instead of 500
    const fallbackList = filterCuratedResearch({
      field: req.query.field || "all",
      fromYear: 2024,
      toYear: 2026,
      query: req.query.query || "",
    });

    return res.json({
      success: true,
      data: fallbackList.slice(0, 12),
      pagination: {
        page: 1,
        perPage: 12,
        total: fallbackList.length,
        hasMore: false,
      },
      filters: {
        fromYear: 2024,
        toYear: 2026,
        field: req.query.field || "all",
        query: req.query.query || "",
      },
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/research/:id
| Fetch single research paper details
|--------------------------------------------------------------------------
*/

app.get("/api/research/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Check curated database first
    const curated = CURATED_RESEARCH.find(
      (p) => p.id === id || p.doi === id || (p.doi && id.includes(p.doi))
    );
    if (curated) {
      return res.json({
        success: true,
        data: curated,
      });
    }

    // Otherwise try OpenAlex if available
    try {
      const headers = {
        "User-Agent": "AgriGrowApp/1.0 (mailto:contact@agrigrow.org)",
      };
      if (OPENALEX_API_KEY) {
        headers["Authorization"] = `Bearer ${OPENALEX_API_KEY}`;
      }

      const response = await fetch(
        `https://api.openalex.org/works/${encodeURIComponent(id)}`,
        { headers }
      );

      if (response.ok) {
        const work = await response.json();
        const research = formatOpenAlexWork(work);
        return res.json({
          success: true,
          data: research,
        });
      }
    } catch (e) {
      console.warn("[Research API] OpenAlex single item error:", e.message);
    }

    return res.status(404).json({
      success: false,
      message: "البحث غير موجود أو انتهت صلاحية الرابط.",
    });
  } catch (error) {
    console.error("Get Single Research Error:", error);
    res.status(404).json({
      success: false,
      message: "حدث خطأ أثناء جلب تفاصيل البحث.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/research/summarize
| Summarize & extract key findings in Arabic
|--------------------------------------------------------------------------
*/

app.post("/api/research/summarize", async (req, res) => {
  try {
    const { title, abstract, field } = req.body;

    // Use OpenAI if key is configured & valid
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `أنت خبير ومستشار علمي زراعي متخصص في تبسيط الأبحاث الأكاديمية للمزارعين والباحثين.
مهمتك هي تحليل عنوان البحث و Abstract وإعادة ملخص عربي رصين ومبسط مع أهم 3 نتائج عملية.

يجب أن ترجع النتيجة بصيغة JSON فقط بهذا الشكل الدقيق:
{
  "summary": "ملخص شامل ومبسط باللغة العربية يتضمن الهدف والمنهجية العامة للبحث",
  "keyFindings": [
    "النتيجة الأولى أو التطبيق العملي الأول",
    "النتيجة الثانية أو التطبيق العملي الثاني",
    "النتيجة الثالثة أو التطبيق العملي الثالث"
  ],
  "significance": "الأهمية التطبيقية للمزارع والقطاع الزراعي"
}`,
            },
            {
              role: "user",
              content: `عنوان البحث: ${title}
التخصص: ${field || "علوم زراعية"}
Abstract: ${abstract || "لا يوجد ملخص نصي مطول متوفر."}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const contentText = response.choices[0]?.message?.content;
        const parsed = JSON.parse(contentText);

        return res.json({
          success: true,
          data: parsed,
        });
      } catch (aiError) {
        console.warn("OpenAI summarize fallback:", aiError.message);
      }
    }

    // Smart Local Fallback Summarizer
    const fallbackData = generateLocalArabicSummary(title, abstract, field);

    res.json({
      success: true,
      data: fallbackData,
    });
  } catch (error) {
    console.error("Summarize Endpoint Error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إنشاء ملخص البحث والنتائج.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Authentication API Endpoints
|--------------------------------------------------------------------------
*/

// Register
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول (الاسم، البريد الإلكتروني، كلمة المرور) مطلوبة.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = loadUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول مباشرة.",
      });
    }

    const role = cleanEmail === ADMIN_EMAIL ? "admin" : "user";

    const newUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = `agri-token-${newUser.id}-${Date.now()}`;

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: "تم إنشاء الحساب بنجاح!",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر أثناء تسجيل الحساب." });
  }
});

// Login
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = loadUsers();

    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "هذا الحساب غير موجود. يرجى إنشاء حساب جديد أولاً.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
      });
    }

    // Ensure role matches admin email if it's admin email
    if (cleanEmail === ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      saveUsers(users);
    }

    const token = `agri-token-${user.id}-${Date.now()}`;

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "تم تسجيل الدخول بنجاح!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر أثناء تسجيل الدخول." });
  }
});

// Auth Status / Me
app.get("/api/auth/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "غير مسجل الدخول." });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const users = loadUsers();
    const userIdMatch = token.match(/agri-token-(usr-[0-9]+|admin-[0-9]+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    let user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "الجلسة غير صالحة." });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "فشل التحقق من الجلسة." });
  }
});

/*
|--------------------------------------------------------------------------
| Dynamic Majors & Roadmaps API Endpoints
|--------------------------------------------------------------------------
*/

// GET all majors
app.get("/api/majors", (req, res) => {
  try {
    const majors = loadMajors();
    res.json({
      success: true,
      data: majors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب المسارات." });
  }
});

// GET single major by id
app.get("/api/majors/:id", (req, res) => {
  try {
    const majors = loadMajors();
    const major = majors.find(
      (m) =>
        m.id === req.params.id ||
        m.shortTitle === req.params.id ||
        m.title.includes(req.params.id)
    );

    if (!major) {
      return res.status(404).json({ success: false, message: "التخصص غير موجود." });
    }

    res.json({
      success: true,
      data: major,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب تفاصيل المسار." });
  }
});

// Admin Authorization Middleware Helper
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ success: false, message: "غير مسموح. الصلاحيات للأدمن فقط." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const users = loadUsers();
  const userIdMatch = token.match(/agri-token-(usr-[0-9]+|admin-[0-9]+)/);
  const userId = userIdMatch ? userIdMatch[1] : null;

  const user = users.find((u) => u.id === userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, message: "غير مسموح. هذه الصفحة مخصصة لمدير النظام فقط." });
  }

  req.adminUser = user;
  next();
}

// POST Create new major & roadmap (Admin only)
app.post("/api/majors", verifyAdmin, (req, res) => {
  try {
    const { title, shortTitle, level, description, marketDemand, rating, progress, icon, color, skills, modules } = req.body;

    if (!title || !shortTitle || !description) {
      return res.status(400).json({ success: false, message: "اسم التخصص والوصف حقول إجبارية." });
    }

    const majors = loadMajors();
    const id = req.body.id || `major-${Date.now()}`;

    const newMajor = {
      id,
      title,
      shortTitle,
      level: level || "مبتدئ إلى متقدم (Zero to Hero)",
      description,
      marketDemand: marketDemand || "مطلوب بشدة",
      rating: Number(rating) || 5,
      progress: Number(progress) || 0,
      icon: icon || "BookOpen",
      color: color || "emerald",
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : []),
      modules: Array.isArray(modules) ? modules : [],
    };

    majors.push(newMajor);
    saveMajors(majors);

    res.status(201).json({
      success: true,
      data: newMajor,
      majors,
      message: "تم إضافة التخصص وخريطة الطريق بنجاح!",
    });
  } catch (error) {
    console.error("Create major error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء إضافة التخصص." });
  }
});

// PUT Edit major & roadmap (Admin only)
app.put("/api/majors/:id", verifyAdmin, (req, res) => {
  try {
    const majors = loadMajors();
    const index = majors.findIndex((m) => m.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "التخصص المراد تعديله غير موجود." });
    }

    const existing = majors[index];
    const updated = {
      ...existing,
      ...req.body,
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : typeof req.body.skills === "string"
        ? req.body.skills.split(",").map((s) => s.trim())
        : existing.skills,
      modules: Array.isArray(req.body.modules) ? req.body.modules : existing.modules,
    };

    majors[index] = updated;
    saveMajors(majors);

    res.json({
      success: true,
      data: updated,
      majors,
      message: "تم تعديل التخصص وخريطة الطريق بنجاح!",
    });
  } catch (error) {
    console.error("Update major error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء تعديل التخصص." });
  }
});

// DELETE major & roadmap (Admin only)
app.delete("/api/majors/:id", verifyAdmin, (req, res) => {
  try {
    let majors = loadMajors();
    const initialCount = majors.length;
    majors = majors.filter((m) => m.id !== req.params.id);

    if (majors.length === initialCount) {
      return res.status(404).json({ success: false, message: "التخصص المراد حذفه غير موجود." });
    }

    saveMajors(majors);

    res.json({
      success: true,
      majors,
      message: "تم حذف التخصص وخريطة الطريق بنجاح.",
    });
  } catch (error) {
    console.error("Delete major error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء حذف التخصص." });
  }
});

/*
|--------------------------------------------------------------------------
| Health Check Endpoint
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Agricultural Research API is running smoothly",
    cachedQueries: researchCache.size,
    hasOpenAi: Boolean(openai),
    hasOpenAlexKey: Boolean(OPENALEX_API_KEY),
    curatedItemsCount: CURATED_RESEARCH.length,
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Agricultural Research API running on http://localhost:${PORT}`);
  });
}

export default app;