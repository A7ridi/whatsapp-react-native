import { Auth } from "aws-amplify";
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

const getRandomColor = () => {
  const lightColors = [
    "#FF5733",
    "#6A1B9A",
    "#039BE5",
    "#8BC34A",
    "#FFC107",
    "#FF5722",
    "#4CAF50",
    "#673AB7",
    "#009688",
    "#FF9800",
  ];

  // Get a random index from the array
  const randomIndex = Math.floor(Math.random() * lightColors.length);

  // Get the random color using the index
  return lightColors[randomIndex];
};

const getInitials = (name) => {
  const words = name.split(" ");
  let initials = "";

  if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase();
  } else if (words.length > 1) {
    initials = `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return initials || "NA";
};

const getAuthUserId = async () => {
  const authUser = await Auth.currentAuthenticatedUser();
  return authUser.attributes.sub;
};

const filterAuthUser = async (users) => {
  const authUser = await getAuthUserId();
  if (authUser) {
    const arr = users.filter((user) => user.id !== authUser);
    return arr;
  }
  return users;
};

export {
  sortMessageByDate,
  formatTime,
  formatDate,
  getNameFromEmail,
  getRandomColor,
  getInitials,
  getAuthUserId,
  filterAuthUser,
};
