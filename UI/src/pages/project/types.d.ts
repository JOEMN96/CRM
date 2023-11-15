interface ICalenderTypes {
  title: string;
  start: string;
  end: string;
  id: number;
}

interface ITimeframe {
  start: string;
  end: string;
}

interface ICalenderData {
  entries: ICalenderTypes[];
  config: {
    timeFrame: ITimeframe;
    ClientCalendarDate: string;
  };
}

interface IGetEntriesGet {
  month: number;
  projectId: number;
}
