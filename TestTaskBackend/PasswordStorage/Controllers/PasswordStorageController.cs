using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using TestTaskBackend.PasswordStorage.Model;
using TestTaskBackend.PasswordStorage.Repository;

namespace TestTaskBackend.PasswordStorage.Controllers
{
	[Route("api/passwords")]
	[ApiController]
	public class PasswordStorageController : ControllerBase
	{
		private readonly ILogger<PasswordStorageController> _logger;
		private readonly IPasswordStorageRepository _repository;

		public PasswordStorageController(ILogger<PasswordStorageController> logger, IPasswordStorageRepository repository)
		{
			_logger = logger;
			_repository = repository;
		}

		/// <summary>
		/// Возвращает список всех паролей, отсортированных в порядке убывания даты-времени создания.
		/// </summary>
		/// <response code="200">Список всех паролей.</response>
		[HttpGet]
		[Produces("application/json")]
		public IEnumerable<PasswordData> GetPasswords([FromQuery] string filter = "")
		{
			return filter?.Length < 1 ?
				   _repository.GetPasswordsSortedByDateDescending().Select(x => new PasswordData(x)) : //Если параметра нет, загружаем все записи
				   _repository.GetPasswordsSortedByDateDescendingContaining(filter).Select(x => new PasswordData(x)); //Если параметр есть, загружаем записи по фильтру
		}

		/// <summary>
		/// Возвращает значение пароля для записи с указанным <paramref name="id"/>.
		/// </summary>
		/// <param name="id">id записи пароля.</param>
		/// <response code="200">Пароль успешно найден.</response>
		/// <response code="404">Пароля с таким ID не существует.</response>
		[HttpGet("{id}/password")]
		[Produces("application/json")]
		public async Task<ActionResult<string>> GetActualPassword(int id)
		{
			PasswordEntry entry = await _repository.GetPassword(id);

			if (entry == null)
				return NotFound();
			else
				return entry.Password;
		}


		/// <summary>
		/// Возвращает запись пароля с указанным <paramref name="id"/>.
		/// </summary>
		/// <param name="id">id записи пароля.</param>
		/// <response code="200">Пароль успешно найден.</response>
		/// <response code="404">Пароля с таким ID не существует.</response>
		[HttpGet("{id}")]
		[Produces("application/json")]
		public async Task<ActionResult<PasswordData>> GetPassword(int id)
		{
			PasswordEntry entry = await _repository.GetPassword(id);

			if (entry == null)
				return NotFound();
			else
				return new PasswordData(entry);
		}


		/// <summary>
		/// Добавляет новую запись с паролем.
		/// </summary>
		/// <param name="password">Данные записи с паролем типа <see cref="NewPasswordData"/></param>
		/// <response code="201">Пароль успешно добавлен.</response>
		/// <response code="400">В теле запроса отсутствуют необходимые поля, передан неверный тип пароля или переданный email не является корректным.</response>
		/// <response code="500">Ошибка БД.</response>
		[HttpPost]
		[Consumes(typeof(NewPasswordData), "application/json")]
		[Produces("application/json")]
		public async Task<ActionResult<PasswordData>> AddPassword([FromBody] NewPasswordData password)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			if (!Enum.TryParse(password.PasswordType, out PasswordEntryType type))
				return BadRequest("Invalid password type");

			else if (type == PasswordEntryType.Email && !IsValidEmail(password.PasswordFor))
				return BadRequest("Invalid email");

			else if (await _repository.HasPasswordFor(type, password.PasswordFor))
				return Conflict($"A password of type {type} for `{password.PasswordFor}` already exists.");

			PasswordEntry passwordEntry = new PasswordEntry(type, password.Password, password.PasswordFor);
			if (await _repository.AddPassword(passwordEntry))
				return CreatedAtAction(nameof(GetPassword), new { id = passwordEntry.Id }, new PasswordData(passwordEntry));
			else
				return StatusCode(StatusCodes.Status500InternalServerError);
		}

		/// <summary>
		/// Проверка email на валидность.
		/// </summary>
		/// <param name="email">Email, который нужно проверить.</param>
		/// <returns>True, если email валидный.</returns>
		protected static bool IsValidEmail(string email)
		{
			try
			{
				MailAddress mailAddress = new MailAddress(email);
				return true;
			}
			catch (FormatException)
			{
				return false;
			}
		}
	}
}
