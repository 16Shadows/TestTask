using TestTaskBackend.PasswordStorage.Model;

namespace TestTaskBackend.PasswordStorage.Repository
{
	public interface IPasswordStorageRepository
	{
		/// <summary>
		/// Возвращает список всех паролей в порядке убывания времени создания записи
		/// </summary>
		/// <returns>Список паролей</returns>
		IEnumerable<PasswordEntry> GetPasswordsSortedByDateDescending();

		/// <summary>
		/// Возвращает список всех паролей в порядке убывания времени создания записи, наименование сущности которых (<see cref="PasswordEntry.PasswordFor"/>) содержит указанную строку.
		/// </summary>
		/// <param name="substr">Наличие этой подстроки в наименовании сущности проверяется при выборе записей.</param>
		/// <returns>Список паролей</returns>
		IEnumerable<PasswordEntry> GetPasswordsSortedByDateDescendingContaining(string substr);

		/// <summary>
		/// Возвращает пароль по его id, если пароль с таким id существует.
		/// </summary>
		/// <param name="guid">id пароля</param>
		/// <returns>Запись с паролем, если пароль с таким id существует, или null.</returns>
		Task<PasswordEntry> GetPassword(int id);

		/// <summary>
		/// Проверяет, есть ли пароль такого типа для такой сущности (email, сайт).
		/// </summary>
		/// <param name="type">Тип пароля (<see cref="PasswordEntryType"/>).</param>
		/// <param name="passwordFor">Наименование сущности, с которой связан пароль (email, сайт).</param>
		/// <returns>True, если пароль такого типа для такой сущности существует.</returns>
		Task<bool> HasPasswordFor(PasswordEntryType type, string passwordFor);

		/// <summary>
		/// Добавляет новый пароль.
		/// </summary>
		/// <param name="password">Запись пароля.</param>
		/// <returns>True в случае успешного сохранения, false в случае неудачи.</returns>
		Task<bool> AddPassword(PasswordEntry password);
	}
}
