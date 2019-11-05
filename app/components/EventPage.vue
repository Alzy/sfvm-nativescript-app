<template>
  <Page backgroundSpanUnderStatusBar="true" backgroundColor="black" statusBarStyle="dark" androidStatusBarBackground="black">
    <ActionBar>
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"/>
      <Label :text="$props.event.name" fontSize="24" verticalAlignment="center"/>
    </ActionBar>
    <FlexboxLayout backgroundColor="black" color="white" flexDirection="column">      
      <!-- Events List -->
      <ScrollView>
        <StackLayout>
          <FlexboxLayout flexDirection="row">
              <Image :src="'https://sfvm.la'+$props.event.image" loadMode="sync" stretch="aspectFill"/>`
          </FlexboxLayout>
          <FlexboxLayout flexDirection="row">
              <Label :text="$props.event.name" fontSize="24" textWrap="true" />
          </FlexboxLayout>
          
          <FlexboxLayout flexDirection="row" class="eventDetails">
              <Label :text="(event.price == '0.00' ? 'FREE' : '$'+event.price)" flexGrow="1" textWrap="true" width="33.333%"/>
              <Label :text="$props.event.start_date | prettyDate" flexGrow="1" textWrap="true" width="33.333%"/>
              <Label :text="$props.event.address + ', ' + $props.event.city" flexGrow="1"  textWrap="true" width="33.333%"/>
          </FlexboxLayout>

          <FlexboxLayout flexDirection="column" class="eventShortDescription">
              <Label :text="$props.event.short_description" textWrap="true"/>
          </FlexboxLayout>
          <FlexboxLayout flexDirection="row" color="white" class="eventDescription">
              <HtmlView :html="$props.event.description" textWrap="true" color="white" class="eventDescriptionHtml"/>
          </FlexboxLayout>
        </StackLayout>
      </ScrollView>
    </FlexboxLayout>
  </Page>
</template>

<script >
  var moment = require('moment');

  export default {
    props: ['event'],

    data() {
      return {
      }
    },

    methods: {
      goBack: function () {
        this.$navigateBack()
      },
    },

    filters: {
      prettyDate: function (value) {
        return moment(value).format('MMM Do YYYY[\n]h:mm a')
      }
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

.eventDetails {
  margin: 50px 0px;
}
.eventDescriptionHtml {
  color: white;
}
</style>