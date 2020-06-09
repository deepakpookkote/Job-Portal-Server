const User = require('../models/user');
const Profile = require('../models/profile');
const { validationResult } = require('express-validator')

exports.getUserById = async (req, res, next, id) => {
    try {
        user = await User.findById(id).exec();
        if (!user) {
            return res.status(422).json({
                message: 'User Not Found!!'
            })
        }
        req.profile = user;
        next();

    } catch (error) {
        return res.status(500).json('something went wrong');
    }
};

exports.getUser = (req, res, next) => {
    //get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.addProfileInfo = async (req, res, next) => {

    const updateErrors = validationResult(req);

    if (!updateErrors.isEmpty()) {
        return res.status(422).json({
            error: updateErrors.array()[0].msg,
            params: updateErrors.array()[0].param
        });
    }
    const name = req.body.name;
    const aboutme = req.body.aboutme;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const skills = req.body.skills;
    const location = req.body.location;
    const userId = req.body.user

    try {
        const userInfo = new Profile({
            user: userId,
            name: name,
            aboutme: aboutme,
            email: email,
            mobile: mobile,
            skills: skills,
            location: location
        });
        const result = await userInfo.save();
        const user = await User.findById(userId);
        user.profile.push(result);
        await user.save();
        res.status(201).json({
            message: 'Profile Info added successfully!',
            profile: result,
            user: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Not able to update information in db'
        })
    }
}


exports.getProfileById = async (req, res, next, id) => {
    try {
        profile = await Profile.findById(id).exec();
        if (!profile) {
            return res.status(422).json({
                message: 'Profile Not Found!!'
            })
        }
        req.userProfile = profile;
        next();

    } catch (error) {
        return res.status(500).json('something went wrong while fetching profile');
    }
}


exports.getUserProfileInfo = (req, res, next) => {
    return res.status(200).json(req.userProfile);
}


exports.updateProfileInfo = async (req, res, next) => {
    const updateErrors = validationResult(req);

    if (!updateErrors.isEmpty()) {
        return res.status(422).json({
            error: updateErrors.array()[0].msg,
            params: updateErrors.array()[0].param
        });
    }

    const profileId = req.userProfile._id;
    const userId = req.profile._id;

    try {
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(422).json({
                message: 'Profile Not Found!!'
            })
        }
        if (profile.user._id.toString() !== userId.toString()) {
            return res.status(422).json({
                message: 'Not Authorized'
            })
        }
        const result = await Profile.findByIdAndUpdate(
            { _id: req.userProfile._id },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        );
        res.status(200).json({
            message: 'Post updated',
            profile: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json('something went wrong while updating profile');
    }
}

exports.getAllProfile = async(req, res, next) => {
    try {
        const regEx = new RegExp(`${req.query.searchQuery}`);
        const searchObj = !!req.query.searchQuery ? { $or:[{'name': {$regex: regEx, $options: 'i'}},{'skills': {$in: [regEx]}}]} : {};
        const profiles = await Profile.find(searchObj);
        if(!profiles) {
            return res.status(422).json({
                message: 'no profiles found'
            })
        }
        res.status(200).json({
            message: 'success',
            profile: profiles
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json('something went wrong');
    }
}




