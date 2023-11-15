import * as fci from "@fullcalendar/interaction";
import * as fc from "@fullcalendar/core";

interface IDateArgs extends fci.DateClickArg {}
interface IDateSelect extends fc.DateSelectArg {}
interface IAllowFunc extends fc.AllowFunc {}
interface IEventsCalendarType extends fc.EventSourceInput {}
interface IEventClickArg extends fc.EventClickArg {}

interface ICalenderModal {
  setopenModal: (mode: boolean) => void;
  openModal: boolean;
  date: string;
  selectedEvent: string;
}

interface IAddTime {
  workDescription: string;
}
