using System.Globalization;
using TestTaskBackend.PasswordStorage.Model;

namespace TestTaskBackend.PasswordStorage.Controllers
{
	/// <summary>
	/// Данные пароля, отправляемые клиенту. Не включают в себя сам пароль.
	/// </summary>
	public class PasswordData
	{
		/// <summary>
		/// Идентификатор пароля
		/// </summary>
		public int Id { get; }
		/// <summary>
		/// Тип пароля. Одно из значений <see cref="PasswordEntryType"/> в виде строки.
		/// </summary>
		public string PasswordType { get; }
		/// <summary>
		/// Для чего пароль (наименование веб-сайта или email).
		/// </summary>
		public string PasswordFor { get; }
		/// <summary>
		/// Дата создания записи в формате 'YYYY-MM-DDTHH:mm:ss'.
		/// </summary>
		public string CreationTime { get; }

		public PasswordData(int id, PasswordEntryType passwordType, string passwordFor, DateTime creationTime)
		{
			Id = id;
			PasswordType = passwordType.ToString();
			PasswordFor = passwordFor ?? throw new ArgumentNullException(nameof(passwordFor));
			CreationTime = creationTime.ToString("yyyy-MM-dd\\THH:mm:ss", CultureInfo.InvariantCulture);
		}

		/// <summary>
		/// Создаёт экземпляр <see cref="PasswordData"/> на основе данных <see cref="PasswordEntry"/>.
		/// </summary>
		/// <param name="password">Запись, на основе которой создаётся экземпляр.</param>
		public PasswordData(PasswordEntry password) : this(password.Id, password.PasswordType, password.PasswordFor, password.CreationTime) { }
	}
}
