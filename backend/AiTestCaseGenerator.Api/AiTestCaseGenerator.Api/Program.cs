using AiTestCaseGenerator.Api.Services;
using AiTestCaseGenerator.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var geminiKey = builder.Configuration["Gemini:ApiKey"];

if (string.IsNullOrWhiteSpace(geminiKey))
{
	throw new InvalidOperationException(
		"Gemini:ApiKey is missing. " +
		"Run: dotnet user-secrets set \"Gemini:ApiKey\" \"your-key-here\""
	);
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IAIService, AIService>();

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAngular",
		policy =>
		{
			policy
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowAnyOrigin();
		});
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();

	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint(
			"/swagger/v1/swagger.json",
			"AI Test Case Generator API V1");

		options.RoutePrefix = string.Empty;
	});
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthorization();

app.MapControllers();

app.Run();
