const _validFileExtensions = [
  "image/jpg",
  "image/jpeg",
  "image/bmp",
  "image/gif",
  "image/png",
];
export const ValidateImage = (image) => {
  const type = image.type;
  const size = image.size;

  return _validFileExtensions.indexOf(type) > -1 && size <= 20480000;
};

export const ValidateFile = (file) => {
  const name = file.name;
  const size = file.size;
  return (
    /\.(doc|docx|ppt|pptx|xls|xlxs|pdf|zip|rar)$/i.test(name) &&
    size <= 204800000000
  );
};
