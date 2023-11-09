import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./calender.module.scss";
import moment from "moment";
import { IAllowFunc, IDateArgs, IDateSelect } from "./types";
import CalenderModal from "./CalenderModal/CalenderModal";
import { useState } from "react";
import { notification } from "antd";

export default function Calender() {
  const [openModal, setopenModal] = useState(false);

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

  let timeframeToEdit = {
    start: moment().subtract(24, "hour").format("YYYY-MM-DD[T]hh:mm:ss"),
    end: moment().add(1, "hour").format("YYYY-MM-DD[T]hh:mm:ss"),
  };

  function canEdit(cellDate: string) {
    cellDate += moment().format("[T]hh:mm:ss");
    return moment(cellDate).isBetween(
      moment(timeframeToEdit.start, "YYYY-MM-DD[T]hh:mm:ss"),
      moment(timeframeToEdit.end, "YYYY-MM-DD[T]hh:mm:ss")
    );
  }

  // END Data from serve

  const handleDateClick = (arg: IDateArgs) => {
    if (!canEdit(arg.dateStr)) return;
  };

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
        eventClick={function (obj) {
          console.log("event item is clicked");
        }}
        selectAllow={function (span, mov) {
          if (canEdit(span.startStr)) {
            return true;
          } else {
            notification.open({ message: "You can't add here", type: "info", duration: 2 });
            return false;
          }
        }}
      />

      <CalenderModal setopenModal={setopenModal} openModal={openModal} />
    </section>
  );
}
