import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const sortMessageByDate = (messages) => {
  return messages.sort((a, b) =>
    dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1
  );
};

const formatTime = (timestamp) => dayjs(timestamp).format("MM/DD/YY, h:mm a");

const formatDate = (timestamp) => dayjs(timestamp).format("MM/DD/YY");

export { sortMessageByDate, formatTime, formatDate };
