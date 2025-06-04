public class Key
{
    public string CONSTRAINT_CATALOG { get; set; }
    public string CONSTRAINT_SCHEMA { get; set; }
    public string CONSTRAINT_NAME { get; set; }
    public string TABLE_CATALOG { get; set; }
    public string TABLE_SCHEMA { get; set; }
    public string TABLE_NAME { get; set; }
    public string CONSTRAINT_TYPE { get; set; }
    public string IS_DEFERRABLE { get; set; }
    public string IS_DEFERRED { get; set; }
    public bool IS_DEFERRABLE_BOOL { get { return IS_DEFERRABLE is not null && IS_DEFERRABLE != "NO"; } }
    public bool IS_DEFERRED_BOOL { get { return IS_DEFERRED is not null && IS_DEFERRED != "NO"; } }
}