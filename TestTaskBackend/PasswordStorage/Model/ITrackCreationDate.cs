namespace TestTaskBackend.PasswordStorage.Model
{
	/// <summary>
	/// Описывает сущность, которая хранит информацию о дате создания.
	/// </summary>
	public interface ITrackCreationDate
	{
		/// <summary>
		/// Дата создания этой сущности в БД (UTC)
		/// </summary>
		DateTime CreationTime { set; }
	}
}
