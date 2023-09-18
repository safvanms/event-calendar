import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Calendar.css'
import Header from '../../Components/Header/Header'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// common time slots for the event

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
]

export default function CalendarPage() {
  const [value, onChange] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedRecruiter, setSelectedRecruiter] = useState(null)
  const [event, setEvent] = useState(null)
  const [eventDetails, setEventDetails] = useState([])
  const [selectedRecruitersByDay, setSelectedRecruitersByDay] = useState({})
  const [selectedRecruitersBySlot, setSelectedRecruitersBySlot] = useState({})
  const [disabledSlotsByDate, setDisabledSlotsByDate] = useState({})

  // retrieving all Login details

  const location = useLocation()
  const userData = location.state

  // total Recruiters

  const Recruiters = [
    'recruiter1',
    'recruiter2',
    'recruiter3',
    'recruiter4',
    'recruiter5',
  ]

  // for showing the time slots of each day by onClicking on the Date in the Calendar

  const handleDateClick = (date) => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    // only allowing the current and future dates to book events
    if (date < currentDate) {
      alert(
        'You cannot select a date in the past. Please choose a future date.',
      )
      // Friday setting as holiday
    } else if (date.getDay() !== 5) {
      setSelectedDate(date)
      setSelectedSlot(null)
      setShowDialog(false)
    } else {
      alert('Friday is a holiday. Please select another date.')
    }
  }

  // Slots handling , and to open the event input dialog

  const handleSelectSlot = (slot) => {
    if (
      disabledSlotsByDate[selectedDate.toDateString()] &&
      disabledSlotsByDate[selectedDate.toDateString()].includes(slot)
    ) {
      return
    }
    setSelectedSlot(slot)
    setShowDialog(true)
  }

  // select the available recruiter in the dialog

  const handleRecruiterChange = (e) => {
    setSelectedRecruiter(e.target.value)
  }

  // input the event in the dialog

  const handleEventChange = (e) => {
    setEvent(e.target.value)
  }

  // Booking function by submitting the dialog

  const handleBookEvent = (e) => {
    e.preventDefault()
    // checking if there are event and recruiter , if so passing the details
    if (event && selectedRecruiter) {
      const selectedDay = selectedDate.toISOString()
      let selectedSlotKey = `${selectedDay}-${selectedSlot}`

      if (selectedRecruitersByDay[selectedDay]?.length >= 5) {
        alert('All recruiters are already assigned slots for this day.')
        return
      }

      // Check if the selected recruiter is already assigned to any slot on the selected day
      if (selectedRecruitersByDay[selectedDay]?.includes(selectedRecruiter)) {
        alert('This recruiter is already assigned to a slot for this day.')
        return
      }

      // Update the selected recruiters by day
      setSelectedRecruitersByDay((prevSelectedRecruitersByDay) => ({
        ...prevSelectedRecruitersByDay,
        [selectedDay]: [
          ...(prevSelectedRecruitersByDay[selectedDay] || []),
          selectedRecruiter,
        ],
      }))

      // Update the selected recruiters by slot
      setSelectedRecruitersBySlot((prevSelectedRecruitersBySlot) => ({
        ...prevSelectedRecruitersBySlot,
        [selectedSlotKey]: [
          ...(prevSelectedRecruitersBySlot[selectedSlotKey] || []),
          selectedRecruiter,
        ],
      }))

      // Booking details setting into a new state for showing in front along with User's Info
      setEventDetails([
        ...eventDetails,
        { event, selectedRecruiter, selectedSlot, userData, selectedDate },
      ])

      if (
        timeSlots.every((slot) => {
          const slotKey = `${selectedDay}-${slot}`
          return selectedRecruitersBySlot[slotKey]?.length === Recruiters.length
        })
      ) {
        // If all slots are booked, update the disabled slots for this date
        setDisabledSlotsByDate((prevDisabledSlotsByDate) => ({
          ...prevDisabledSlotsByDate,
          [selectedDate.toDateString()]: timeSlots,
        }))
      }

      setDisabledSlotsByDate((prevDisabledSlotsByDate) => ({
        ...prevDisabledSlotsByDate,
        [selectedDate.toDateString()]: [
          ...(prevDisabledSlotsByDate[selectedDate.toDateString()] || []),
          selectedSlot,
        ],
      }))

      setShowDialog(false)
      setSelectedRecruiter('')
      setEvent('')
    }
  }


  return (
    <div>
      <div className="calendar__page">
        <div className="main__section">
          <Header />
          <div className="calendar__container">
            {/* Events are showing here */}
            <div className="events">
              <h2>{eventDetails.length===1?"Event":"Events"}</h2>
              {eventDetails.length !== 0
                ? eventDetails.map(
                    ({
                      selectedDate,
                      selectedSlot,
                      event,
                      selectedRecruiter,
                    }) => (
                      <div key={selectedSlot} className="event__details">
                        <p>
                          <span> {userData.username}</span>{' '}
                          <span style={{ color: 'grey' }}>
                            on {selectedDate.toDateString()} at {selectedSlot}
                          </span>
                        </p>
                        <p>to {selectedRecruiter}</p>
                        <h3>Event : {event}</h3>
                      </div>
                    ),
                  )
                : 'No events yet'}
            </div>

            <div className="calendar">
              <Calendar
                onChange={onChange}
                value={value}
                onClickDay={handleDateClick}
              />
              {selectedDate && (
                <div className="slot__sec">
                  <h4>{selectedDate.toDateString()}</h4>
                  <p>Available Slots : </p>
                  {timeSlots.map((slot, i) => {
                    const isDisabled =
                      disabledSlotsByDate[selectedDate.toDateString()] &&
                      disabledSlotsByDate[selectedDate.toDateString()].includes(
                        slot,
                      )

                    const allSlotsBooked =
                      disabledSlotsByDate[selectedDate.toDateString()] &&
                      disabledSlotsByDate[selectedDate.toDateString()]
                        .length === 5

                    return (
                      <div key={i}>
                        <div
                          className={`time__slot ${
                            isDisabled || allSlotsBooked ? 'disabled' : ''
                          }`}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          {allSlotsBooked ? "Slot isn't available " : slot}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog */}

        {showDialog && (
          <div className="dialog">
            <div className="dialog-content">
              <span className="close" onClick={() => setShowDialog(false)}>
                &times;
              </span>
              <h2>Book Slot</h2>
              <div style={{ marginBottom: '15px' }}>
                <p>Date: {selectedDate.toDateString()}</p>
                <p>Time Slot: {selectedSlot}</p>
              </div>

              <div className="dialog__inputs">
                <label>Select Recruiter:</label>
                <select
                  onChange={handleRecruiterChange}
                  value={selectedRecruiter}
                  required
                >
                  <option value="">Select Recruiter</option>
                  {userData &&
                    Recruiters.map((recruiter, i) => {
                      const isRecruiterAssigned = selectedRecruitersByDay[
                        selectedDate.toISOString()
                      ]?.includes(recruiter)

                      return (
                        <option
                          key={i}
                          value={recruiter}
                          disabled={isRecruiterAssigned}
                        >
                          {recruiter}
                        </option>
                      )
                    })}
                </select>
              </div>

              <div className="dialog__inputs">
                <label> Event:</label>
                <input
                  type="text"
                  value={event}
                  onChange={handleEventChange}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <button onClick={handleBookEvent}>Book</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
