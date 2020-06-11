/**
 * get ip address
 */
export const getIpAddress = (req: Request | any) => {
  var ip: string | null = null;
  try {
    ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  } catch (ex) {
    console.log(ex);
    ip = null;
  }
  return ip;
};
