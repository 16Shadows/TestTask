using Microsoft.EntityFrameworkCore;
using TestTaskBackend.PasswordStorage.Model;

namespace TestTaskBackend.PasswordStorage.Repository
{
	public class PasswordStorageRepository : IPasswordStorageRepository
	{
		private readonly PasswordStorageContext _context;

		public PasswordStorageRepository(PasswordStorageContext dbContext)
		{
			_context = dbContext;
		}

		public IEnumerable<PasswordEntry> GetPasswordsSortedByDateDescending()
		{
			return from record
				   in _context.PasswordEntries
				   orderby record.CreationTime
				   descending select record;
		}

		public async Task<PasswordEntry> GetPassword(int id)
		{
			return await (from record
						  in _context.PasswordEntries
						  where id == record.Id
						  select record)
						  .FirstOrDefaultAsync();
		}

		public async Task<bool> AddPassword(PasswordEntry password)
		{
			await _context.PasswordEntries.AddAsync(password);
			return await _context.SaveChangesAsync() > 0;
		}

		public IEnumerable<PasswordEntry> GetPasswordsSortedByDateDescendingContaining(string substr)
		{
			substr = substr.ToLowerInvariant(); //Т.к. и email, и вебсайты являются регистронезависимыми, сравниваем вне зависимости от регистра

			return from record
				   in _context.PasswordEntries
				   where EF.Functions.Like(record.PasswordFor.ToLower(), $"%{substr}%") //EF.Functions.Like должен передавать паттерн как параметр, поэтому не должно быть риска SQL-инъекций
				   select record;
		}
	}
}
