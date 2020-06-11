export const getURLExtension = url => {
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
  "Mastery Marketing"
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
    value: "Kindergarten"
  }
];
for (let index = 1; index <= 12; index++) {
  classList.push({ value: index.toString(), label: "Year " + index });
}

export const ClassList = classList;

export const textCapitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 *
 */
export const AvailableCountries = [
  {
    name: "Australia",
    states: [
      {
        name: "NSW"
      },
      {
        name: "South Australia"
      }
    ]
  },
  {
    name: "United States",
    states: [
      {
        name: "Los Angeles"
      },
      {
        name: "Cambridge"
      },
      {
        name: "Massachusetts"
      }
    ]
  },
  {
    name: "United Kingdom",
    states: [
      {
        name: "London"
      }
    ]
  },
  {
    name: "India",
    states: [
      {
        name: "New Delhi"
      },
      {
        name: "Mumbai"
      }
    ]
  },
  {
    name: "China",
    states: [
      {
        name: "Beijing"
      },
      {
        name: "Shanghai"
      }
    ]
  },
  {
    name: "South Korea",
    states: []
  },
  {
    name: "New Zealand",
    states: []
  }
];
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
