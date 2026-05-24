using DocumentFormat.OpenXml.Packaging;
using System.Text;
using DocumentFormat.OpenXml.Wordprocessing;

namespace AiTestCaseGenerator.Api.Helpers
{
	public static class DocxReader
	{
		public static string ExtractText(Stream stream)
		{
			using var document =
				WordprocessingDocument.Open(stream, false);

			var body =
				document.MainDocumentPart?.Document.Body;

			if (body == null)
			{
				return string.Empty;
			}

			var text = new StringBuilder();

			foreach (var paragraph in body.Elements<Paragraph>())
			{
				text.AppendLine(paragraph.InnerText);
			}

			return text.ToString();
		}
	}
}
