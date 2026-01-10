const cookieName = "_sess"
const sendCookie = (res, data) => {
  res.cookie(cookieName, data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 7,
  });
};

module.exports = {cookieName, sendCookie}