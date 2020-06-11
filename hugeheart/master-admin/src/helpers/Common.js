export const getUserToken = () => {
  return localStorage.getItem("token");
};
export const getURLExtension = (url) => {
  return (
    url
      // eslint-disable-next-line no-useless-escape
      .split(/\#|\?/)[0]
      .split(".")
      .pop()
      .trim()
  );
};

const subjectList = [
  "Mastery Mathematics",
  "Mastery English",
  "Mastery General Ability",
  "Mastery Physics",
  "Mastery Chemistry",
  "Mastery Biology",
  "Mastery Public Speaking and Debating",
  "Mastery Japanese",
  "Mastery Adult English",
  "Mastery Robotics",
  "Mastery Lego",
  "Mastery Business Studies",
  "Mastery Legal Studies",
  "Mastery Geography",
  "Mastery History",
  "Mastery Accounting",
  "Mastery Engineering",
  "Mastery Marketing",
];

const subjectOptions = [];
for (let index = 0; index < subjectList.length; index++) {
  const subject = subjectList[index];
  subjectOptions.push({ value: subject, label: subject });
}

export const SubjectOptions = subjectOptions;

let classList = [
  {
    label: "Kindergarten",
    value: "Kindergarten",
  },
];
for (let index = 1; index <= 12; index++) {
  classList.push({ value: index, label: "Year " + index });
}
/**
 *
 */
export const isValidMessage = (text) => {
  // eslint-disable-next-line no-useless-escape
  const emailRegx = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  const phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;

  return !emailRegx.test(text) && !phoneExp.test(text);
};

/**
 *
 */
export const ClassList = classList;

export const gePriceByYear = (priceData, year) => {
  year = year && year.toLowerCase() === "kindergarten" ? 1 : year;
  for (const key in priceData) {
    if (priceData.hasOwnProperty(key)) {
      const k = key.split("-");
      if (Number(year) >= Number(k[0]) && Number(year) <= Number(k[1])) {
        return Number(priceData[key]);
      }
    }
  }
  return 0;
};
