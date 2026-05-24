using AiTestCaseGenerator.Api.Dtos;
using AiTestCaseGenerator.Api.Models;
using AiTestCaseGenerator.Api.Services.Interfaces;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;
using System.Text.Json;


namespace AiTestCaseGenerator.Api.Services
{
	public class AIService : IAIService
	{
		private readonly IConfiguration _configuration;

		public AIService(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public async Task<GenerateResponseDto> GenerateTestCasesAsync(
			string requirementText,
			string outputType,
			string instructions)
		{
			try 
			{ 
				var apiKey = _configuration["Gemini:ApiKey"];

				if (string.IsNullOrWhiteSpace(apiKey))
				{
					throw new Exception("Gemini API key missing.");
				}

				var googleAI =
					new GoogleAI(apiKey);

				var model =googleAI.GenerativeModel(model: Model.Gemini25Flash);

				string prompt = $@"
					You are a senior QA engineer with 10+ years of experience in software testing.

					Your task is to analyze the following software requirement document and generate comprehensive, professional test cases.

					=== REQUIREMENT DOCUMENT ===
					{requirementText}

					=== OUTPUT TYPE REQUESTED ===
					{outputType}

					=== ADDITIONAL INSTRUCTIONS ===
					{(string.IsNullOrWhiteSpace(instructions) ? "None provided. Use your best judgment." : instructions)}

					=== GENERATION RULES ===
					- Generate AT LEAST 20 test cases, more if the requirement is complex
					- Cover ALL functional areas mentioned in the requirement
					- Each test case must be specific, actionable, and independently executable
					- Steps must be clear numbered actions (not vague descriptions)
					- Expected results must be precise and verifiable

					=== COVERAGE CHECKLIST ===
					Include test cases for ALL of the following that apply:
					1. Happy path / positive scenarios
					2. Negative scenarios (invalid input, wrong credentials, missing fields)
					3. Boundary value analysis (min, max, just above/below limits)
					4. Edge cases (empty input, special characters, very long strings)
					5. Validation scenarios (required fields, format checks, length limits)
					6. Security scenarios (SQL injection, XSS, unauthorized access)
					7. Role-based access control (different user roles and permissions)
					8. Regression scenarios (ensure existing features still work)
					9. API endpoint testing (if applicable)
					10. Performance boundary scenarios (if applicable)

					=== OUTPUT FORMAT ===
					Return ONLY a single valid JSON object. 
					No markdown. No code blocks. No explanation. No comments. No trailing commas.

					=== STRICT TYPE VALUES (use exactly as shown) ===
					Functional | Negative | API | Regression

					=== STRICT PRIORITY VALUES (use exactly as shown) ===
					High | Medium | Low

					Priority assignment guide:
					- High: Core functionality, security, data integrity
					- Medium: Important but non-critical features
					- Low: UI/UX, cosmetic, nice-to-have

					=== EXACT JSON SCHEMA ===
					{{
					  ""testCases"": [
						{{
						  ""id"": ""TC_001"",
						  ""title"": ""Brief, specific, action-oriented title"",
						  ""type"": ""Functional"",
						  ""priority"": ""High"",
						  ""steps"": [
							""Step 1: Navigate to the login page"",
							""Step 2: Enter valid username in the Username field"",
							""Step 3: Enter valid password in the Password field"",
							""Step 4: Click the Login button""
						  ],
						  ""expected"": ""User is successfully authenticated and redirected to the dashboard. A success toast notification is displayed.""
						}}
					  ],
					  ""confidence"": 95,
					  ""totalCount"": 1
					}}
					";

				var response = await model.GenerateContent(
					prompt,
					generationConfig: new GenerationConfig
					{
						Temperature = 0.1f,
						TopP = 0.8f,
						MaxOutputTokens = 16384
					});

				if (response == null)
				{
					throw new Exception("Gemini response is null.");
				}

				var rawText =
					response.Text;

				Console.WriteLine("========= GEMINI RAW RESPONSE =========");
				Console.WriteLine(rawText);

				if (string.IsNullOrWhiteSpace(rawText))
				{
					throw new Exception("Gemini returned empty response.");
				}

				var cleanedJson = rawText
					.Trim();

				if (cleanedJson.StartsWith("```"))
				{
					var firstNewline = cleanedJson.IndexOf('\n');
					if (firstNewline > -1)
						cleanedJson = cleanedJson[(firstNewline + 1)..];
				}

				if (cleanedJson.EndsWith("```"))
					cleanedJson = cleanedJson[..^3];

				var jsonStart = cleanedJson.IndexOf('{');
				var jsonEnd = cleanedJson.LastIndexOf('}');

				if (jsonStart > 0)
					cleanedJson = cleanedJson[jsonStart..];

				if (jsonEnd > -1 && jsonEnd < cleanedJson.Length - 1)
					cleanedJson = cleanedJson[..(jsonEnd + 1)];

				cleanedJson = cleanedJson.Trim();

				Console.WriteLine("========= CLEANED JSON =========");
				Console.WriteLine(cleanedJson);

				GenerateResponseDto? result = null;

				try
				{
					var options =
						new JsonSerializerOptions
						{
							PropertyNameCaseInsensitive = true
						};

					result =JsonSerializer.Deserialize<GenerateResponseDto>(cleanedJson,options);

					if (result?.TestCases == null)
					{
						result!.TestCases = new List<TestCaseDto>();
					}

					foreach (var testCase in result.TestCases)
					{
						testCase.Type =
							NormalizeType(testCase.Type);

						testCase.Priority =
							NormalizePriority(testCase.Priority);
					}
				}
				catch (Exception jsonEx)
				{
					Console.WriteLine("========= JSON PARSE ERROR =========");
					Console.WriteLine(jsonEx.Message);

					throw new Exception("AI returned invalid JSON.");
				}

				if (result == null)
				{
					throw new Exception("Failed to deserialize AI response.");
				}

				if (result.TestCases == null)
				{
					result.TestCases = new List<TestCaseDto>();
				}

				result.TotalCount = result.TestCases.Count;

				if (result.Confidence <= 0)
				{
					result.Confidence = 90;
				}

				return result;
			}
			catch (Exception ex)
			{
				Console.WriteLine("========= AI ERROR =========");
				Console.WriteLine(ex.ToString());

				throw;
			}
		}

		private string NormalizeType(string type)
		{
			return type?.Trim().ToLower() switch
			{
				"functional" => "Functional",
				"negative" => "Negative",
				"api" => "API",
				"regression" => "Regression",
				_ => "Functional"
			};
		}

		private string NormalizePriority(string priority)
		{
			return priority?.Trim().ToLower() switch
			{
				"high" => "High",
				"medium" => "Medium",
				"low" => "Low",
				_ => "Medium"
			};
		}

		//This method will support OpenAI Api's
		//public async Task<string> GenerateTestCasesAsync(
		//	string requirementText,
		//	string outputType,
		//	string instructions)
		//{
		//	var apiKey = _configuration["OpenAI:ApiKey"];

		//	var client = new ChatClient(
		//		model: "gpt-4.1-mini",
		//		apiKey: apiKey
		//	);

		//	string prompt = $@"
		//		You are a QA engineer.

		//		Generate professional software test cases.

		//		Requirement:
		//		{requirementText}

		//		Output Type:
		//		{outputType}

		//		Additional Instructions:
		//		{instructions}

		//		Return:
		//		- Test Case ID
		//		- Title
		//		- Preconditions
		//		- Steps
		//		- Expected Result
		//		- Priority
		//		";

		//	try
		//	{
		//		var completion = await client.CompleteChatAsync(
		//			new ChatMessage[]
		//			{
		//				new SystemChatMessage(
		//					"You are an expert QA engineer."
		//				),

		//				new UserChatMessage(prompt)
		//			});
		//		return completion.Value.Content[0].Text;
		//	}
		//	catch (Exception ex)
		//	{
		//		return $"AI Error: {ex.Message}";
		//	}
		//}
	}
}

