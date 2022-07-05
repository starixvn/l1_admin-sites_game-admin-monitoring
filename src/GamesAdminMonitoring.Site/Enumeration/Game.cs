namespace GamesAdminMonitoring.Site.Enumeration
{
    public class Game : Enumeration
    {
        public const string FourGuardiansValue = "fourguardians";
        public const string HeroesSlotValue = "heroesslot";
        public const string NightClubValue = "nightclub";

        public const string CasinoHoldemPokerValue = "casinoholdempoker";
        public const string TexasHoldemPokerValue = "texasholdempoker";
        public const string TreasureIslandValue = "treasureisland";
        public const string WayToGoalValue = "waytogoal";

        public const string HiLoValue = "hilo";


        public static readonly Game FourGuardians = new Game(FourGuardiansValue, "Four Guardians", GameId.FourGuardians);
        public static readonly Game HeroesSlot = new Game(HeroesSlotValue, "Heroes Slot", GameId.HeroesSlot);
        public static readonly Game NightClub = new Game(NightClubValue, "Night Club", GameId.NightClub);

        public static readonly Game CasinoHoldemPoker = new Game(CasinoHoldemPokerValue, "Casino Hold'em", GameId.CasinoHoldemPoker);
        public static readonly Game TexasHoldemPoker = new Game(TexasHoldemPokerValue, "Texas Hold'em", GameId.TexasHoldemPoker);

        public static readonly Game TreasureIsland = new Game(TreasureIslandValue, "Treasure Island", GameId.NightClub);
        public static readonly Game HiLo = new Game(HiLoValue, "Hi-Lo", GameId.HiLo);
        public static readonly Game WayToGoal = new Game(WayToGoalValue, "Way To Goal", GameId.WayToGoal);


        public Game()
        {
        }

        public Game(string value, string displayName)
            : base(value, displayName)
        {
        }

        public Game(string value, string displayName, GameId id)
            : base(value, displayName)
        {
            GameId = id;
        }

        public GameId GameId { get; }
    }
}