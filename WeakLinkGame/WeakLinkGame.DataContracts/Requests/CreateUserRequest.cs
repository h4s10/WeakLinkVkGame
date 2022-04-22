using System.ComponentModel.DataAnnotations;

namespace WeakLinkGame.DataContracts.Requests;

public class CreateUserRequest
{
    [Required]
    public string Name { get; set; }
}