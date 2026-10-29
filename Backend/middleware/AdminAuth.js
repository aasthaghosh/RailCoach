const jwt = require('jsonwebtoken')

require('dotenv').config();

exports.AdminAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        //  console.log("REQ COOKIES ", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "token is not found" })
        }

        // very the token
        try {
            // yee eek method h jo token ko verify krta h
            const payload = jwt.verify(token, process.env.JWT_TOKEN);
            // console.log(payload);
            req.user = payload;
            // return res.status(200).json({
            //     loggedIn: true,
            //     user: payload,
            // });
            // console.log(req.user);

        } catch (err) {
            return res.status(401).json({ success: false, message: "token is invalid" })
        }
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" })
    }
}


// to show all user to the admin;
const User = require("../model/user");
// exports.isadmin = async (req, res, next) => {
//     try {
//         const  userId  = req.user.id; // from JWT
        
//         const user = await User.findById(userId);

//         console.log(user);

//         if (user.role !== "admin") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied. Admin only.",
//             });
//         }

//         next();
//     } catch (err) {
//         return res.status(500).json({ success: false, message: err.message })
//     }
// }
exports.isadmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found (invalid token)",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};



// Super-admin header auth: read x-dev-key and compare to env
exports.SuperAdminAuth = (req, res, next) => {
    try {
        const devKey = req.get('x-dev-key');
        if (!devKey) return res.status(401).json({ success: false, message: "x-dev-key header missing" });
        if (devKey !== process.env.X_DEV_KEY) return res.status(403).json({ success: false, message: "invalid x-dev-key" });
        // mark request as superadmin
        req.user = { role: 'superadmin', id: 'superadmin' };
        return next();
    } catch (err) {
        return res.status(500).json({ success: false, message: "something went wrong" })
    }
}