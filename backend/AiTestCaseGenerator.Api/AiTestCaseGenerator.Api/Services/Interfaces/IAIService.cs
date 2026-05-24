using AiTestCaseGenerator.Api.Dtos;

namespace AiTestCaseGenerator.Api.Services.Interfaces
{
	public interface IAIService
	{
		Task<GenerateResponseDto> GenerateTestCasesAsync(string requirementText, string outputType, string instructions);
	}
}
