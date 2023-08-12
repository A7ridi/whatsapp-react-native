import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const sortMessageByDate = (messages) => {
  return messages.sort((a, b) =>
    dayjs(b.chatRoom.updatedAt).isAfter(dayjs(a.chatRoom.updatedAt)) ? 1 : -1
  );
};

const formatTime = (timestamp) => dayjs(timestamp).format("MM/DD/YY, h:mm a");

const formatDate = (timestamp) => dayjs(timestamp).format("MM/DD/YY");

const getNameFromEmail = (str) => {
  let name = "";
  if (str.indexOf("@") > -1) {
    name = str.substring(0, str.indexOf("@"));
  } else name = str;

  return name;
};

export { sortMessageByDate, formatTime, formatDate, getNameFromEmail };
