<template>
  <Page backgroundSpanUnderStatusBar="true" backgroundColor="black" statusBarStyle="dark" androidStatusBarBackground="black">
    <ActionBar>
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"/>
      <Label text="" fontSize="24" verticalAlignment="center"/>
    </ActionBar>
    <FlexboxLayout backgroundColor="black" color="white" flexDirection="column">      
      <!-- Events List -->
      <ScrollView>
        <StackLayout>
          <FlexboxLayout flexDirection="row">
              <Image :src="'https://sfvm.la'+$props.event.image" loadMode="sync" stretch="aspectFill"/>
          </FlexboxLayout>
          <FlexboxLayout flexDirection="row">
              <Label :text="$props.event.name" fontSize="24" textWrap="true" class="eventName" />
          </FlexboxLayout>
          
          <FlexboxLayout flexDirection="row" class="eventDetails">
              <Label :text="(event.price == '0.00' ? 'FREE' : '$'+event.price)" flexGrow="1" textWrap="true" width="33.333%"/>
              <Label :text="$props.event.start_date | prettyDate" flexGrow="1" textWrap="true" width="33.333%"/>
              <Label :text="$props.event.address + ', ' + $props.event.city" flexGrow="1"  textWrap="true" width="33.333%" @tap="getDirections(($props.event.address + ', ' + $props.event.city))"/>
          </FlexboxLayout>

          <FlexboxLayout flexDirection="column" class="eventShortDescription">
              <Label :text="$props.event.short_description + '\n'" textWrap="true"/>
              <Label :text="$props.event.start_date | eventEnds" textWrap="true"/>
          </FlexboxLayout>

          <!-- ACTIONS -->
          <FlexboxLayout color="white">
            <Button :text="remindText" flexGrow="1" @tap="scheduleReminder($props.event)"/>
            <Button text="More Info" v-if="$props.event.more_details_link" flexGrow="1" @tap="openUrl($props.event.more_details_link)"/>
            <Button text="Directions" flexGrow="1" @tap="getDirections(($props.event.address + ', ' + $props.event.city))"/>
          </FlexboxLayout>
        </StackLayout>
      </ScrollView>
    </FlexboxLayout>
  </Page>
</template>

<script >
  import { LocalNotifications } from "nativescript-local-notifications";

  const moment = require('moment');
  // require the plugin
  const Directions = require("nativescript-directions").Directions;
  const directions = new Directions();
  const utilsModule = require("tns-core-modules/utils/utils");
  const appSettings = require("tns-core-modules/application-settings");
  import EventPage from './EventPage'


  export default {
    props: ['event'],

    data() {
      return {
        remindText: 'Remind Me',
        remindMe: false,
        reminderId: null
      }
    },

    methods: {
      goBack: function () {
        this.$navigateBack()
      },

      scheduleReminder: function (event) {
        let dayBeforeEventStart = new Date(event.start_date)
        dayBeforeEventStart = dayBeforeEventStart.setDate(dayBeforeEventStart.getDate()-1)

        let hourBeforeEventStart = new Date(event.start_date)
        hourBeforeEventStart = hourBeforeEventStart.setDate(hourBeforeEventStart.getDate()-1)

        LocalNotifications.schedule([{
          title: ''+event.name+' is starting soon!',
          body: 'Tap here to get info and directions.',
          image: 'https://sfvm.la'+event.image,
          thumbnail: true,
          channel: 'SFVM Channel', // default: 'Channel'
          eventJSON: JSON.stringify(event),
          at: new Date(new Date().getTime() + (1 * 1000)) // 10 seconds from now
        }]).then((scheduledID) => {
          this.remindText = 'Reminder Set'
          this.remindMe = true
          this.reminderId = scheduledID
        }, (error) => {
          // COULDNT SET NOTIFICATION
        })

        LocalNotifications.addOnMessageReceivedCallback((notification) => {
          console.log(eventJSON)
          console.log(notification.eventJSON)
          let eventJSON = JSON.parse(notification.eventJSON)
          this.$navigateTo(EventPage, {props: {event: eventJSON}})
        })
      },

      getDirections: function (address) {
        directions.navigate({
          to: {
            address: address
          }
        })
      },

      openUrl: function (address) {
        utilsModule.openUrl(address)
      }
    },

    filters: {
      prettyDate: function (value) {
        return moment(value).format('MMM Do YYYY[\n]h:mm a')
      },
      eventEnds: function (value) {
        return 'Event ends: ' + moment(value).format('MMM Do, h:mm a')
      },
    },

    mounted() {
    }
  }
</script>

<style scoped>
ActionBar {
  background-color: black;
  color: #ffffff;
}
Button {
  background-color: black;
  color: #ffffff;
}

.eventName {
  margin: 75px 0 0 0;
}
.eventDetails {
  margin: 50px 0px;
}
.eventShortDescription {
  margin-bottom: 250px;
}
</style>