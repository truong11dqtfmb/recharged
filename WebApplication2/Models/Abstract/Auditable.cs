using System.ComponentModel.DataAnnotations;

namespace OnlineMobileRecharged.Models.Abstract
{
    public abstract class Auditable
    {
        [StringLength(maximumLength: 100)]
        public string? create_by { get; set; }
        [StringLength(maximumLength: 100)]
        public string? modify_by { get; set; }
        public DateTime? create_at { get; set; }
        public DateTime? modify_at { get; set; }
        public bool? is_active { get; set; }
    }
}
