using System.Text;
using UglyToad.PdfPig;

namespace AiTestCaseGenerator.Api.Helpers
{
	public static class PdfReader
	{
		public static string ExtractText(Stream stream)
		{
			using var document = PdfDocument.Open(stream);

			var text = new StringBuilder();

			foreach (var page in document.GetPages())
			{
				text.AppendLine(page.Text);
			}

			return text.ToString();
		}
	}
}
