namespace AiTestCaseGenerator.Api.Helpers
{
	public class FileHelper
	{
		public static async Task<string> ReadFileContentAsync(IFormFile file)
		{
			using var reader = new StreamReader(file.OpenReadStream());
			return await reader.ReadToEndAsync();
		}
	}
}
