using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Npgsql;
using TestTaskBackend;
using TestTaskBackend.PasswordStorage.Model;
using TestTaskBackend.PasswordStorage.Repository;

internal class Program
{
	private static void Main(string[] args)
	{
		DotEnv.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env"));

		var builder = WebApplication.CreateBuilder(args);

		// Регистрация сервисов
		builder.Services.AddControllers(); //Регистрируем контроллеры
		builder.Services.AddDbContext<PasswordStorageContext>(opts =>
		{
			NpgsqlConnectionStringBuilder connectionStringBuilder = new();

			connectionStringBuilder.Database = Environment.GetEnvironmentVariable("POSTGRES_DATABASE");
			connectionStringBuilder.Host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
			connectionStringBuilder.Password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
			connectionStringBuilder.Port = int.Parse(Environment.GetEnvironmentVariable("POSTGRES_PORT"));
			connectionStringBuilder.Username = Environment.GetEnvironmentVariable("POSTGRES_USER");

			opts.UseNpgsql(connectionStringBuilder.ToString());
		}); //Регистрируем контекст EF
		builder.Services.AddScoped<IPasswordStorageRepository, PasswordStorageRepository>(); //Регистрируем репозиторий паролей

		// Swagger
		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		builder.WebHost.UseKestrel(options =>
		{
			options.Configure(builder.Configuration.GetRequiredSection("Kestrel"));
		});

		var app = builder.Build();

		
		if (app.Environment.IsDevelopment())
		{
			// Использовать swagger только в режиме разработки
			app.UseSwagger();
			app.UseSwaggerUI();

			//Автоматически создать БД в режиме разработки
			using (var scope = app.Services.CreateScope())
			{
				var db = scope.ServiceProvider.GetRequiredService<PasswordStorageContext>();
				db.Database.Migrate();
			}
		}

		app.UseHttpsRedirection();

		app.UseAuthorization();

		app.MapControllers();

		//Простенький вариант, чтобы отсылать на все неизвестные пути angular-приложение 
		app.UseStaticFiles(new StaticFileOptions
		{
			FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "public"))
		});

		app.UseRouting();

		app.MapGet("{**catchall}", async ctx =>
		{
			if (File.Exists("public/index.html"))
				await ctx.Response.SendFileAsync("public/index.html");
			else
				ctx.Response.StatusCode = StatusCodes.Status404NotFound;
		});

		app.Run();
	}
}