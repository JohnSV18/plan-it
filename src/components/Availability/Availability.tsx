import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

// components
import TimeZone from "../TimeZone/TimeZone";

//styles
import "./Availability.css";

//types
type UserName = string;
type AvailabilityArray = any[];
type Timezone = string;


type FormData = {
  userName: UserName;
  availability: AvailabilityArray;
  timezone: Timezone;
}

const Availability = () => {
  // initialize useForm
  const { register, handleSubmit, setValue, formState: { errors}, reset } = useForm<FormData>();

  // initialize DayPilot calendar
  // let calendar = DayPilot.Calendar;

  // initialize state
  // const [ time, setTime ] = useState<string[]>([]);
  // all availabilites selected by user
  const [ eventArray, setEventArray ] = useState<AvailabilityArray>([]);
  // timezone
  const [ timezone, setTimezone ] = useState<string>();


  // get timezone of user
  useEffect(() => {
    const eventTimeZone = TimeZone();
    setTimezone(eventTimeZone);
    
  }, [])


  // creates an event when the user clicks on a time block
  const handleTimeSelected = (args:any) => {
    // console.log(`You selected: start=${args.start}; end=${args.end}`);
    // setTime([args.start, args.end]);
    console.log(args);

    // the two parameters of the event time block in string format
    // eg. "2022-04-05T09:00:00"
    const start = args.start;
    const end = args.end;

    const dp = args.control;
    dp.clearSelection();

    console.log(args);
    dp.events.add(
      new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: `Available: ${start.getHours()}:${
          start.getMinutes() <= 9
            ? "0" + start.getMinutes()
            : start.getMinutes()
        }-${end.getHours()}:${
          end.getMinutes() <= 9 ? "0" + end.getMinutes() : end.getMinutes()
        }`,
      })
    );
    // dp.events.list contains all of the events that have been created
    setEventArray(dp.events.list);
    // }
  };


  // deletes the event when the user clicks on it
  const handleEventClicked = (args: any) => {
    console.log(args.e, args.e.start, args.e.end, args.e.text);

    const dp = args.control;
   
    dp.events.remove(args.e);
    console.log(dp.events);
    setEventArray(dp.events.list);
  }


  // when user submits availability form
  const onSubmit = handleSubmit<FormData>(data => {
    console.log(data);
    // axios POST
    axios.post("", data)
    .then(res => console.log(res.data))
    .catch(error => console.log(error));


    //reset form fields
    reset();
  })

  return(
    <div className="availability wrapper">
      <div className="availabilityIntro">
        {/* get meeting name from database */}
        <h1>Meeting Name</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam tempora similique corporis nesciunt quo numquam!</p>
      </div>
      <form onSubmit={ onSubmit }>
        <section className="availabilityFormName">
          <label htmlFor="userName">Name</label>
          <input 
            type="text" 
            aria-invalid={errors.userName ?"true" :"false"}
            {...register("userName", {required: true })} 
          />
          {errors.userName && (
            <span role="alert">
              Event name is required
            </span> 
          )}
        </section>

        <section className="availabilityFormCalendar">
          <p>Choose availability</p>
          <p>Time shown in local timezone: {timezone}</p>
          <DayPilotCalendar 
            viewType={"Week"}
            headerDateFormat={"d MMMM yyyy"}
            onTimeRangeSelected={handleTimeSelected}
            onEventClick={handleEventClicked}
          />
          <button
            type="submit"
            onClick={() => {
              setValue("availability", eventArray ?eventArray :[])
              setValue("timezone", timezone ?timezone :"")
            }}> 
            Add Availability
          </button>
        </section>
      </form>

    
    </div>
  )
}

export default Availability;