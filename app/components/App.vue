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
            <FlexboxLayout flexDirection="row" class="bgWrapper" height="500">
              <ImageCacheIt :src="'https://sfvm.la/static/images/bg/bg'+Math.ceil(Math.random()*14)+'.jpg'" loadMode="sync" stretch="aspectFill"/>
            </FlexboxLayout>
          </v-template>

          <v-template if="'date' in event">
            <!-- date label -->
            <FlexboxLayout flexDirection="row" class="dateWrapper">
              <Label :text="'>> ' + event.date" fontSize="24" textWrap="true" class="date"/>
            </FlexboxLayout>
          </v-template>

          <v-template>
            <!-- event listing -->
            <FlexboxLayout flexDirection="row" width="100%">
              <FlexboxLayout flexDirection="column" class="eventImageWrapper" width="30%" @tap="eventTap(event)">
                <ImageCacheIt :src="'https://sfvm.la'+event.image" loadMode="sync" class="eventImage"/>
              </FlexboxLayout>
              <FlexboxLayout flexDirection="column" class="eventDetails" width="70%" @tap="eventTap(event)">
                <Label :text="event.name" fontSize="22" textWrap="true"/>
                <Label :text="(event.price == '0.00' ? 'FREE' : '$'+event.price)" />
                <Label :text="event.city" />
                <!-- <Label :text="event.short_description" flexGrow="1" textWrap="true"/> -->
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
      let weekday = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

      axios.get('https://sfvm.la/api/v1/events').then(response => {
        let res = response.data
        for (let index = 0; index < res.length; index++){
          let item = res[index]
          let dt = new Date(item.start_date)
          let dateStr = weekday[dt.getDay()] + '  (' + (dt.getMonth()+1) + ' / ' + dt.getDate() + ')'

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
        res.splice(0, 0, {'bg': 'null'})
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
  padding: 75px 25px 50px 25px;
}
.dateWrapper:first-child {
  padding: 50px 25px;
}
.date {
}


.eventImage {
  margin-top: 25px;
}
.eventDetails {
  margin: 0 22px 22px 32px;
}
</style>
