// import User from "../models/UserSchema.js";
// import bcrypt from "bcrypt";

// export const registerControllers = async (req, res, next) => {
//     try{
//         const {name, email, password} = req.body;

//         // console.log(name, email, password);

//         if(!name || !email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter All Fields",
//             }) 
//         }

//         let user = await User.findOne({email});

//         if(user){
//             return res.status(409).json({
//                 success: false,
//                 message: "User already Exists",
//             });
//         }

//         const salt = await bcrypt.genSalt(10);

//         const hashedPassword = await bcrypt.hash(password, salt);

//         // console.log(hashedPassword);

//         let newUser = await User.create({
//             name, 
//             email, 
//             password: hashedPassword, 
//         });

//         return res.status(200).json({
//             success: true,
//             message: "User Created Successfully",
//             user: newUser
//         });
//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }

// }
// export const loginControllers = async (req, res, next) => {
//     try{
//         const { email, password } = req.body;

//         // console.log(email, password);

//         if (!email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter All Fields",
//             }); 
//         }

//         const user = await User.findOne({ email });

//         if (!user){
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found",
//             }); 
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch){
//             return res.status(401).json({
//                 success: false,
//                 message: "Incorrect Email or Password",
//             }); 
//         }

//         delete user.password;

//         return res.status(200).json({
//             success: true,
//             message: `Welcome back, ${user.name}`,
//             user,
//         });

//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// }

// export const setAvatarController = async (req, res, next)=> {
//     try{

//         const userId = req.params.id;

//         const imageData = req.body.image;

//         const userData = await User.findByIdAndUpdate(userId, {
//             isAvatarImageSet: true,
//             avatarImage: imageData,
//         },
//         { new: true });

//         return res.status(200).json({
//             isSet: userData.isAvatarImageSet,
//             image: userData.avatarImage,
//           });


//     }catch(err){
//         next(err);
//     }
// }

// export const allUsers = async (req, res, next) => {
//     try{
//         const user = await User.find({_id: {$ne: req.params.id}}).select([
//             "email",
//             "username",
//             "avatarImage",
//             "_id",
//         ]);

//         return res.json(user);
//     }
//     catch(err){
//         next(err);
//     }
// }



import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export const registerControllers = async (req, res, next) => {
    try {
        console.log("========== REGISTER REQUEST ==========");
        console.log("Body:", req.body);
        console.log("Mongo URL Exists:", !!process.env.MONGO_URL);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log("User Created Successfully:", newUser._id);

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser,
        });
    } catch (err) {
        console.error("========== REGISTER ERROR ==========");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Stack:", err.stack);

        if (err.errors) {
            console.error("Validation Errors:", err.errors);
        }

        console.error("Request Body:", req.body);
        console.error("=====================================");

        return res.status(500).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: err.code || null,
                stack:
                    process.env.NODE_ENV === "development"
                        ? err.stack
                        : undefined,
            },
        });
    }
};

export const loginControllers = async (req, res, next) => {
    try {
        console.log("========== LOGIN REQUEST ==========");
        console.log(req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            });
        }

        const userObj = user.toObject();
        delete userObj.password;

        console.log("Login Success:", userObj._id);

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${userObj.name}`,
            user: userObj,
        });
    } catch (err) {
        console.error("========== LOGIN ERROR ==========");
        console.error(err);

        return res.status(500).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: err.code || null,
                stack:
                    process.env.NODE_ENV === "development"
                        ? err.stack
                        : undefined,
            },
        });
    }
};

export const setAvatarController = async (req, res, next) => {
    try {
        console.log("========== SET AVATAR ==========");

        const userId = req.params.id;
        const imageData = req.body.image;

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage: imageData,
            },
            { new: true }
        );

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (err) {
        console.error("========== SET AVATAR ERROR ==========");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find({
            _id: { $ne: req.params.id },
        }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(users);
    } catch (err) {
        console.error("========== ALL USERS ERROR ==========");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};