import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.cookies.auth;
 console.log(token)
  if (!token) {console.log("No token");
  
    return res.status(401).json({ message: "Please Log in to continue" })};

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   
    next();
  } catch (err) {
    console.log("error:",err);
    
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;

