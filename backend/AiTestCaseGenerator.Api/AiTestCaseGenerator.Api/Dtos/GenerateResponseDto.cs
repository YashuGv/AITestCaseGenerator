using AiTestCaseGenerator.Api.Models;

namespace AiTestCaseGenerator.Api.Dtos
{
	public class GenerateResponseDto
	{
		public List<TestCaseDto> TestCases { get; set; } = new();
		public int Confidence { get; set; }
		public int TotalCount { get; set; }
	}
}
