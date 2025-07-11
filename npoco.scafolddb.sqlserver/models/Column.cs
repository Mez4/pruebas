public class Column
{
    public string TABLE_CATALOG { get; set; }
    public string TABLE_SCHEMA { get; set; }
    public string TABLE_NAME { get; set; }
    public string COLUMN_NAME { get; set; }
    public int? ORDINAL_POSITION { get; set; }
    public object COLUMN_DEFAULT { get; set; }
    public string IS_NULLABLE { get; set; }
    public string DATA_TYPE { get; set; }
    public int? CHARACTER_MAXIMUM_LENGTH { get; set; }
    public int? CHARACTER_OCTET_LENGTH { get; set; }
    public int? NUMERIC_PRECISION { get; set; }
    public int? NUMERIC_PRECISION_RADIX { get; set; }
    public int? NUMERIC_SCALE { get; set; }
    public int? DATETIME_PRECISION { get; set; }
    public object CHARACTER_SET_CATALOG { get; set; }
    public object CHARACTER_SET_SCHEMA { get; set; }
    public string CHARACTER_SET_NAME { get; set; }
    public object COLLATION_CATALOG { get; set; }
    public object COLLATION_SCHEMA { get; set; }
    public bool IDENTITY_COLUMN { get; set; }
    public bool COMPUTED_COLUMN { get; set; }
    public bool IS_NULLABLE_BOOL { get { return IS_NULLABLE is not null && IS_NULLABLE != "NO"; } }
}