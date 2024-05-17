using OnlineMobileRecharged.Models.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    [Table("transactions")]
    public class Transaction : Auditable
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [StringLength(maximumLength: 255)]
        public string? description { get; set; }
        [StringLength(maximumLength: 100)]
        public string phone { get; set; }
        public int value { get; set; }
        public int service_id { get; set; }
        public int user_id { get; set; }
    }
}
