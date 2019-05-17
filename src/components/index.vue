<template>
    <full-calendar :config="config" :events="events" ref="calendar"/>
</template>

<script>
  import moment from "moment";
  import {FullCalendar} from "vue-full-calendar";
  import "fullcalendar-scheduler";
  import "fullcalendar/dist/fullcalendar.min.css";
  import "fullcalendar/dist/locale/zh-cn.js";
  import "fullcalendar-scheduler/dist/scheduler.min.css";

  export default {
    components: {FullCalendar},
    data() {
      return {
        events: [
          {
            title: "test",
            resourceId: "a",
            start: moment(),
            end: moment().add(1, "d")
          },
          {
            title: "test",
            resourceId: "a2",
            start: moment().add(2, "d"),
            end: moment().add(3, "d")
          }
        ],
        config: {
          locale: 'zh-cn',
          visibleRange: {
            start: '2019-01-01',
            end:  '2019-03-01',
          },
          validRange: {
            start: '2019-08-15',
            end: '2019-09-03'
          },
          schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
          defaultView: "timelineYear",
          header: {
            left: "prev,next",
            center: "title",
            right: "timelineDay,timelineWeek,timelineMonth,timelineYear"
          },
          resourceLabelText: "Rooms",
          resources: [
            {
              id: "a",
              title: "Room A",
              children: [
                {
                  id: "a1",
                  title: "Room A1"
                },
                {
                  id: "a2",
                  title: "Room A2"
                }
              ]
            }
          ]
        }
      };
    },
    mounted() {
    },
  };
</script>
