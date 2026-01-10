const cookieName = "_sess"

const opts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 7,
};

const sendCookie = (res, data, name=cookieName) => {
  res.cookie(name, data, opts );
};

const removeCookie = (res, name=cookieName)=>{
  res.clearCookie(name, opts);
}


module.exports = {cookieName, sendCookie, removeCookie}