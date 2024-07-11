using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestTaskBackend.PasswordStorage.Model
{
	[Index(nameof(PasswordType), nameof(PasswordFor), IsUnique = true)]
	public class PasswordEntry : ITrackCreationDate
	{
		public PasswordEntry(PasswordEntryType passwordType, string password, string passwordFor)
		{
			PasswordType = passwordType;
			Password = password ?? throw new ArgumentNullException(nameof(password));
			PasswordFor = passwordFor ?? throw new ArgumentNullException(nameof(passwordFor));
		}

		/// <summary>
		/// Идентификатор записи.
		/// </summary>
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Key]
		[Required]
		public int Id { get; set; }
		/// <summary>
		/// Тип пароля. Типы описаны в <see cref="PasswordEntryType"/>.
		/// </summary>
		[Required]
		public PasswordEntryType PasswordType { get; set; }
		/// <summary>
		/// Значение пароля.
		/// </summary>
		[Required]
		public string Password { get; set; }
		/// <summary>
		/// Сущность, для которой предназначен пароль (email, сайт).
		/// Значение зависит от значения <see cref="PasswordType"/>.
		/// </summary>
		[Required]
		public string PasswordFor { get; set; }
		/// <summary>
		/// Время создания записи.
		/// </summary>
		[Required]
		public DateTime CreationTime { get; set; }
	}
}
