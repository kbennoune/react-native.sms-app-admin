export function toTimeDisplay(time) {
  try {
    const today = new Date();
    const todayDMY = [today.getDate(), today.getMonth(), today.getFullYear()];
    const timeDMY = [time.getDate(), time.getMonth(), time.getFullYear()];

    if (
      todayDMY[0] == timeDMY[0] &&
      todayDMY[1] == timeDMY[1] &&
      todayDMY[2] == timeDMY[2]
    ) {
      // Time is today
      const timeStr = time.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
      });
      return timeStr;
    } else {
      return time.toLocaleDateString();
    }
  } catch (err) {
    return "";
  }
}
