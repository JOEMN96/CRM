import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./calender.module.scss";
import moment from "moment";
import { IAllowFunc, IDateArgs, IDateSelect } from "./types";

export default function Calender() {
  //  Data from server

  // "https://fullcalendar.io/demo-events.json"
  let events = [
    {
      title: "event2",
      start: "2023-11-09",
      end: "2023-11-09",
    },
  ];
  let calenderDate = moment().startOf("month").format("YYYY-MM-DD");
  let currentDate = moment().format("YYYY-MM-DD h:mm:ss a");

  let editConstraint = {
    start: moment().format("YYYY-MM-DD[T]00:00:00"),
    end: moment().add(1, "days").format("YYYY-MM-DD[T]24:60:60"),
  };

  // END Data from server

  const serverTime = {
    start: moment().format("YYYY-MM-DD"),
    end: moment().add(2, "days").format("YYYY-MM-DD"),
  };

  console.log(serverTime);

  const handleDateClick = (arg: IDateArgs) => {
    // console.log(arg);
    // console.log(arg.view?.getCurrentData());
  };

  console.log(editConstraint);

  return (
    <section className={styles.wrapper}>
      <FullCalendar
        initialDate={calenderDate}
        editable={true}
        selectable={true} // Enable select
        headerToolbar={{ end: "prev,next" }}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} // event fire's when we click the day
        eventStartEditable={false} // Disable drag
        selectConstraint={editConstraint} // set select or click constraint
        eventClick={function (obj) {
          console.log("event item is clicked");
        }}
      />
    </section>
  );
}
