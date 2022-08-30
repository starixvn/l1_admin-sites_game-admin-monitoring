namespace GamesAdminMonitoring.Site.Enumeration
{
    public class SystemType : Enumeration
    {
        public const string SC1Value = "SC1";
        public const string VG2Value = "VG2";

        public static readonly SystemType SC1 = new SystemType(SC1Value, SC1Value);
        public static readonly SystemType VG2 = new SystemType(VG2Value, VG2Value);

        public SystemType()
        {
        }

        public SystemType(string value, string displayName)
            : base(value, displayName)
        {
        }
    }
}