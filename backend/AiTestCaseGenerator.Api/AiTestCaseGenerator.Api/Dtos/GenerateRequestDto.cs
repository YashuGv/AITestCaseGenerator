using Microsoft.AspNetCore.Http;

namespace AiTestCaseGenerator.Api.Dtos
{
	public class GenerateRequestDto
	{
		public IFormFile File { get; set; } = default!;
		public string? OutputType { get; set; }
		public string? Instructions { get; set; }
	}
}
