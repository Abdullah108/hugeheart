import bcrypt from "bcrypt";
/**
 * Encrypt the password using bcrypt algo
 */
const encryptPassword = (password: string, salt?: string): string => {
  salt = salt || generateSalt();
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare the password using bcrypt algo
 */
const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
/**
 * Generates Salt for the password
 */
const generateSalt = (length = 10): string => {
  return bcrypt.genSaltSync(length);
};

/**
 *
 */
const JWTSecrete: string = "qwertyuiop[]lkjhgfdazxcvbnm,./!@#$%^&*()";
/**
 *
 */
const generatePassword = (length = 10): string => {
  var text = "123456";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // for (var i = 0; i < length; i++)
  //   text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
export {
  encryptPassword,
  comparePassword,
  generateSalt,
  JWTSecrete,
  generatePassword,
};
