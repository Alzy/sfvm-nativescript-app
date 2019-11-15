<template>
  <Page backgroundSpanUnderStatusBar="true" backgroundColor="black" statusBarStyle="dark" androidStatusBarBackground="black">
    <ActionBar>
      <!-- <NavigationButton android.systemIcon="ic_menu_back" /> -->
      <Image src="~/assets/images/logo.png" stretch="none" />
      <!-- <Label text="SFVM" fontSize="24" verticalAlignment="center" /> -->
      <ActionItem @tap="submitEvent"
        ios.systemIcon="4" ios.position="right"
        android.systemIcon="ic_menu_add" />
    </ActionBar>
    <FlexboxLayout backgroundColor="black" color="white" flexDirection="column">      
      <!-- Events List -->
      <ScrollView flexGrow="1">
        <ListView for="event in events" minHeight="1920" flexGrow="1" class="eventsList">
          <v-template if="'bg' in event">
            <!-- bg image @ beginning of list -->
            <FlexboxLayout flexDirection="column" class="bgWrapper">
              <ImageCacheIt :src="event.bg" stretch="aspectFill" height="300"/>
            </FlexboxLayout>
          </v-template>

          <v-template if="'date' in event">
            <!-- date label -->
            <FlexboxLayout flexDirection="row" class="dateWrapper">
              <Label :text="'>> ' + event.date" fontSize="24" textWrap="true" :class="$index == 1 ? 'firstDate' : 'date'"/>
            </FlexboxLayout>
          </v-template>

          <v-template>
            <!-- event listing -->
            <FlexboxLayout flexDirection="row" width="100%" marginBottom="50px" class="eventListing">
              <FlexboxLayout flexDirection="column" class="eventImageWrapper" width="30%" @tap="eventTap(event)">
                <ImageCacheIt :src="'https://sfvm.la'+event.image" class="eventImage" stretch="aspectFit" width="100%"/>
              </FlexboxLayout>
              <FlexboxLayout flexDirection="column" class="eventDetails" width="70%" @tap="eventTap(event)">
                <Label :text="event.name" fontSize="22" textWrap="true"/>
                <Label :text="(event.price == '0.00' ? 'FREE' : '$'+event.price)" />
                <Label :text="event.city" />
              </FlexboxLayout>
            </FlexboxLayout>
          </v-template>
        </ListView>
      </ScrollView>
    </FlexboxLayout>
  </Page>
</template>

<script >
  const axios = require('axios')
  const platformModule = require("tns-core-modules/platform");
  const utilsModule = require("tns-core-modules/utils/utils");
  const moment = require('moment');

  import EventPage from './EventPage'

  export default {
    data() {
      return {
        events: [],
      }
    },

    mounted() {
      const today = new Date()
      let currDateCheck = today
      let skipTmrwYestCheck = false

      axios.get('https://sfvm.la/api/v1/events').then(response => {
        let res = response.data
        for (let index = 0; index < res.length; index++){
          let item = res[index]
          let dt = new Date(item.start_date)
          let dateStr = moment(dt).format('MMM. Do')

          // if start of todays events list
          if (index == 0 && (dt.getMonth() == today.getMonth()) && (dt.getDate() == today.getDate())) {
            res.splice(index, 0, {
              'date': 'TODAY'
            })
            continue
          }

          if ((dt.getMonth() != currDateCheck.getMonth()) || (dt.getDate() != currDateCheck.getDate())) {
            // if start of yesterday or tomorrows events list
            if (skipTmrwYestCheck == false && (dt.getMonth() == today.getMonth())) {
              if ((dt.getDate() == today.getDate()+1)) {
                dateStr = 'TOMORROW'
                skipTmrwYestCheck = true
              } else if ((dt.getDate() == today.getDate()-1)){
                dateStr = 'YESTERDAY'
                skipTmrwYestCheck = true
              }
            }
            currDateCheck = dt
            res.splice(index, 0, {
              'date': dateStr
            })
          }
        }
        res.splice(0, 0, {'bg': 'https://sfvm.la/static/images/bg/bg'+Math.ceil(Math.random()*14)+'.jpg'})
        console.log('events list reloaded')
        this.events = res
      })
    },
    
    methods: {
      eventTap: function (args) {
        this.$navigateTo(EventPage, {props: {event: args}})
      },

      submitEvent: function () {
        utilsModule.openUrl("https://sfvm.la/submit-event")
      }
    },

    components: {
      EventPage
    }
  }
</script>

<style scoped>
ActionBar {
  background-color: black;
  color: #ffffff;
}

.dateWrapper {
  padding: 50px 25px 50px 25px;
}
.date {
  margin-top: 150px;
}

.eventImageWrapper {
  margin-bottom: 75px;
}
.eventDetails {
  margin: 0px 22px 22px 32px;
}
</style>
