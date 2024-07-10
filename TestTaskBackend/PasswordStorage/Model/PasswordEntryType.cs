namespace TestTaskBackend.PasswordStorage.Model
{
	/// <summary>
	/// Типы паролей в хранилище.
	/// </summary>
	public enum PasswordEntryType
	{
		/// <summary>
		/// Пароль предназначен для email.
		/// </summary>
		Email,
		/// <summary>
		/// Пароль предназначен для веб-сайта.
		/// </summary>
		Website
	}
}
