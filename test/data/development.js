export const initialState = {
  app: {
    selectedTab: "Contacts",
    contactsPage: {},
    loadingData: false
  },
  appData: {
    business: { id: "12", name: "The Satiated Drink" },
    people: {
      "23": { id: "23", name: "Kamal Bennoune", mobile: "+5968576379" },
      "34": { id: "34", name: "Oscar Abellán", mobile: "+7597870713" }
    },
    textGroupPeople: {
      "543": { personId: 23, textGroupId: 12 },
      "944": { personId: 34, textGroupId: 12 },
      "34124": { personId: 34, textGroupId: 123 }
    },
    textGroups: {
      "12": { id: "12", name: "Managers" },
      "123": { id: "123", name: "Bartenders" }
    },
    channels: {}
  }
};
