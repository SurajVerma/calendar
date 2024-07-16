'use strict';

//Public Globals
const days = ['Sunday', 'Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let c_date = new Date();
let day = c_date.getDay();
let month = c_date.getMonth();
let year = c_date.getFullYear();

(function App() {
  const calendar = `<div class="container">
        <div class="row">
            <div class="col-sm-10 mx-auto text-center mt-5 page-hero">
                <h3>Javascript Event Calendar</h3>
                <p>An event calendar based on Javascript, JQuery and Bootstrap. Events are stored in your browser's local storage. Click on a date to add or remove your events</p>
            </div>
        </div>
            <div class="row">
                <div class="col-sm-6 col-12 d-flex">
                    <div class="card border-0 mt-5 flex-fill">
                        <div class="card-header py-3 d-flex justify-content-between">
                            <span class="prevMonth">&#10096;</span>
                            <span><strong id="s_m"></strong></span>
                            <span class="nextMonth">&#10097;</span>
                        </div>
                        <div class="card-body px-1 py-3">
                            <div class="table-responsive">
                                <table class="table table-sm table-borderless">
                                    <thead class="days text-center">
                                        <tr>
                                            ${Object.keys(days)
                                              .map((key) => `<th><span>${days[key].substring(0, 3)}</span></th>`)
                                              .join('')}                                            
                                        </tr>
                                    </thead>
                                    <tbody id="dates" class="dates text-center"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-12 d-flex pa-sm">
                    <div class="card border-0 mt-5 flex-fill d-none" id="event">
                        <div class="card-header py-3 text-center">
                            Add Event
                            <button type="button" class="close hide">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="card-body px-1 py-3">
                            <div class="text-center">
                                <span class="event-date">06 June 2020</span><br>
                                <span class="event-day">Monday</span>
                            </div> 
                            <div class="events-today my-3 px-3">
                               
                            </div> 
                            <div class="input-group events-input mb-3 col-10 mx-auto mt-2">
                                <input type="text" class="form-control" placeholder="Add Event" id="eventTxt">
                                <div class="input-group-append">
                                    <button class="btn btn-danger" type="button" id="createEvent">+</button>
                                </div>
                            </div>                        
                        </div>
                    </div>                            
                </div>
            </div>
        </div>
        <div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">
            <div class="toast" style="position: absolute; top: 0; right: 15px;" data-delay="3000">
                <div class="toast-header">
                <strong class="mr-auto">Calendar</strong>
                <small>Just now</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="toast-body">
                    
                </div>
            </div>
        </div>`;
  document.getElementById('app').innerHTML = calendar;
})();

function renderCalendar(m, y) {
  //Month's first weekday
  let firstDay = new Date(y, m, 1).getDay();
  //Days in Month
  let d_m = new Date(y, m + 1, 0).getDate();
  //Days in Previous Month
  let d_pm = new Date(y, m, 0).getDate();

  let table = document.getElementById('dates');
  table.innerHTML = '';
  let s_m = document.getElementById('s_m');
  s_m.innerHTML = months[m] + ' ' + y;
  let date = 1;
  //remaining dates of last month
  let r_pm = d_pm - firstDay + 1;
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        let cell = document.createElement('td');
        let span = document.createElement('span');
        let cellText = document.createTextNode(r_pm);
        span.classList.add('ntMonth');
        span.classList.add('prevMonth');
        cell.appendChild(span).appendChild(cellText);
        row.appendChild(cell);
        r_pm++;
      } else if (date > d_m && j < 7) {
        if (j !== 0) {
          let i = 0;
          for (let k = j; k < 7; k++) {
            i++;
            let cell = document.createElement('td');
            let span = document.createElement('span');
            let cellText = document.createTextNode(i);
            span.classList.add('ntMonth');
            span.classList.add('nextMonth');
            cell.appendChild(span).appendChild(cellText);
            row.appendChild(cell);
          }
        }
        break;
      } else {
        let cell = document.createElement('td');
        let span = document.createElement('span');
        let cellText = document.createTextNode(date);
        span.classList.add('showEvent');
        if (date === c_date.getDate() && y === c_date.getFullYear() && m === c_date.getMonth()) {
          span.classList.add('bg-danger');
        }
        cell.appendChild(span).appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }
    table.appendChild(row);
  }
}
renderCalendar(month, year);

document.addEventListener('DOMContentLoaded', function () {
  let toastEl = document.querySelector('.toast');
  let toast = new bootstrap.Toast(toastEl);
  function showEvent(eventDate) {
    let storedEvents = JSON.parse(localStorage.getItem('events'));
    if (storedEvents == null) {
      document.querySelector('.events-today').innerHTML =
        '<h5 class="text-center">No events found</h5 class="text-center">';
    } else {
      let eventsToday = storedEvents.filter((eventsToday) => eventsToday.eventDate === eventDate);
      let eventsList = Object.keys(eventsToday).map((k) => eventsToday[k]);
      if (eventsList.length > 0) {
        let eventsLi = '';
        eventsList.forEach((event) => {
          eventsLi += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${event.eventText}
                <button type="button" class="close remove-event" data-event-id="${event.id}" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>`;
        });
        document.querySelector('.events-today').innerHTML = eventsLi;
      } else {
        document.querySelector('.events-today').innerHTML =
          '<h5 class="text-center">No events found</h5 class="text-center">';
      }
    }
  }

  function removeEvent(id) {
    let storedEvents = JSON.parse(localStorage.getItem('events'));
    if (storedEvents != null) {
      storedEvents = storedEvents.filter((ev) => ev.id != id);
      localStorage.setItem('events', JSON.stringify(storedEvents));
      document.querySelector('.toast-body').innerHTML = 'Your event have been removed';
      toast.show();
    }
  }
  document.addEventListener(
    'click',
    function (e) {
      let targetElement = e.target;
      while (targetElement != null) {
        if (targetElement.matches('.remove-event')) {
          let eventId = targetElement.getAttribute('data-event-id');
          removeEvent(eventId);
          return;
        }
        if (targetElement.matches('.hide')) {
          document.querySelector('#event').classList.add('d-none');
        }
        targetElement = targetElement.parentElement;
      }

      if (e.target.matches('.prevMonth')) {
        year = month === 0 ? year - 1 : year;
        month = month === 0 ? 11 : month - 1;
        renderCalendar(month, year);
      }

      if (e.target.matches('.nextMonth')) {
        year = month === 11 ? year + 1 : year;
        month = (month + 1) % 12;
        renderCalendar(month, year);
      }

      if (e.target.matches('.showEvent')) {
        document.querySelector('#event').classList.remove('d-none');
        document.querySelectorAll('.showEvent').forEach((el) => el.classList.remove('active'));
        e.target.classList.add('active');
        let todaysDate = e.target.textContent + ' ' + months[month] + ' ' + year;
        let eventDay = days[new Date(year, month, e.target.textContent).getDay()];
        let eventDate = e.target.textContent + month + year;
        document.querySelector('.event-date').innerHTML = todaysDate;
        document.querySelector('.event-date').setAttribute('data-eventdate', eventDate);
        document.querySelector('.event-day').innerHTML = eventDay;
        showEvent(eventDate);
      }

      if (e.target.matches('#createEvent')) {
        let events = localStorage.getItem('events');
        let obj = [];
        if (events) {
          obj = JSON.parse(events);
        }
        let eventDate = document.querySelector('.event-date').getAttribute('data-eventdate');
        let eventText = document.querySelector('#eventTxt').value;
        let valid = false;
        document.querySelector('#eventTxt').classList.remove('data-invalid');
        if (eventText == '') {
          document.querySelector('.events-input').innerHTML += '<span class="error">Please enter event</span>';
          document.querySelector('#eventTxt').classList.add('data-invalid');
          document.querySelector('#eventTxt').focus();
        } else if (eventText.length < 3) {
          document.querySelector('#eventTxt').classList.add('data-invalid');
          document.querySelector('#eventTxt').focus();
          document.querySelector('.events-input').innerHTML +=
            '<span class="error">please enter at least three characters</span>';
        } else {
          valid = true;
        }
        if (valid) {
          let id = 1;
          if (obj.length > 0) {
            id =
              Math.max.apply(
                '',
                obj.map(function (entry) {
                  return parseFloat(entry.id);
                })
              ) + 1;
          } else {
            id = 1;
          }
          obj.push({
            id: id,
            eventDate: eventDate,
            eventText: eventText,
          });
          localStorage.setItem('events', JSON.stringify(obj));
          document.querySelector('#eventTxt').value = '';
          document.querySelector('.toast-body').innerHTML = 'Your event have been added';
          toast.show();
          showEvent(eventDate);
        }
      }
    },
    true
  );
});
