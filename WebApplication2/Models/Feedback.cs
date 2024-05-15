using OnlineMobileRecharged.Models.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    [Table("feebacks")]
    public class Feedback : Auditable
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [StringLength(maximumLength: 255)]
        public string content { get; set; }
        public int user_id { get; set; }
    }
}
