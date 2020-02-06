import { StyleSheet } from "react-native";

export const colors = {
  // This is the color of carmine under the overlay
  off_black: "#0c0904",
  ebony_clay: "#2E343B",
  midnight_express: "#000036",
  nero: "#292929",
  dim_gray: "#656565",
  night_rider: "#333333",
  maroon: "#550000",
  carmine: "#aa4436",
  medium_carmine: "#b33d2d",
  tahiti_gold: "#ef7429",
  chilean_fire: "#DA5A29",
  orange_red: "#FF4500",
  old_rose: "#bf3b4b",
  rouge: "#aa3662",
  strong_red: "#AA0000",
  bakers_chocolate: "#4f2608",
  caput_mortuum: "#652922",
  crab_apple: "#88362b",
  thunderbird: "#973c30",
  seal_brown: "#320a0a",
  metallic_copper: "#64433D",
  russet: "#7C5F56",
  seal_brown2: "#2a150D",
  light_grey: "#d3d3d3",
  ios_keyboard_grey: "#D0D3D7",
  raffia: "#f6efe4",
  solitaire: "#ead9bd",
  akaroa: "#968B79",
  frangipani: "#FED3A7",
  cape_honey: "#FDE3A7",
  palatinate_purple: "#600060",
  cerulean_blue: "#3622aa",
  egyption_blue: "#1f3a93",
  dodger_blue: "#1E90FF",
  deep_sky_blue: "#19b5fe",
  malibu: "#63AED5",
  light_cyan: "#e0ffff",
  sea_green: "#36a8aa",
  apple: "#62aa36",
  forest_green: "#30973c",
  pear: "#c9f227",
  limon_chiffon: "#fffacd",
  gold: "#FFD700"
};

const styles = StyleSheet.create({
  overlayContent: {
    padding: 0,
    flex: 0
  },
  tabBarItem: {
    fontSize: 20,
    textAlign: "center",
    color: "#FFFFFF"
  },
  activityIndicator: {
    fontSize: 30,
    flex: 1,
    flexShrink: 0,
    flexBasis: 1
  },
  description: {
    fontSize: 30,
    color: colors.dim_gray,
    flexGrow: 7,
    flexShrink: 2,
    flexBasis: 2
  },
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: colors.night_rider,
    marginBottom: 5
  },
  separator: {
    height: 0,
    width: "60%",
    backgroundColor: "#dec396",
    alignSelf: "flex-start",
    marginLeft: 16
  },
  listBoundary: {
    height: 1,
    backgroundColor: colors.solitaire,
    marginLeft: 0
  },
  listItemContent: {
    flexDirection: "row",
    padding: 0
  },
  selectRecipientsItem: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingLeft: 0,
    paddingRight: 4
  },
  selectRecipientsHeader: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1
  },
  textMessageText: {
    flex: 1,
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 10,
    opacity: 1,
    maxWidth: 180,
    minWidth: 70,
    height: "auto",
    paddingRight: 9,
    paddingLeft: 10,
    alignItems: "center"
  },
  textMessageTextCurrentPerson: {
    backgroundColor: colors.chilean_fire,
    borderBottomColor: colors.chilean_fire
  },
  textMessageTextPerson: {
    backgroundColor: colors.thunderbird,
    borderBottomColor: colors.thunderbird
  },
  textMessageTextSystem: {
    backgroundColor: colors.light_grey,
    borderBottomColor: colors.light_grey
  },
  textMessageReceive: {
    paddingRight: 0,
    marginTop: 10,
    flexDirection: "row",
    width: "100%"
  },
  messageStarterButton: {
    width: 80,
    backgroundColor: colors.bakers_chocolate,
    borderWidth: 1,
    borderColor: colors.bakers_chocolate,
    flexGrow: 1
  },
  messageStarterButtonCtn: {
    flexDirection: "row",
    marginRight: 0,
    flex: 0,
    height: 40,
    alignSelf: "center",
    justifyContent: "flex-end"
  },
  listedCardCtn: {
    padding: 5,
    backgroundColor: colors.raffia,
    borderColor: colors.solitaire,
    borderRadius: 5,
    marginTop: 10
  },
  listedCardWrp: {
    flexDirection: "row",
    padding: 0,
    paddingTop: 4,
    paddingBottom: 4,
    justifyContent: "space-between"
  },
  listedCardHeaderCtn: {
    padding: 5,
    borderWidth: 0,
    backgroundColor: colors.solitaire,
    marginVertical: 10
  },
  listedCardHeaderWrp: {
    justifyContent: "center",
    flexDirection: "row"
  },
  textMessageTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    position: "absolute",
    bottom: 20,
    zIndex: -1
  },
  leftTextMessageTail: {
    transform: [{ translateX: 34 }, { rotate: "225deg" }]
  },
  rightTextMessageTail: {
    transform: [{ translateX: -34 }, { rotate: "135deg" }]
  },
  textMessageBubble: {
    flex: 0,
    width: "100%"
  },
  leftTextMessageBubble: {
    alignItems: "flex-start",
    paddingLeft: 6
  },
  rightTextMessageBubble: {
    alignItems: "flex-end",
    paddingRight: 6
  },
  textMessageHeading: {
    marginTop: 13,
    flexDirection: "column"
  },
  rightTextMessageHeading: {
    justifyContent: "flex-end"
  },
  leftTextMessageHeading: {
    justifyContent: "flex-start"
  },
  textMessageHeadingName: {
    marginRight: 5,
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 12,
    flex: 0
  },
  textMessageHeadingTime: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 12,
    flex: 0
  },
  ActiveMessageThreadContainer: {
    paddingTop: 0,
    alignItems: "flex-end"
  },
  downwardTriangle: {
    borderTopWidth: 30,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent"
  },
  textMessageParagraphPerson: {
    color: colors.limon_chiffon
  },
  textMessageParagraphCurrentPerson: {
    color: colors.seal_brown2
  },
  textMessageParagraphSystem: {
    color: colors.ebony_clay
  },
  textMessageParagraph: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 16,
    maxWidth: "82%",
    position: "relative"
  },
  textMessageSubmit: {
    zIndex: 20,
    position: "absolute",
    flex: 0,
    right: 4,
    bottom: -14,
    borderRadius: 11
  },
  textMessageSubmitBtn: {
    borderRadius: 16,
    backgroundColor: colors.forest_green
  },
  formCtn: {
    paddingBottom: 8,
    flexDirection: "column",
    flex: 1
  },
  formHeaderCtn: {
    backgroundColor: colors.chilean_fire,
    paddingVertical: 8
  },
  formHeader: {
    alignSelf: "center",
    fontSize: 18,
    color: "#FFFFFF"
  },
  formError: {
    textAlign: "right",
    flexShrink: 0,
    flexBasis: "76%",
    fontSize: 12,
    marginTop: 0,
    marginRight: 0,
    color: colors.strong_red
  }
});

export default styles;
