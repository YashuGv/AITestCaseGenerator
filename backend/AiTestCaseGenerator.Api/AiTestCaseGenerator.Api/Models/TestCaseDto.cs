namespace AiTestCaseGenerator.Api.Models
{
	public class TestCaseDto
	{
		public string Id { get; set; } = string.Empty;
		public string Title { get; set; } = string.Empty;
		public string Type { get; set; } = "Functional";
		public string Priority { get; set; } = "Medium";
		public List<string> Steps { get; set; } = new();
		public string Expected { get; set; } = string.Empty;
	}
}
