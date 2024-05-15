using OnlineMobileRecharged.Models.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication2.Models
{
    [Table("users")]
    public class User : Auditable
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [StringLength(maximumLength: 255)]
        public string username { get; set; }
        [StringLength(maximumLength: 255)]
        public string password { get; set; }
        [StringLength(maximumLength: 255)]
        public string phone { get; set; }
        [StringLength(maximumLength: 255)]
        public string email { get; set; }
        [StringLength(maximumLength: 255)]
        public string fullname { get; set; }
        [StringLength(maximumLength: 255)]
        public string address { get; set; }
        public int? role { get; set; }
        public int? amount { get; set; }

    }
}
