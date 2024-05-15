namespace OnlineMobileRecharged.Common.CommonModels
{
    public class Result
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool HasError { get; set; }
        public object Object { get; set; }
    }
}
