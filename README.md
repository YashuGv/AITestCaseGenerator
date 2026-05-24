# AITestCaseGenerator
AI-powered QA test case generator — upload a requirement document (PDF, DOCX, TXT) and get structured test cases instantly using Google Gemini 2.5 Flash. Built with Angular 18 + ASP.NET Core 8 + Tailwind CSS.

# 🧪 GenAI Test Case Studio

> **AI-powered software test case generator** — Upload a requirement document and get structured, professional QA test cases in seconds, powered by Google Gemini AI.

![Angular](https://img.shields.io/badge/Angular-18-dd0031?style=flat-square&logo=angular)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8.0-512bd4?style=flat-square&logo=dotnet)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285f4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [AI Model](#-ai-model--google-gemini-25-flash)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#1-backend-setup-aspnet-core)
  - [Frontend Setup](#2-frontend-setup-angular)
- [Environment & API Key Setup](#-environment--api-key-setup)
- [How It Works](#-how-it-works)
- [Test Case Coverage](#-test-case-coverage)
- [API Reference](#-api-reference)
- [Supported File Types](#-supported-file-types)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**GenAI Test Case Studio** is a full-stack MVP web application that automates the creation of software test cases from requirement documents using Google Gemini AI.

Instead of manually writing dozens of test cases from a requirements document, simply upload your PDF, DOCX, or TXT file, select the type of test cases you need, and the AI generates a comprehensive, structured test suite in seconds — ready to preview in a clean table and download as a formatted Excel file.

This tool is designed for:
- **QA Engineers** who want to speed up test case creation
- **Developers** who need quick test coverage for new features
- **Project Managers** who want to validate requirement coverage
- **Students** learning software testing practices

---

## ✨ Features

- 📄 **Multi-format document upload** — PDF, DOCX, TXT (up to 10 MB)
- 🤖 **AI-powered generation** — Google Gemini 2.5 Flash analyzes requirements and generates 20+ test cases
- 🎯 **Multiple output types** — Functional, Negative, API, and Regression test cases
- 📊 **Table preview** — Clean, scrollable table layout with zebra striping
- 📥 **Excel export** — Download formatted `.xlsx` file with proper column widths and wrapped text
- 📋 **Select & copy** — Select the entire table and paste directly into Excel
- 🔄 **Real-time progress** — Animated progress bar during AI generation
- 📱 **Responsive design** — Works on desktop, tablet, and mobile
- ⚡ **No login required** — MVP with no authentication or database
- 🎨 **Modern SaaS UI** — Inspired by Linear, Vercel, Notion AI, and ChatGPT

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 18 | Frontend framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.x | Utility-first styling |
| xlsx (SheetJS) | latest | Client-side Excel export |
| RxJS | 7.x | Reactive HTTP calls |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| ASP.NET Core | 8.0 | REST API framework |
| C# | 12 | Backend language |
| Mscc.GenerativeAI | latest | Google Gemini SDK for .NET |
| PdfPig | latest | PDF text extraction |
| DocumentFormat.OpenXml | latest | DOCX text extraction |

### AI
| Service | Model | Purpose |
|---|---|---|
| Google Gemini AI | gemini-2.5-flash | Test case generation from requirements |

---

## 🤖 AI Model — Google Gemini 2.5 Flash

This project uses **Google Gemini 2.5 Flash** via the `Mscc.GenerativeAI` .NET SDK.

### Why Gemini 2.5 Flash?
- **Fast** — optimized for low latency responses
- **Cost-effective** — generous free tier via Google AI Studio
- **High quality** — excellent at structured JSON output and technical content
- **Large context window** — handles long requirement documents without truncation

### How the AI is prompted
The backend sends a carefully engineered prompt to Gemini that:
- Defines the AI's role as a senior QA engineer
- Provides the full requirement text extracted from the uploaded document
- Specifies the desired output type (Functional, Negative, API, Regression)
- Enforces strict JSON output format
- Requests at least 20 test cases covering positive, negative, edge, security, and role-based scenarios
- Uses low temperature (`0.1`) for consistent, deterministic output

### Get a free API key
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key — it starts with `AIza...`

---

## 📁 Project Structure

```
genai-testcase-studio/
│
├── AiTestCaseGenerator.Api/          # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── TestCasesController.cs    # POST /api/TestCases/generate
│   ├── Dtos/
│   │   ├── GenerateRequestDto.cs     # Request model
│   │   ├── GenerateResponseDto.cs    # Response model
│   │   └── TestCaseDto.cs            # Individual test case model
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── IAIService.cs         # AI service interface
│   │   └── AIService.cs              # Gemini AI integration
│   ├── appsettings.json              # Config (no secrets)
│   └── Program.cs                    # App entry point + CORS
│
└── genai-testcase-studio/            # Angular 18 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── header/           # Navbar
    │   │   │   ├── upload/           # Drag-and-drop upload
    │   │   │   ├── file-preview/     # Uploaded file card
    │   │   │   ├── config-panel/     # Output type + instructions
    │   │   │   ├── generate-button/  # Generate CTA with spinner
    │   │   │   ├── progress-bar/     # Animated progress indicator
    │   │   │   ├── empty-state/      # Placeholder before generation
    │   │   │   ├── skeleton-loader/  # Loading skeleton
    │   │   │   ├── test-case-card/   # Individual test case card
    │   │   │   └── output-preview/   # Table + download actions
    │   │   ├── models/
    │   │   │   └── test-case.model.ts
    │   │   ├── services/
    │   │   │   └── testcase.service.ts
    │   │   ├── app.ts
    │   │   ├── app.html
    │   │   └── app.module.ts
    │   ├── styles.scss               # Tailwind + global styles
    │   └── tailwind.config.js
    └── package.json
```

---

## ✅ Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Included with Node.js |
| Angular CLI | 18+ | `npm install -g @angular/cli` |
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download |
| Visual Studio | 2022+ | https://visualstudio.microsoft.com |
| Git | latest | https://git-scm.com |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YashuGV/AITestCaseGeneration.git
cd AiTestCaseGenerator
```

---

### 1. Backend Setup (ASP.NET Core)

#### Step 1 — Open the API project

Open `AiTestCaseGenerator.Api` in Visual Studio 2022.

#### Step 2 — Set up your Gemini API key using User Secrets

Right-click the project in Solution Explorer → **Manage User Secrets**

This opens `secrets.json`. Add your key:

```json
{
  "Gemini": {
    "ApiKey": "your-gemini-api-key-here"
  }
}
```

> ⚠️ **Never put your real API key in `appsettings.json`** — that file is committed to Git.

Alternatively, use the terminal:

```bash
dotnet user-secrets set "Gemini:ApiKey" "your-gemini-api-key-here" --project AiTestCaseGenerator.Api
```

#### Step 3 — Restore NuGet packages

```bash
cd AiTestCaseGenerator.Api
dotnet restore
```

#### Step 4 — Run the API

```bash
dotnet run
```

The API starts at:
- `https://localhost:7230`
- `http://localhost:5000`

You should see:

```
info: Microsoft.Hosting.Lifetime
      Now listening on: https://localhost:7230
```

#### Step 5 — Verify the API is running

Open your browser and go to:

```
https://localhost:7230/swagger
```

You should see the Swagger UI with the `POST /api/TestCases/generate` endpoint.

---

### 2. Frontend Setup (Angular)

#### Step 1 — Navigate to the frontend folder

```bash
cd genai-testcase-studio
```

#### Step 2 — Install dependencies

```bash
npm install
```

#### Step 3 — Verify the API URL

Open `src/app/services/testcase.service.ts` and confirm the API URL matches your running backend:

```typescript
private readonly apiUrl = 'https://localhost:7230/api/TestCases/generate';
```

#### Step 4 — Start the Angular dev server

```bash
ng serve
```

Open your browser at:

```
http://localhost:4200
```

---

## 🔐 Environment & API Key Setup

### Local Development (Recommended)

This project uses **.NET User Secrets** to keep the Gemini API key off Git entirely.

```
Your Machine
├── Git Repository (pushed to GitHub)   ← NO secrets here
│   └── appsettings.json               ← placeholder only, empty key
│
└── Local Machine Only (never in Git)
    └── %APPDATA%\Microsoft\UserSecrets\{id}\secrets.json
        └── { "Gemini": { "ApiKey": "AIza..." } }
```

### Production Deployment

For production, use your hosting platform's environment variables:

**Azure App Service:**
```
Portal → App → Configuration → Application Settings
Name:  Gemini:ApiKey
Value: your-real-key
```

**Docker:**
```dockerfile
ENV Gemini__ApiKey=your-real-key
```

**Linux / environment variable:**
```bash
export Gemini__ApiKey="your-real-key"
```

> Note: ASP.NET Core maps `Gemini__ApiKey` (double underscore) to `Gemini:ApiKey` in configuration automatically.

---

## ⚙️ How It Works

```
User uploads PDF/DOCX/TXT
        ↓
Angular sends file via FormData to ASP.NET Core API
        ↓
API extracts text from document
  ├── PDF   → PdfPig library
  ├── DOCX  → DocumentFormat.OpenXml
  └── TXT   → StreamReader
        ↓
Extracted text + output type + instructions
sent to Google Gemini 2.5 Flash
        ↓
Gemini returns structured JSON with test cases
        ↓
API normalizes type/priority values
and returns GenerateResponseDto
        ↓
Angular renders test cases in a table
        ↓
User previews, copies, or downloads Excel
```

---

## 🎯 Test Case Coverage

The AI generates test cases covering all of the following:

| Category | Examples |
|---|---|
| ✅ Positive / Happy path | Valid login, successful form submission |
| ❌ Negative scenarios | Invalid credentials, wrong file type |
| 🔲 Boundary value analysis | Min/max length, numeric limits |
| 🔀 Edge cases | Empty input, special characters, very long strings |
| 🛡️ Security scenarios | SQL injection, XSS, unauthorized access |
| 👥 Role-based access | Admin vs standard user permissions |
| 🔄 Regression scenarios | Ensure existing features still work |
| 🌐 API testing | Endpoint responses, status codes, payloads |

---

## 📡 API Reference

### `POST /api/TestCases/generate`

Generates test cases from an uploaded requirement document.

**Request** — `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF, DOCX, or TXT file (max 10 MB) |
| `outputType` | string | ✅ | `Functional Test Cases`, `Negative Test Cases`, `API Test Cases`, `Regression Test Cases` |
| `instructions` | string | ❌ | Additional instructions for the AI |

**Response** — `200 OK`

```json
{
  "testCases": [
    {
      "id": "TC_001",
      "title": "Verify valid user login with correct credentials",
      "type": "Functional",
      "priority": "High",
      "steps": [
        "Step 1: Navigate to the login page",
        "Step 2: Enter a valid registered email address",
        "Step 3: Enter the correct password",
        "Step 4: Click the Login button"
      ],
      "expected": "User is authenticated and redirected to the dashboard."
    }
  ],
  "confidence": 95,
  "totalCount": 23
}
```

**Error Responses**

| Status | Meaning |
|---|---|
| `400` | No file uploaded or unsupported file type |
| `500` | AI service error or JSON parse failure |

---

## 📂 Supported File Types

| Format | Extension | Library Used |
|---|---|---|
| Plain Text | `.txt` | `System.IO.StreamReader` |
| PDF | `.pdf` | `UglyToad.PdfPig` |
| Word Document | `.docx` | `DocumentFormat.OpenXml` |

Maximum file size: **10 MB**

---

## 🔒 Security Notes

- API keys are stored in .NET User Secrets locally — never in source code
- No database — no user data is persisted anywhere
- No authentication — this is an MVP; add auth before production use
- CORS is configured to allow only `http://localhost:4200` in development
- File validation checks extension and size before processing

---
## screenshots

<img width="1848" height="981" alt="image" src="https://github.com/user-attachments/assets/f180e8d6-2335-47d5-b203-7b7f4caca351" />
<img width="1741" height="978" alt="image" src="https://github.com/user-attachments/assets/6e6da1cb-eea5-4d67-819a-81b5020cf21d" />
<img width="1772" height="967" alt="image" src="https://github.com/user-attachments/assets/b9055a0c-6691-4511-b252-fb680eaac24c" />


---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

### Commit message convention
```
feat:     new feature
fix:      bug fix
docs:     documentation changes
style:    formatting, no logic change
refactor: code restructure
test:     adding tests
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://aistudio.google.com) — AI model powering test case generation
- [Mscc.GenerativeAI](https://github.com/mscraftsman/generative-ai) — .NET SDK for Gemini
- [PdfPig](https://github.com/UglyToad/PdfPig) — PDF text extraction
- [SheetJS / xlsx](https://sheetjs.com) — Client-side Excel export
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Angular](https://angular.dev) — Frontend framework

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/YashuGV)
- LinkedIn: [your-linkedin](https://linkedin.com/in/venkata-yasaswini-godavarthi)

---

<div align="center">
  <sub>Built with ❤️ using Angular, ASP.NET Core, and Google Gemini AI</sub>
</div>
