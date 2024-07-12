using Microsoft.EntityFrameworkCore;

namespace TestTaskBackend.PasswordStorage.Model
{
	public class PasswordStorageContext : DbContext
	{
		public PasswordStorageContext() : base() {}
		public PasswordStorageContext(DbContextOptions<PasswordStorageContext> options) : base(options) {}

		/// <summary>
		/// Записи паролей в БД
		/// </summary>
		public DbSet<PasswordEntry> PasswordEntries { get; set; }

		public override int SaveChanges(bool acceptAllChangesOnSuccess)
		{
			DateTime now = DateTime.Now;

			//Присвоить время создания сущностям, которые отслеживают время создания

			var newEntires = ChangeTracker.Entries() //Из всех сущностей с изменениями
											.Where(x => x.State == EntityState.Added) //Выбрать только что добавленные
											.Select(x => x.Entity); //Взять саму сущность каждой записи
			
			foreach (var entry in newEntires.OfType<ITrackCreationDate>()) //Выбрать сущности, которые реализуют интерфейс ITrackCreationDate
				entry.CreationTime = now;

			return base.SaveChanges(acceptAllChangesOnSuccess);
		}

		public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
		{
			DateTime now = DateTime.UtcNow;

			//Присвоить время создания сущностям, которые отслеживают время создания

			var newEntires = ChangeTracker.Entries() //Из всех сущностей с изменениями
											.Where(x => x.State == EntityState.Added) //Выбрать только что добавленные
											.Select(x => x.Entity) //Взять саму сущность каждой записи
											.OfType<ITrackCreationDate>(); //Выбрать сущности, которые реализуют интерфейс ITrackCreationDate

			foreach (var entry in newEntires)
				entry.CreationTime = now;

			return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
		}
	}
}
