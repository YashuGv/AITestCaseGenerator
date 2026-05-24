using AiTestCaseGenerator.Api.Dtos;
using AiTestCaseGenerator.Api.Helpers;
using AiTestCaseGenerator.Api.Services.Interfaces;
using DocumentFormat.OpenXml.Packaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using UglyToad.PdfPig;

namespace AiTestCaseGenerator.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TestCasesController : ControllerBase
	{
		private readonly IAIService _aiService;

		public TestCasesController(IAIService aiService)
		{
			_aiService = aiService;
		}

		[HttpPost("generate")]
		public async Task<IActionResult> Generate([FromForm] GenerateRequestDto request)
		{
			try
			{
				if (request.File == null || request.File.Length == 0)
				{
					return BadRequest(new
					{
						message = "Please upload a valid file."
					});
				}

				var requirementText =
					await ExtractTextFromFile(request.File);

				if (string.IsNullOrWhiteSpace(requirementText))
				{
					return BadRequest(new
					{
						message = "Could not extract content from file."
					});
				}

				var result =
					await _aiService.GenerateTestCasesAsync(
						requirementText,
						request.OutputType,
						request.Instructions);

				return Ok(result);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new
				{
					message = ex.Message
				});
			}
		}

		private async Task<string> ExtractTextFromFile(
			IFormFile file)
		{
			var extension =
				Path.GetExtension(file.FileName)
					.ToLower();

			using var stream = file.OpenReadStream();

			switch (extension)
			{
				case ".txt":
					using (var reader = new StreamReader(stream))
					{
						return await reader.ReadToEndAsync();
					}

				case ".pdf":
					{
						var text = new StringBuilder();

						using var pdf =
							PdfDocument.Open(stream);

						foreach (var page in pdf.GetPages())
						{
							text.AppendLine(page.Text);
						}

						return text.ToString();
					}

				case ".docx":
					{
						using var memoryStream = new MemoryStream();
						await stream.CopyToAsync(memoryStream);
						memoryStream.Position = 0;

						using var document = WordprocessingDocument.Open(memoryStream, false);
						var body = document.MainDocumentPart?.Document.Body;
						if (body == null)
						{
							return "";
						}

						var paragraphs = body.Elements<DocumentFormat.OpenXml.Wordprocessing.Paragraph>();
						var text = new StringBuilder();
						foreach (var paragraph in paragraphs)
						{
							text.AppendLine(paragraph.InnerText);
						}

						return text.ToString();
					}
				default:
					throw new Exception("Unsupported file type. Only PDF, DOCX, and TXT are allowed.");
			}
		}
	}
}
