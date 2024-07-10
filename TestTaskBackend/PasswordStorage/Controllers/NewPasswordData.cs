using System.ComponentModel.DataAnnotations;

namespace TestTaskBackend.PasswordStorage.Controllers
{
	/// <summary>
	/// Данные, необходимые для создания новой записи с паролем
	/// </summary>
	public class NewPasswordData
	{
		/// <summary>
		/// Значение пароля
		/// </summary>
		[Required]
		public string Password { get; set; }
		/// <summary>
		/// Тип пароля (одно из значений <see cref="PasswordStorage.Model.PasswordEntryType"/> в виде строки.
		/// </summary>
		[Required]
		public string PasswordType { get; set; }
		/// <summary>
		/// Для чего предназначен пароль (наименование веб-сайта или email)
		/// </summary>
		[Required]
		public string PasswordFor { get; set; }
	}
}
