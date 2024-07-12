using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using TestTaskBackend.PasswordStorage.Model;
using TestTaskBackend.PasswordStorage.Repository;

internal class Program
{
	private static void Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		// Регистрация сервисов
		builder.Services.AddControllers(); //Регистрируем контроллеры
		builder.Services.AddDbContext<PasswordStorageContext>(opts =>
		{
			SqliteConnectionStringBuilder connectionStringBuilder = new SqliteConnectionStringBuilder();
			connectionStringBuilder.DataSource=".\\LocalDB";
			opts.UseSqlite(connectionStringBuilder.ToString());
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
				db.Database.EnsureCreated();
			}
		}

		using (var scope = app.Services.CreateScope())
		{
			var db = scope.ServiceProvider.GetRequiredService<PasswordStorageContext>();
			db.Database.EnsureCreated();
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

		app.MapGet("{**catchall}", ctx =>
		{
			return ctx.Response.SendFileAsync("public/index.html");
		});

		app.Run();
	}
}