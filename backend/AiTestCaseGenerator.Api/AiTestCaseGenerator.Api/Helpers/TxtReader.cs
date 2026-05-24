using System.Text;

namespace AiTestCaseGenerator.Api.Helpers
{
	public static class TxtReader
	{
		public static async Task<string> ExtractTextAsync(Stream stream)
		{
			using var reader =new StreamReader(stream, Encoding.UTF8);
			return await reader.ReadToEndAsync();
		}
	}
}
