using OnlineMobileRecharged.Models.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    [Table("subcriptions")]
    public class Subscription : Auditable
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [StringLength(maximumLength: 255)]
        public string description { get; set; }
        public int value { get; set; }
        public int service_id { get; set; }
    }
}
