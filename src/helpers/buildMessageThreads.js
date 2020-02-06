export default function buildMessageThreads(
  channels,
  messages,
  dataPeople,
  dataTextGroups,
  dataTextGroupPeople,
  activeThreadId,
  currentPerson
) {
  const { id: currentPersonId } = { ...currentPerson };
  const groupedMessages = Object.values(messages).reduce(groupByChannelId, {});
  const messageThreads = Object.keys(channels).reduce(
    groupIntoThreads(
      channels,
      dataPeople,
      currentPersonId,
      currentPerson,
      dataTextGroupPeople,
      groupedMessages,
      activeThreadId,
      dataTextGroups,
      dataPeople
    ),
    { threads: [], activeThread: null }
  );

  const { threads: disorderedThreads, activeThread } = messageThreads;
  const threads = disorderedThreads.sort(
    (
      { lastMessageTime: lastMessageTimeA },
      { lastMessageTime: lastMessageTimeB }
    ) => lastMessageTimeB - lastMessageTimeA
  );
  return { threads, activeThread };
}

function filterAndAssignSender(dataPeople) {
  return (filteredMessages, message) => {
    const fromPerson = message.senderId
      ? { name: "?", ...dataPeople[message.senderId] }
      : { name: "Text Herd" };

    const messageTime = (messageTime => {
      try {
        return new Date(messageTime);
      } catch (err) {
        return null;
      }
    })(message.messageTime || message.createdAt);

    if (message.appDirection == "out") {
      return [...filteredMessages, { ...message, fromPerson, messageTime }];
    } else {
      return filteredMessages;
    }
  };
}

const chooseActiveThread = (stateThreadId, thread, storedActiveThread) => {
  if (stateThreadId) {
    if (stateThreadId !== thread.id && storedActiveThread) {
      return storedActiveThread;
    } else {
      return thread;
    }
  } else {
    if (storedActiveThread && storedActiveThread.topic == "root") {
      return thread;
    } else if (storedActiveThread && thread.topic == "root") {
      return storedActiveThread;
    } else if (
      storedActiveThread &&
      storedActiveThread.lastMessageTime > thread.lastMessageTime
    ) {
      return storedActiveThread;
    } else {
      return thread;
    }
  }
};

const groupByChannelId = (acc, message) => {
  return {
    ...acc,
    [message.channelId]: [...(acc[message.channelId] || []), message]
  };
};

function groupIntoThreads(
  channels,
  dataPeople,
  currentPersonId,
  currentPerson,
  dataTextGroupPeople,
  groupedMessages,
  activeThreadId,
  dataTextGroups
) {
  return (acc, threadId) => {
    const channel = channels[threadId];

    const people = channel.personIds.map(personId => {
      const { [personId]: listedPerson } = {
        [personId]: { id: null },
        ...dataPeople,
        [currentPersonId]: { ...currentPerson, name: "You" }
      };

      return listedPerson;
    });

    const textGroups = channel.textGroupIds.map(textGroupId => {
      return { ...(dataTextGroups[textGroupId] || { id: null }) };
    });

    const includedPeopleIds = Object.values(dataTextGroupPeople || {}).reduce(
      (acc, { personId, textGroupId }) => {
        if (channel.textGroupIds.includes(Number(textGroupId))) {
          return [...acc, String(personId)];
        } else {
          return acc;
        }
      },
      []
    );
    const allPeopleIds = [
      ...people.map(({ id }) => String(id)),
      ...includedPeopleIds
    ];
    const independentPeople = people.filter(
      ({ id }) => !includedPeopleIds.includes(id)
    );
    const isParticipant = allPeopleIds.includes(String(currentPersonId));

    const displayNames = [...textGroups, ...independentPeople].map(
      ({ name }) => name
    );

    const messages = (groupedMessages[channel.id] || [])
      .reduce(filterAndAssignSender(dataPeople), [])
      .sort(
        ({ messageTime: messageTimeA }, { messageTime: messageTimeB }) =>
          messageTimeB - messageTimeA
      );

    // Filter out empty and meaningless threads
    if (people.length == 0 && textGroups.length == 0 && messages == 0) {
      return acc;
    } else {
      const [{ messageTime: lastMessageTime }] = [
        ...messages,
        { messageTime: null }
      ];
      const thread = {
        ...channel,
        people,
        textGroups,
        messages,
        displayNames,
        lastMessageTime,
        isParticipant
      };
      const activeThread = chooseActiveThread(
        activeThreadId,
        thread,
        acc.activeThread
      );
      const threads = [...acc.threads, thread];

      return { threads, activeThread };
    }
  };
}
