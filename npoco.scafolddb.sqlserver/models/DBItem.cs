public class DBItem
{
    public string Namespace { get; set; }
    public string Db { get; set; }

    public string Cs { get; set; }

    public bool AppendSchemaToTables { get; set; } = true;
}