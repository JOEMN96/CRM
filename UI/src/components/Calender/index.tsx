import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./calender.module.scss";
import moment from "moment";
import { IAllowFunc, IDateArgs, IDateSelect, IEventClickArg, IEventsCalendarType } from "./types";
import CalenderModal from "./CalenderModal/CalenderModal";
import { notification } from "antd";
import { Popover } from "antd";

export default function Calender({ config, entries }: ICalenderData) {
  const [openModal, setopenModal] = useState(false);
  const calenderRef: React.Ref<any> = useRef(null);
  const [currenClickedDate, setCurrenClickedDate] = useState("");
  const [selectedEvent, setselectedEvent] = useState("");

  function canEdit(cellDate: string | undefined) {
    if (!cellDate) return false;
    cellDate += moment().format("[T]HH:mm:ss");

    return moment(cellDate).isBetween(
      moment(config.timeFrame.start, "YYYY-MM-DD[T]HH:mm:ss"),
      moment(config.timeFrame.end, "YYYY-MM-DD[T]HH:mm:ss")
    );
  }

  const renderEventContent = (eventInfo: any) => {
    return (
      <Popover content={eventInfo.event.title}>
        <pre style={{ overflow: "hidden" }}>{eventInfo.event.title}</pre>
      </Popover>
    );
  };

  const handleDateChange = (date: any) => {
    AddEditableClass();
  };

  const handleEventClick = (eventObj: IEventClickArg) => {
    if (eventObj.jsEvent.target instanceof HTMLElement) {
      let date = (eventObj.jsEvent?.target.closest(".fc-day") as HTMLElement)?.dataset.date;
      if (!canEdit(date)) {
        return notification.open({ message: "You can't add here", type: "info", duration: 2 });
      }
      if (date) {
        setCurrenClickedDate(date);
        setopenModal(true);
      }
      let eventTitle = getEventTitle(date);
      if (eventTitle) {
        setselectedEvent(eventTitle);
      }
    }
  };

  const AddEditableClass = () => {
    let startDateWithoutTime = config.timeFrame.start.split("T")[0];
    let endDateWithoutTime = config.timeFrame.end.split("T")[0];
    document.querySelector(`td[data-date="${startDateWithoutTime}"]`)?.classList.add("Editable");
    document.querySelector(`td[data-date="${endDateWithoutTime}"]`)?.classList.add("Editable");
  };

  const handleDateClick = (arg: IDateArgs) => {
    if (!canEdit(arg.dateStr)) return;
    setCurrenClickedDate(arg.dateStr);

    let clickedEvent = getEventTitle(arg.dateStr);

    if (clickedEvent) {
      setselectedEvent(clickedEvent);
    } else {
      setselectedEvent("");
    }
    setopenModal(true);
  };

  const handleSelectAllow: IAllowFunc = (span) => {
    if (canEdit(span.startStr)) {
      return true;
    } else {
      notification.open({ message: "You can't add here", type: "info", duration: 2 });
      return false;
    }
  };

  const getEventTitle = (date: string | undefined) => {
    let ck = calenderRef.current.calendar.getEvents().find((ele: any) => {
      if (moment(ele.start).format("YYYY-MM-DD") === date) {
        return ele;
      }
    });
    if (ck?._def?.title) {
      return ck._def.title as string;
    }
  };

  return (
    <section className={styles.wrapper}>
      <FullCalendar
        ref={calenderRef}
        initialDate={config.ClientCalendarDate}
        editable={true}
        selectable={true} // Enable select
        headerToolbar={{ end: "prev,next" }}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={entries as IEventsCalendarType}
        dateClick={handleDateClick} // event fire's when we click the day
        eventStartEditable={false} // Disable drag
        eventClick={(eventObject) => handleEventClick(eventObject)}
        selectAllow={(cell) => handleSelectAllow(cell, null)}
        hiddenDays={[0, 6]}
        eventContent={renderEventContent} // Custom event renderer
        datesSet={(dateInfo) => handleDateChange(dateInfo)} // This event fires when there is date (Like Month) change
        // eventAdd={}
        // eventChange={}
        contentHeight={"auto"}
      />

      <CalenderModal setopenModal={setopenModal} openModal={openModal} date={currenClickedDate} selectedEvent={selectedEvent} />
    </section>
  );
}
