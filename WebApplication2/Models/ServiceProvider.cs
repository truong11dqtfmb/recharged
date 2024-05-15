using OnlineMobileRecharged.Models.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    [Table("service_providers")]
    public class ServiceProvider : Auditable
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [StringLength(maximumLength: 255)]
        public string name { get; set; }
        [StringLength(maximumLength: 255)]
        public string picture { get; set; }
        [StringLength(maximumLength: 255)]
        public string? description { get; set; }
    }
}
