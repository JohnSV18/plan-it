import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Modal from "react-modal";
import axios from "axios";
import {  useNavigate, useParams, useLocation, Link} from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

// components
import Sidebar from "../Sidebar/Sidebar";

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



const Availability = (props: any) => {

  //Params passsed throught naviagtion
  // on page load, get meeting info from data
  const availabilityNavigation: any = useLocation();
  const meetingNumIdNav = availabilityNavigation.state['meetingNumID'];
  const eventNameNav = availabilityNavigation.state['eventName'];
  const eventDateNav = availabilityNavigation.state['date'];
  const coordTimeZoneNav = availabilityNavigation.state['coordTimeZone'];
  const emailsNav = availabilityNavigation.state['emails'];
  // const attendees = availabilityNavigation.state['attendees'];



  // get meetingID from useParams of url
  const meetingNumID = useParams().id;
  

  let navigate = useNavigate();

  // initialize useForm
  const { register, handleSubmit, setValue, formState: { errors}, reset } = useForm<FormData>();

  // init modal
   Modal.setAppElement('#root');

  // initialize state
  // all availabilites selected by user
  const [ eventArray, setEventArray ] = useState<AvailabilityArray>([]);
  // timezone of invitee/person using this page
  const [ timezone, setTimezone ] = useState<string>();
  // timeZoneOffset
  const [ timeZoneOffset, setTimeZoneOffset ] = useState<number>();
  // availability modal open
  const [ availabilityModalIsOpen, setAvailabilityModalIsOpen ] = useState<boolean>(false);
  // event name
  const [ eventName, setEventName ] = useState<string>();
  // date selected by coordinator
  const [ selectedDate, setSelectedDate ] = useState<string>();
   // time zone of coordinator
  const [ coordTimeZone, setCoordTimeZone ] = useState<string>();
  // calendar month
  const [ calendarMonth, setCalendarMonth ] = useState<string>();
  // calendar year
  const [ calendarYear , setCalendarYear ] = useState<number>();
  // number of invitees
  const [ numOfAttendees, setNumOfAttendees ] = useState<number[]>();


  // get timezone of user
  useEffect(() => {
    // async function for axios call
    const getData = async() => {
      try{
        {

          //deconstruct data from response
          // const { eventName, date, timezone, emails } = response.data[0];

          // save data in state
          setEventName(eventNameNav);
          setSelectedDate(eventDateNav);
          setCoordTimeZone(coordTimeZoneNav);

          // get month as string from event date
          const month = new Date(eventDateNav).toLocaleString('default', {month: "long"});
          setCalendarMonth(month);
          //get year
          const year = new Date(eventDateNav).getFullYear();
          setCalendarYear(year);

          // get current timeZone
          const eventTimeZone = new Date().toLocaleTimeString(undefined, {timeZoneName: "short"}).split(" ")[2];
          setTimezone(eventTimeZone);

          // get timezoneoffest
          // const timeZoneOffset = -180;
          const timeZoneOffset = new Date().getTimezoneOffset();
          console.log("timezoneOFfset=",timeZoneOffset);
          setTimeZoneOffset(timeZoneOffset);

          // determine number of meeting attendees
          // includes coordinator
          let arrayOfNumOfUsers = [1];
          if(emailsNav.length > 0){
            for (let i= 0; i < emailsNav.length; i++){
              arrayOfNumOfUsers.push(i + 2)
            }
            setNumOfAttendees(arrayOfNumOfUsers);
          }
        }
        // const response = await axios.get(`http://localhost:4000/dates/results/${meetingNumID}`);

        // if(response !== undefined){

        //   //deconstruct data from response
        //   const { eventName, date, timezone, emails } = response.data[0];

        //   // save data in state
        //   setEventName(eventName);
        //   setSelectedDate(date);
        //   setCoordTimeZone(timezone);

        //   // get month as string from event date
        //   const month = new Date(date).toLocaleString('default', {month: "long"});
        //   setCalendarMonth(month);
        //   //get year
        //   const year = new Date(date).getFullYear();
        //   setCalendarYear(year);

        //   // get current timeZone
        //   const eventTimeZone = new Date().toLocaleTimeString(undefined, {timeZoneName: "short"}).split(" ")[2];
        //   setTimezone(eventTimeZone);

        //   // get timezoneoffest
        //   // const timeZoneOffset = -180;
        //   const timeZoneOffset = new Date().getTimezoneOffset();
        //   console.log("timezoneOFfset=",timeZoneOffset);
        //   setTimeZoneOffset(timeZoneOffset);

        //   // determine number of meeting attendees
        //   // includes coordinator
          let arrayOfNumOfUsers = [1];
          if(emailsNav.length > 0){
            for (let i= 0; i < emailsNav.length; i++){
              arrayOfNumOfUsers.push(i + 2)
            }
            setNumOfAttendees(arrayOfNumOfUsers);
          }
        // }
      }
      catch(error){
        if(error instanceof Error){
          console.log("error message: ", error.message)
        }
      }
    }
    // open modal
    setAvailabilityModalIsOpen(true);
    // make axios call to get data
    getData();
    
  }, [])

  // open modal
  // useEffect(() => {
  //   setAvailabilityModalIsOpen(true);
  // })

  // function to put time in hours/minutes in am/pm format
  const timeFormatCalc = (time:any) => {
    const hours = time.getHours();
    const hour = (hours % 12) || 12;
    let pm = false;
    if(hours > 11){
      pm = true;
    }
    const minutes = time.getMinutes() <= 9 ? "0" + time.getMinutes() : time.getMinutes();

    return `${hour}:${minutes} ${pm ?"pm" :"am"}`
  }

  // creates an event when the user clicks on a time block
  const handleTimeSelected = (args:any) => {
    console.log('event created');
    // the two parameters of the event time block in string format
    // eg. "2022-04-05T09:00:00"
    const start = args.start;
    const end = args.end;
    
    // get day of week number
    const dayOfWeek = start.getDayOfWeek();

    // create text with start and end time of selection
    const startText = timeFormatCalc(start);
    const endText = timeFormatCalc(end);
       

    const dp = args.control;
    dp.clearSelection();

    dp.events.add(
      new DayPilot.Event({
        start: start,
        end: end,
        id: dayOfWeek,
        text: `Avail: ${startText} - ${endText}`,
      })
    );
    // dp.events.list contains all of the events that have been created
    setEventArray(dp.events.list);
  };


  // deletes the event when the user clicks on it
  const handleEventClicked = (args: any) => {
    console.log('event deleted');

    const dp = args.control;
   
    dp.events.remove(args.e);
    // console.log(dp.events);
    setEventArray(dp.events.list);
  }





  // makes axios post call when user submits availability form
  const onSubmit = handleSubmit<FormData>(data => {
    // console.log(data);
  
    // convert times to UTC0
    let availToChange = data.availability;
    availToChange.forEach((availBlock) => {
      // for each object, get start and end value
      let currentStart = availBlock.start;
      let currentEnd = availBlock.end;
      // add the timeZoneOffset in minutes to currentTime
      let newStart =  currentStart.addMinutes(timeZoneOffset);
      let newEnd = currentEnd.addMinutes(timeZoneOffset);
      // save new value as start and end time
      availBlock.start = newStart;
      availBlock.end = newEnd;


      console.log(currentStart, currentEnd)
      console.log(availBlock.start, availBlock.end)
    })
    console.log(data)
    
    

    // navigate('/testingresults')

    // axios POST
    // axios.post(`http://localhost:4000/dates/availability/${meetingNumID}`, data)
    // .then(() => {
    //   navigate(`/results/${meetingNumID}`, { 
    //     state: {
    //       meetingNumID: meetingNumID
    //     }
    //    });
    // })

    //reset form fields
    reset();
  })

  return(
    <div className="availability">
        <Sidebar numOfAttendees={numOfAttendees} results={false}/>
        <Modal 
          className={"availabilityModal"}
          overlayClassName={"availabilityOverlay"}
          isOpen={availabilityModalIsOpen}
          shouldCloseOnOverlayClick={false}
          // onRequestClose={() => setAvailabilityModalIsOpen(false)}
          contentLabel="Availability page"
          style={{content: {WebkitOverflowScrolling: 'touch',}}}
          >
          
          <h1>Add <span className="text">Availability</span></h1>
      
          <h2>Meeting: {eventName}</h2>
          
          <form onSubmit={ onSubmit }>
           
              <label htmlFor="userName">Name</label>
              <input 
                type="text" 
                className={errors.userName ?"error" :"success"}
                placeholder={"Input text"}
                aria-label="Enter name here"
                aria-invalid={errors.userName ?"true" :"false"}
                {...register("userName", {required: "Name is required" })} 
              />
              {/* error message if no name entered */}
              <ErrorMessage errors={errors} name="userName" as="p" className="errorMessage"/>
          

           
              <p>Please add your availability</p>
              <p>Click and drag to add your availability. Please note that you are inputting your availability in your local time <span className="text">{timezone}</span> and it will be converted to the coordinator's time zone <span className="text">{coordTimeZone}</span>.</p>

              <div className="calendarContainer">
                <div className="calendarHeader">
                  <p>{calendarMonth}, {calendarYear}</p>
                </div>
                <DayPilotCalendar 
                  viewType={"Week"}
                  headerDateFormat={"ddd dd"}
                  startDate={selectedDate}
                  onTimeRangeSelected={handleTimeSelected}
                  onEventClick={handleEventClicked}
                  durationBarVisible = {false}
                  heightSpec={"Full"}
                  cellHeight={25}
                />
              </div>
              <button
                type="submit"
                className="availabilitySubmitBtn"
                onClick={() => {

                 
                  window.location.href = "https://www.figma.com/proto/HY8PgTqQQmW3wvjBqosS1c/Plan-it?node-id=378%3A4386&scaling=scale-down&page-id=378%3A3294&starting-point-node-id=378%3A4386"
                }}>
                Add Availability
              </button>
           
          </form>

        </Modal>

    
    </div>
  )
}

export default Availability;